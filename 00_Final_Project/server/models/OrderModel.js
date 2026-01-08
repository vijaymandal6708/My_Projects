const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    /* ===== USER ===== */
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    /* ===== ITEMS ===== */
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
        category: {
          type: String,
          required: true,
          lowercase: true,
          trim: true,
        },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        image: { type: String },
      },
    ],

    /* ===== SHIPPING ADDRESS (SNAPSHOT) ===== */
    shippingAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      pincode: { type: String, required: true },
      addressLine: { type: String, required: true },
    },

    /* ===== PRICE DETAILS ===== */
    subtotal: { type: Number, required: true },
    shippingFee: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    /* ===== PAYMENT ===== */
    payment: {
      method: {
        type: String,
        enum: ["razorpay", "cod"],
        default: "razorpay",
      },
      razorpayOrderId: String,
      razorpayPaymentId: String,
      razorpaySignature: String,
      status: {
        type: String,
        enum: ["pending", "paid", "failed"],
        default: "pending",
      },
    },

    /* ===== ORDER STATUS ===== */
    orderStatus: {
      type: String,
      enum: ["placed", "processing", "shipped", "delivered", "cancelled"],
      default: "placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
