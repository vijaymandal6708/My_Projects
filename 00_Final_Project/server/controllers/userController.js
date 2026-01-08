const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

/* ================= USER SIGNUP ================= */
const userSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirmPassword,
      phone,
      city,
      pincode,
      address,
    } = req.body;

    // ===== Validation =====
    if (
      !name ||
      !email ||
      !password ||
      !confirmPassword ||
      !phone ||
      !city ||
      !pincode ||
      !address
    ) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ msg: "Passwords do not match" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    // ===== Check existing user =====
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ msg: "User already exists" });
    }

    // ===== Hash password =====
    const hashedPassword = await bcrypt.hash(password, 10);

    // ===== Create user =====
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      city,
      pincode,
      address,
    });

    return res.status(201).json({
      msg: "Signup successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("User signup error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

/* ================= USER LOGIN (JWT) ================= */
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ===== Validation =====
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    // ===== Check user exists =====
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // ===== Compare password =====
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ msg: "Invalid email or password" });
    }

    // ===== Generate JWT =====
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    return res.status(200).json({
      msg: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        city: user.city,
        pincode: user.pincode,
        address: user.address,
      },
    });
  } catch (error) {
    console.error("User login error:", error);
    return res.status(500).json({ msg: "Server error" });
  }
};

/* ================= FETCH LOGGED-IN USER ================= */
const fetchUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(
      "name email phone city pincode address"
    );

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(500).json({ msg: "Server error" });
  }
};

const addAlternateAddress = async (req, res) => {
  try {
    const { name, phone, city, pincode, addressLine } = req.body;

    if (!name || !phone || !city || !pincode || !addressLine) {
      return res.status(400).json({ msg: "All address fields are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    user.alternateAddresses.push({
      name,
      phone,
      city,
      pincode,
      addressLine,
    });

    await user.save();

    res.status(200).json({
      msg: "Address added successfully",
      addresses: user.alternateAddresses,
    });
  } catch (err) {
    console.error("Add address error:", err);
    res.status(500).json({ msg: "Server error" });
  }
};


/* ================= EXPORT ================= */
module.exports = {
  userSignup,
  userLogin,
  fetchUser,
  addAlternateAddress,
};
