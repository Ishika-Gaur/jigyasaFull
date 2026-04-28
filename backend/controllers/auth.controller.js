// controllers/auth.controller.js
const AdminService = require("../services/admin.service");
const jwt          = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

const sendTokenCookie = (res, token) => {
  res.cookie("admin_token", token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

// ── REGISTER ──────────────────────────────────────────────────
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim())   return res.status(400).json({ message: "Name is required." });
    if (!email?.trim())  return res.status(400).json({ message: "Email is required." });
    if (!password)       return res.status(400).json({ message: "Password is required." });
    if (password.length < 6)
      return res.status(400).json({ message: "Password must be at least 6 characters." });

    const existing = await AdminService.findByEmail(email);
    if (existing)
      return res.status(400).json({ message: "An account with this email already exists." });

    const admin = await AdminService.create({ name, email, password });
    const token = generateToken(admin.id);
    sendTokenCookie(res, token);

    res.status(201).json({
      message: "Account created successfully.",
      admin:   { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      token,
    });
  } catch (err) {
    console.error("Register error:", err);
    if (err.code === "23505")
      return res.status(400).json({ message: "An account with this email already exists." });
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

// ── LOGIN ─────────────────────────────────────────────────────
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim()) return res.status(400).json({ message: "Email is required." });
    if (!password)      return res.status(400).json({ message: "Password is required." });

    const admin = await AdminService.findByEmail(email);
    if (!admin)
      return res.status(401).json({ message: "Invalid email or password." });

    const isMatch = await AdminService.comparePassword(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password." });

    const token = generateToken(admin.id);
    sendTokenCookie(res, token);

    res.json({
      message: "Login successful.",
      admin:   { id: admin.id, name: admin.name, email: admin.email, role: admin.role },
      token,
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

// ── LOGOUT ────────────────────────────────────────────────────
exports.logout = (req, res) => {
  res.clearCookie("admin_token");
  res.json({ message: "Logged out successfully." });
};

// ── GET ME ────────────────────────────────────────────────────
exports.getMe = async (req, res) => {
  try {
    // req.admin.id is set by auth.middleware
    const admin = await AdminService.findById(req.admin.id);
    if (!admin) return res.status(404).json({ message: "Admin not found." });
    res.json({ admin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};