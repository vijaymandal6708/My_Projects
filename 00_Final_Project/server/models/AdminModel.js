const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  adminName: {
    type: String,
    required: true,
    trim: true,
  },
  adminEmail: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true,
  },
  adminPassword: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("admin", adminSchema);
