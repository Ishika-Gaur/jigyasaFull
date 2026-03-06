const express = require("express");
const router = express.Router();
const VideoController = require("../controllers/video.controller");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");

// ─── PUBLIC ROUTES ─────────────────────────────────────────
router.get("/", VideoController.getAllPublished);
router.get("/:id/thumbnail", VideoController.getThumbnail);
router.get("/:id/video", VideoController.getVideo);

// ─── PROTECTED ROUTES (Admin only) ─────────────────────────
router.post("/", protect, adminOnly, VideoController.create);
router.patch("/:id", protect, adminOnly, VideoController.update);
router.delete("/:id", protect, adminOnly, VideoController.delete);

module.exports = router;