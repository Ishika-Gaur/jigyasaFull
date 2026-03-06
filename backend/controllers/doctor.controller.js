// controllers/doctor.controller.js
const DoctorService = require("../services/doctor.service");

// GET all published doctors (public)
exports.getAllPublished = async (req, res) => {
  try {
    const doctors = await DoctorService.getAllPublished();
    // Add status field for frontend compatibility
    res.json(doctors.map(d => ({ ...d, status: d.is_active ? "published" : "draft" })));
  } catch (err) {
    console.error("GET /doctors error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET all doctors (admin)
exports.getAllAdmin = async (req, res) => {
  try {
    const doctors = await DoctorService.getAllAdmin();
    res.json(doctors.map(d => ({ ...d, status: d.is_active ? "published" : "draft" })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET single doctor by UUID
exports.getById = async (req, res) => {
  try {
    const doctor = await DoctorService.getById(req.params.id);
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });
    res.json({ ...doctor, status: doctor.is_active ? "published" : "draft" });
  } catch (err) {
    console.error("GET /doctors/:id error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET doctor profile image
exports.getImage = async (req, res) => {
  try {
    const imageStr = await DoctorService.getImage(req.params.id);
    if (!imageStr) return res.status(404).json({ message: "Image not found" });

    // Parse data URL: data:image/jpeg;base64,....
    if (imageStr.startsWith("data:")) {
      const comma       = imageStr.indexOf(",");
      const header      = imageStr.substring(0, comma);
      const mimeMatch   = header.match(/data:([^;]+);/);
      const contentType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const data        = Buffer.from(imageStr.substring(comma + 1), "base64");

      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=86400");
      return res.send(data);
    }

    // Plain base64 fallback
    const data = Buffer.from(imageStr, "base64");
    res.set("Content-Type", "image/jpeg");
    res.set("Cache-Control", "public, max-age=86400");
    return res.send(data);
  } catch (err) {
    console.error("GET /doctors/:id/image error:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST create doctor
exports.create = async (req, res) => {
  try {
    const { name, title, specialty, description, image,
            degrees, experienceYears, consultation,
            conditions, status, metaTitle, metaDescription } = req.body;

    if (!name?.trim())        return res.status(400).json({ message: "Name is required." });
    if (!specialty?.trim())   return res.status(400).json({ message: "Specialty is required." });
    if (!description?.trim()) return res.status(400).json({ message: "Description is required." });

    const doctor = await DoctorService.create({
      name, title, specialty, description, image,
      degrees, experienceYears, consultation,
      conditions, status, metaTitle, metaDescription
    });

    res.status(201).json({ message: "Doctor created successfully", doctor });
  } catch (err) {
    console.error("POST /doctors error:", err);
    if (err.code === "23505") {
      return res.status(400).json({ message: "A doctor with this name already exists." });
    }
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

// PATCH update doctor
exports.update = async (req, res) => {
  try {
    const updated = await DoctorService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor updated successfully", doctor: updated });
  } catch (err) {
    console.error("PATCH /doctors/:id error:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE doctor
exports.delete = async (req, res) => {
  try {
    const deleted = await DoctorService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Doctor not found" });
    res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error("DELETE /doctors/:id error:", err);
    res.status(500).json({ message: err.message });
  }
};