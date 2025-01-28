const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const loginHandler = require("./adminlogin");


router.post("/login", loginHandler);

// Middleware for admin authentication
const adminAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    req.admin = decoded; // Attach admin info to the request
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Protected admin routes
router.get("/dashboard", adminAuthMiddleware, (req, res) => {  
  res.json({ message: "Welcome to the Admin Dashboard" });
});

router.get("/settings", adminAuthMiddleware, (req, res) => {
  res.json({ message: "Admin Settings Page" });
});

module.exports = router;
