const ProductModel = require("../models/ProductModel")

const productDisplay = async (req,res) => {
  const productdisplay = await ProductModel.find({});
  res.send(productdisplay); 
}

const productDetail = async (req,res) => {
  console.log("REQ ID:", req.params.id);

  const product = await ProductModel.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ msg: "Product not found" });
  }

  res.json(product);
}

const getByCategory = async (req, res) => {
  try {
    const category = req.params.category.toLowerCase();

    const page = parseInt(req.query.page) || 1;
    const limit = 8;
    const skip = (page - 1) * limit;

    const totalProducts = await ProductModel.countDocuments({ category });

    const products = await ProductModel.find({ category })
      .skip(skip)
      .limit(limit)

    res.status(200).json({
      products,
      currentPage: page,
      totalPages: Math.ceil(totalProducts / limit),
      totalProducts,
    });
  } catch (error) {
    console.error("GetByCategory Error:", error);
    res.status(500).json({ msg: "Failed to fetch category products" });
  }
};

const productSearch = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) {
      return res.json([]);
    }

    const products = await ProductModel.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
      ],
    }).limit(20);

    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Search failed" });
  }
};


module.exports = {
    productDisplay,
    productDetail,
    getByCategory,
    productSearch,
}