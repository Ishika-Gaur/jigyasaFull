// middleware/auth.middleware.js
const jwt          = require("jsonwebtoken");
const AdminService = require("../services/admin.service");

exports.protect = async (req, res, next) => {
  try {
    // Accept token from cookie OR Authorization header
    let token = req.cookies?.admin_token;

    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Not authenticated. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // decoded.id is now a PostgreSQL integer
    const admin = await AdminService.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: "Admin account not found." });
    }

    req.admin = admin; // attach admin to request
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }
    console.error("Auth middleware error:", err);
    res.status(500).json({ message: "Authentication error." });
  }
};