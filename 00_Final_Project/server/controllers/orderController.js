const Order = require("../models/OrderModel");

/* ======================================================
   CREATE ORDER
   ====================================================== */
const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      subtotal,
      shippingFee = 0,
      totalAmount,
      payment,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }

    // ✅ CATEGORY CHECK (NEW)
    for (const item of items) {
      if (!item.category) {
        return res.status(400).json({
          success: false,
          message: "Item category missing",
        });
      }
    }

    const order = await Order.create({
      user: req.user.id,
      items,
      shippingAddress,
      subtotal,
      shippingFee,
      totalAmount,
      payment: {
        status: "paid",
        method: "razorpay",
      },
      orderStatus: "placed",
    });

    res.status(201).json({
      success: true,
      orderId: order._id,
    });
  } catch (err) {
    console.error("Order create error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


/* ======================================================
   GET ALL ORDERS OF LOGGED-IN USER
   ====================================================== */
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Get orders error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};


module.exports = {
  createOrder,
  getMyOrders,
};
