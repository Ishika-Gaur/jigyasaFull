const express = require("express");
const router = express.Router();
const {
  getAllBlogs,
  getBlogById,
  getBlogCover,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/Blog.controller");

const { protect } = require("../middleware/auth.middleware");

// ── Public routes ──────────────────────────────────────────────────────────
router.get("/",           getAllBlogs);   // GET  /api/blogs

// ✅ IMPORTANT: /:id/cover MUST be before /:id
// Otherwise Express matches "cover" as the :id param
router.get("/:id/cover",  getBlogCover); // GET  /api/blogs/:id/cover
router.get("/:id",        getBlogById);  // GET  /api/blogs/:id

// ── Protected routes (admin only) ─────────────────────────────────────────
router.post("/",         protect, createBlog);  // POST   /api/blogs
router.patch("/:id",     protect, updateBlog);  // PATCH  /api/blogs/:id
router.delete("/:id",    protect, deleteBlog);  // DELETE /api/blogs/:id

module.exports = router;