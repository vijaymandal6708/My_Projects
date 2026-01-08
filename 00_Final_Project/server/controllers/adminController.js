const AdminModel = require("../models/AdminModel");
const ProductModel = require("../models/ProductModel");
const Order = require("../models/OrderModel");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../cloudinary");
const jwt = require("jsonwebtoken");

// Set up Cloudinary storage for multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "product_images",
    resource_type: "image",

    // ✅ force all images to JPG (fixes HEIC / PNG issues)
    format: "jpg",

    public_id: (req, file) =>
      Date.now() + "-" + file.originalname.replace(/\s+/g, "_"),
  },
});

/* ================= MULTER ================= */
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB per image
  },
}).array("images", 10);


const adminLogin = async (req, res) => {
  try {
    const { adminEmail, adminPassword } = req.body;

    // 1️⃣ Check admin exists
    const admin = await AdminModel.findOne({ adminEmail });

    if (!admin) {
      return res.status(401).json({ msg: "Invalid Admin Email" });
    }

    // 2️⃣ Plain password check (as you want)
    if (admin.adminPassword !== adminPassword) {
      return res.status(401).json({ msg: "Invalid Password" });
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      {
        userId: admin._id,
        role: "admin", // 👈 REQUIRED for admin dashboard
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // 4️⃣ Response
    res.status(200).json({
      msg: "Admin login successful",
      token,
      admin: {
        id: admin._id,
        email: admin.adminEmail,
        role: "admin",
      },
    });

  } catch (error) {
    console.error("Admin login error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = adminLogin;

const addProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("❌ MULTER / CLOUDINARY ERROR FULL:", err);
  console.error("❌ ERROR NAME:", err.name);
  console.error("❌ ERROR MESSAGE:", err.message);
  console.error("❌ ERROR CODE:", err.http_code);
      console.error("UPLOAD ERROR:", err);
      return res.status(500).json({
        msg: "Image upload failed",
        error: err.message,
      });
    }

    try {
      const imageUrls =
        req.files && req.files.length > 0
          ? req.files.map((file) => file.path)
          : [];

      const product = await ProductModel.create({
        name: req.body.name,
        category: req.body.category.toLowerCase(),
        MRP: req.body.MRP,
        price: req.body.price,
        quantity: req.body.quantity,
        starRating: Number(req.body.starRating),
        description: req.body.description,
        defaultImage: imageUrls[0] || "",
        images: imageUrls,
      });

      res.status(200).json({
        success: true,
        product,
      });
    } catch (error) {
      console.error("SAVE PRODUCT ERROR:", error);
      res.status(500).json({
        msg: "Product save failed",
        error: error.message,
      });
    }
  });
};


const getDashboardStats = async (req, res) => {
  try {
    /* ===== PRODUCTS BY CATEGORY ===== */
    const productCategories = await ProductModel.aggregate([
  {
    $project: {
      category: {
        $switch: {
          branches: [
            {
              case: {
                $in: [
                  { $toLower: "$category" },
                  ["laptop", "laptops"]
                ]
              },
              then: "laptops",
            },
            {
              case: {
                $in: [
                  { $toLower: "$category" },
                  ["smartphone", "smartphones", "mobile", "mobiles"]
                ]
              },
              then: "smartphones",
            },
            {
              case: {
                $in: [
                  { $toLower: "$category" },
                  ["camera", "cameras"]
                ]
              },
              then: "cameras",
            },
            {
              case: {
                $in: [
                  { $toLower: "$category" },
                  ["accessory", "accessories"]
                ]
              },
              then: "accessories",
            },
          ],
          default: "other",
        },
      },
    },
  },
  {
    $group: {
      _id: "$category",
      count: { $sum: 1 },
    },
  },
]);


    /* ===== ORDERS & REVENUE (already exists) ===== */
    const monthlyRevenue = await Order.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          revenue: { $sum: "$totalAmount" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const revenueByCategory = await Order.aggregate([
  { $unwind: "$items" },
  {
    $project: {
      category: {
        $switch: {
          branches: [
            { case: { $in: [{ $toLower: "$items.category" }, ["laptop", "laptops"]] }, then: "laptops" },
            { case: { $in: [{ $toLower: "$items.category" }, ["smartphone", "smartphones"]] }, then: "smartphones" },
            { case: { $in: [{ $toLower: "$items.category" }, ["camera", "cameras"]] }, then: "cameras" },
            { case: { $in: [{ $toLower: "$items.category" }, ["accessory", "accessories"]] }, then: "accessories" }
          ],
          default: "other"
        }
      },
      amount: { $multiply: ["$items.price", "$items.quantity"] }
    }
  },
  {
    $group: {
      _id: "$category",
      size: { $sum: "$amount" }
    }
  }
]);


    const weeklyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dayOfWeek: "$createdAt" },
          orders: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        productCategories,
        revenueByCategory,
        monthlyRevenue,
        weeklyOrders,
      },
    });
  } catch (err) {
    console.error("Dashboard stats error:", err);
    res.status(500).json({ success: false });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (err) {
    console.error("Admin get orders error:", err);
    res.status(500).json({ success: false });
  }
};

const getProductsWithStock = async (req, res) => {
  try {
    const products = await ProductModel.find().select(
      "name category price quantity defaultImage"
    );

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    console.error("Fetch products error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch products",
    });
  }
};

const getProductToEdit = async (req, res) => {
  try {
    const product = await ProductModel.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (err) {
    console.error("Admin get product error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      console.error("Upload error:", err);
      return res.status(500).json({
        success: false,
        message: "Image upload failed",
      });
    }

    try {
      const { id } = req.params;

      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      /* ================= SAFE BODY PARSING ================= */
      const name = req.body.name;
      const category = req.body.category;
      const price = req.body.price;
      const quantity = req.body.quantity;
      const description = req.body.description;

      /* ================= DELETE IMAGES ================= */
      let updatedImages = [...product.images];

      if (req.body.deletedImages) {
        const imagesToDelete = Array.isArray(req.body.deletedImages)
          ? req.body.deletedImages
          : [req.body.deletedImages];

        updatedImages = updatedImages.filter(
          (img) => !imagesToDelete.includes(img)
        );
      }

      /* ================= ADD NEW IMAGES ================= */
      if (req.files && req.files.length > 0) {
        const newImageUrls = req.files.map((file) => file.path);
        updatedImages.push(...newImageUrls);
      }

      /* ================= UPDATE PRODUCT ================= */
      product.name = name;
      product.category = category;
      product.price = price;
      product.quantity = quantity;
      product.description = description;
      product.images = updatedImages;
      product.defaultImage = updatedImages[0] || "";
      product.starRating = Number(product.starRating) || 0;

      await product.save();

      res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product,
      });
    } catch (error) {
      console.error("❌ UPDATE PRODUCT ERROR:", error);
      res.status(500).json({
        success: false,
        message: "Server error",
      });
    }
  });
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await ProductModel.findById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    /* ===== DELETE IMAGES FROM CLOUDINARY ===== */
    if (product.images && product.images.length > 0) {
      for (const imgUrl of product.images) {
        try {
          const publicId = imgUrl
            .split("/")
            .slice(-1)[0]
            .split(".")[0];

          await cloudinary.uploader.destroy(
            `product_images/${publicId}`
          );
        } catch (err) {
          console.error("Cloudinary delete error:", err.message);
        }
      }
    }

    /* ===== DELETE PRODUCT FROM DB ===== */
    await ProductModel.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("❌ DELETE PRODUCT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};



module.exports = {
  adminLogin,
  addProduct,
  getDashboardStats,
  getAllOrders,
  getProductsWithStock,
  getProductToEdit,
  updateProduct,
  deleteProduct,
};
