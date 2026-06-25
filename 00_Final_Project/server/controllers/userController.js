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

/* ================= USER LOGIN (With HttpOnly Cookie) ================= */
const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: "Invalid credentials" });

    // 1. Create the token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    // 2. Set the cookie instead of sending token in JSON
    res.cookie("token", token, {
      httpOnly: true, // Prevents client-side JS from reading the token
      secure: process.env.NODE_ENV === "production", // Only sent over HTTPS in production
      sameSite: "strict", // Protects against CSRF
      maxAge: 24 * 60 * 60 * 1000, // 1 day in milliseconds
    });

    // 3. Send only user data back (no token in the JSON body)
    console.log(user);
    return res.status(200).json({
      msg: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        isDemo: user.isDemo,
        phone: user.phone,
        address: user.address,
        city: user.city,
        pincode: user.pincode,
      },
    });
  } catch (error) {
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

    // Validate inputs
    if (!name || !phone || !city || !pincode || !addressLine) {
      return res.status(400).json({ msg: "All address fields are required" });
    }

    // Atomic update: only modifies the alternateAddresses array
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      {
        $push: {
          alternateAddresses: { name, phone, city, pincode, addressLine }
        }
      },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.status(200).json({
      msg: "Address added successfully",
      addresses: updatedUser.alternateAddresses,
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
