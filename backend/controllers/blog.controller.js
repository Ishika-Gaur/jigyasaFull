// controllers/Blog.controller.js
const BlogService = require("../services/blog.service");

// ── GET all blogs ─────────────────────────────────────────────
const getAllBlogs = async (req, res) => {
  try {
    const blogs = await BlogService.getAll();
    res.json(blogs);
  } catch (err) {
    console.error("getAllBlogs error:", err);
    res.status(500).json({ message: "Failed to fetch blogs." });
  }
};

// ── GET single blog by id or slug ─────────────────────────────
const getBlogById = async (req, res) => {
  try {
    const blog = await BlogService.getByIdOrSlug(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found." });
    res.json(blog);
  } catch (err) {
    console.error("getBlogById error:", err);
    res.status(500).json({ message: "Failed to fetch blog." });
  }
};

// ── GET cover image ───────────────────────────────────────────
const getBlogCover = async (req, res) => {
  try {
    const cover = await BlogService.getCover(req.params.id);
    if (!cover) return res.status(404).json({ message: "No cover image." });

    res.set("Content-Type", cover.contentType);
    res.set("Cache-Control", "public, max-age=86400");
    res.send(cover.data);
  } catch (err) {
    console.error("getBlogCover error:", err);
    res.status(500).json({ message: "Failed to serve cover image." });
  }
};

// ── POST create blog ──────────────────────────────────────────
const createBlog = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: "Title is required." });

    const blog = await BlogService.create(req.body);
    res.status(201).json({
      message: "Blog created successfully.",
      blog: { _id: blog.id, title: blog.title, slug: blog.slug },
    });
  } catch (err) {
    console.error("createBlog error:", err);
    if (err.code === "23505") {
      return res.status(400).json({ message: "Duplicate entry. Please try again." });
    }
    res.status(500).json({ message: err.message || "Failed to create blog." });
  }
};

// ── PATCH update blog ─────────────────────────────────────────
const updateBlog = async (req, res) => {
  try {
    const updated = await BlogService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Blog not found." });
    res.json({ message: "Blog updated successfully." });
  } catch (err) {
    console.error("updateBlog error:", err);
    res.status(500).json({ message: err.message || "Failed to update blog." });
  }
};

// ── DELETE blog ───────────────────────────────────────────────
const deleteBlog = async (req, res) => {
  try {
    const deleted = await BlogService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Blog not found." });
    res.json({ message: "Blog deleted successfully." });
  } catch (err) {
    console.error("deleteBlog error:", err);
    res.status(500).json({ message: "Failed to delete blog." });
  }
};

module.exports = { getAllBlogs, getBlogById, getBlogCover, createBlog, updateBlog, deleteBlog };