const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  // Update 'token' to match the name you see in the Application tab
  let token = req.cookies.token || req.cookies.admintoken; 

  if (!token && req.headers.authorization) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ msg: "No token provided, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Ensure this contains the user ID
    next();
  } catch (error) {
    return res.status(401).json({ msg: "Invalid or expired token" });
  }
};

module.exports = authMiddleware;