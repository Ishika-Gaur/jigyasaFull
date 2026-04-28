// routes/Photo.routes.js
const express        = require("express");
const router         = express.Router();
const GalleryService = require("../services/gallery.service");
const { protect }    = require("../middleware/auth.middleware");
const { adminOnly }  = require("../middleware/admin.middleware");

// ── PUBLIC ────────────────────────────────────────────────────

router.get("/", async (req, res) => {
  try {
    const galleries = await GalleryService.getAll();
    res.json(galleries);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET featured image — MUST be before /:id
router.get("/:id/featured", async (req, res) => {
  try {
    const img = await GalleryService.getFeatured(req.params.id);
    if (!img) return res.status(404).json({ message: "Image not found" });
    res.set("Content-Type", img.contentType);
    res.set("Cache-Control", "public, max-age=86400");
    res.send(img.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET gallery image by 0-based index
router.get("/:id/image/:index", async (req, res) => {
  try {
    const img = await GalleryService.getImageByIndex(
      req.params.id,
      parseInt(req.params.index, 10)
    );
    if (!img) return res.status(404).json({ message: "Image not found" });
    res.set("Content-Type", img.contentType);
    res.send(img.data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── ADMIN ─────────────────────────────────────────────────────

router.post("/", protect, adminOnly, async (req, res) => {
  try {
    let { title, badge, category, description, featuredImage, images,
          thumbnailIndex, displayOrder, metaTitle, metaDescription } = req.body;

    // ✅ Frontend sends 'category', DB stores as 'badge' — accept both
    if (!badge && category) badge = category;

    if (!title?.trim())   return res.status(400).json({ message: "Title is required." });
    if (!badge)           return res.status(400).json({ message: "Badge/Category is required." });
    if (!featuredImage)   return res.status(400).json({ message: "Featured image is required." });

    const gallery = await GalleryService.create({
      title, badge, description, featuredImage, images,
      thumbnailIndex, displayOrder, metaTitle, metaDescription
    });
    res.status(201).json({ message: "Gallery created successfully", gallery });
  } catch (err) {
    console.error("POST /gallery error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", protect, adminOnly, async (req, res) => {
  try {
    let { badge, category } = req.body;
    // ✅ Accept both 'badge' and 'category'
    if (!badge && category) req.body.badge = category;

    const updated = await GalleryService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Gallery not found or nothing to update" });
    res.json({ message: "Gallery updated successfully" });
  } catch (err) {
    console.error("PATCH /gallery error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id/images", protect, adminOnly, async (req, res) => {
  try {
    const { deleteIndices = [], addImages = [] } = req.body;
    await GalleryService.updateImages(req.params.id, deleteIndices, addImages);
    res.json({ message: "Images updated successfully" });
  } catch (err) {
    console.error("PATCH /gallery/:id/images error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    const deleted = await GalleryService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Gallery not found" });
    res.json({ message: "Gallery deleted successfully" });
  } catch (err) {
    console.error("DELETE /gallery error:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;