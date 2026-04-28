const express = require("express");
const router = express.Router();
const DoctorController = require("../controllers/doctor.controller");
const { protect } = require("../middleware/auth.middleware");
const { adminOnly } = require("../middleware/admin.middleware");

// ─── PUBLIC ROUTES ─────────────────────────────────────────
router.get("/", DoctorController.getAllPublished);
router.get("/:id", DoctorController.getById);
router.get("/:id/image", DoctorController.getImage);

// ─── PROTECTED ROUTES (Admin only) ─────────────────────────
router.get("/admin/all", protect, adminOnly, DoctorController.getAllAdmin);

router.post("/", protect, adminOnly, DoctorController.create);
router.patch("/:id", protect, adminOnly, DoctorController.update);
router.delete("/:id", protect, adminOnly, DoctorController.delete);

module.exports = router;