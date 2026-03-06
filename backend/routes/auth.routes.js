const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const { register, login, logout, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");

// ✅ Rate limiter — max 10 login attempts per 15 minutes
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many attempts. Please try again after 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

router.post("/register", authLimiter, register);
router.post("/login", authLimiter, login);
router.post("/logout", protect, logout);
router.get("/me", protect, getMe);

module.exports = router;