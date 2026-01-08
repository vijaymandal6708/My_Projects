const router = require("express").Router();
const Razorpay = require("razorpay");
const crypto = require("crypto");

/* ===== RAZORPAY INSTANCE ===== */
const razorpay = new Razorpay({
  key_id: process.env.API_KEY,
  key_secret: process.env.API_SECRET,
});

/* ===== CREATE ORDER ===== */
router.post("/orders", async (req, res) => {
  try {
    const options = {
      amount: req.body.amount, // ✅ already in paise
      currency: "INR",
      receipt: "receipt_" + crypto.randomBytes(8).toString("hex"),
    };

    const order = await razorpay.orders.create(options);

    res.status(200).json({ success: true, data: order });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
});

/* ===== VERIFY PAYMENT ===== */
router.post("/verify", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body =
      razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.API_SECRET)
      .update(body)
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // ✅ PAYMENT VERIFIED
      return res.status(200).json({
        success: true,
        message: "Payment verified successfully",
      });
    } else {
      // ❌ INVALID SIGNATURE
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
});

module.exports = router;
