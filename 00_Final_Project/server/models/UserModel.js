const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    phone: { type: String, required: true },
    city: { type: String, required: true },
    pincode: { type: String, required: true },
    address: { type: String, required: true }, // primary address

    // ✅ alternate addresses array
    alternateAddresses: {
      type: [
        {
          name: { type: String, required: true },
          phone: { type: String, required: true },
          city: { type: String, required: true },
          pincode: { type: String, required: true },
          addressLine: { type: String, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
