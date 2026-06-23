const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  // 1. Try to get token from Authorization header OR from cookies
  let token = req.headers.authorization?.startsWith("Bearer ") 
    ? req.headers.authorization.split(" ")[1] 
    : req.cookies.admintoken; // Look in the cookie

  if (!token) {
    return res.status(401).json({ msg: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = adminAuth;