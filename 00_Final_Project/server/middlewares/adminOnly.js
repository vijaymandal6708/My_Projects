const jwt = require("jsonwebtoken");

const adminAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ msg: "No token provided" });
  }

  if (!authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "Invalid token format" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    req.admin = decoded; // contains userId & role
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = adminAuth;
