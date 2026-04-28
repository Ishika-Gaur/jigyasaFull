// server.js
const express      = require("express");
const dotenv       = require("dotenv");
const cors         = require("cors");
const helmet       = require("helmet");
const cookieParser = require("cookie-parser");
const rateLimit    = require("express-rate-limit");

dotenv.config();

// ✅ Import pool — this connects to PostgreSQL on startup
require("./config/db");

const videoRoutes   = require("./routes/Video.routes");
const galleryRoutes = require("./routes/Photo.routes");
const authRoutes    = require("./routes/auth.routes");
const doctorRoutes  = require("./routes/Doctor.routes");
const blogRoutes    = require("./routes/Blog.routes");

const app = express();

// ── Security headers ───────────────────────────────────────────
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

// ── CORS ───────────────────────────────────────────────────────
app.use(cors({
  origin:      process.env.FRONTEND_URL || "http://localhost:3000",
  credentials: true,
}));

// ── Cookie parser ──────────────────────────────────────────────
app.use(cookieParser());

// ── Body parsers (500mb for base64 image/video uploads) ────────
app.use(express.json({ limit: "500mb" }));
app.use(express.urlencoded({ limit: "500mb", extended: true }));

// ── Global rate limiter ────────────────────────────────────────
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max:      500,
  message:  { message: "Too many requests. Please slow down." },
}));

// app.use('/uploads', express.static('uploads'));

// ── Routes ─────────────────────────────────────────────────────
app.use("/api/auth",    authRoutes);
app.use("/api/videos",  videoRoutes);
app.use("/api/gallery", galleryRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/blogs",   blogRoutes);

// ── Health check ───────────────────────────────────────────────
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "🚀 Hospital Media API Running (PostgreSQL)" });
});

// ── Global error handler ───────────────────────────────────────
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ message: "Something went wrong." });
});

// ── Start ──────────────────────────────────────────────────────
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🔥 Server running on http://localhost:${PORT}`);
});