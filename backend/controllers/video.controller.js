// controllers/video.controller.js
const VideoService = require("../services/video.service");

// GET all published videos (public)
exports.getAllPublished = async (req, res) => {
  try {
    const videos = await VideoService.getAllPublished();
    res.json(videos.map(v => ({ ...v, status: v.is_active ? "published" : "draft" })));
  } catch (err) {
    console.error("GET /videos error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET thumbnail image by UUID
exports.getThumbnail = async (req, res) => {
  try {
    const url = await VideoService.getThumbnailUrl(req.params.id);
    if (!url) return res.status(404).json({ message: "Thumbnail not found" });

    res.set("Access-Control-Allow-Origin", process.env.FRONTEND_URL || "http://localhost:3000");
    res.set("Access-Control-Allow-Credentials", "true");

    if (url.startsWith("data:")) {
      const comma       = url.indexOf(",");
      const mimeMatch   = url.substring(0, comma).match(/data:([^;]+);/);
      const contentType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const data        = Buffer.from(url.substring(comma + 1), "base64");
      res.set("Content-Type", contentType);
      res.set("Cache-Control", "public, max-age=86400");
      return res.send(data);
    }

    res.redirect(url);
  } catch (err) {
    console.error("GET /videos/:id/thumbnail error:", err);
    res.status(500).json({ message: err.message });
  }
};

// GET video file by UUID (with range/streaming support)
exports.getVideo = async (req, res) => {
  try {
    const url = await VideoService.getVideoUrl(req.params.id);
    if (!url) return res.status(404).json({ message: "Video not found" });

    const corsHeaders = {
      "Access-Control-Allow-Origin":      process.env.FRONTEND_URL || "http://localhost:3000",
      "Access-Control-Allow-Credentials": "true",
    };

    if (url.startsWith("data:")) {
      const comma       = url.indexOf(",");
      const mimeMatch   = url.substring(0, comma).match(/data:([^;]+);/);
      const contentType = mimeMatch ? mimeMatch[1] : "video/mp4";
      const buffer      = Buffer.from(url.substring(comma + 1).replace(/\s/g, ""), "base64");
      const total       = buffer.length;
      const range       = req.headers.range;

      if (range) {
        const [startStr, endStr] = range.replace(/bytes=/, "").split("-");
        const start     = parseInt(startStr, 10);
        const end       = endStr ? parseInt(endStr, 10) : total - 1;
        const chunkSize = end - start + 1;

        res.writeHead(206, {
          "Content-Range":  `bytes ${start}-${end}/${total}`,
          "Accept-Ranges":  "bytes",
          "Content-Length": chunkSize,
          "Content-Type":   contentType,
          ...corsHeaders,
        });
        return res.end(buffer.slice(start, end + 1));
      }

      res.writeHead(200, {
        "Content-Length": total,
        "Content-Type":   contentType,
        "Accept-Ranges":  "bytes",
        ...corsHeaders,
      });
      return res.end(buffer);
    }

    res.redirect(url);
  } catch (err) {
    console.error("GET /videos/:id/video error:", err);
    res.status(500).json({ message: err.message });
  }
};

// POST create video
exports.create = async (req, res) => {
  try {
    const { title, description, category, duration,
            thumbnail, video, videoMetadata,
            displayOrder, isFeatured,
            metaTitle, metaDescription } = req.body;

    if (!title?.trim())   return res.status(400).json({ message: "Title is required." });
    if (!description?.trim()) return res.status(400).json({ message: "Description is required." });
    if (!thumbnail)       return res.status(400).json({ message: "Thumbnail is required." });
    if (!video)           return res.status(400).json({ message: "Video file is required." });

    const newVideo = await VideoService.create({
      title, description, category, duration,
      thumbnail, video, videoMetadata,
      displayOrder, isFeatured,
      metaTitle, metaDescription,
    });

    res.status(201).json({ message: "Video uploaded successfully", video: newVideo });
  } catch (err) {
    console.error("POST /videos error:", err);
    if (err.code === "23505") {
      return res.status(400).json({ message: "A video with this title already exists." });
    }
    res.status(500).json({ message: err.message || "Internal server error" });
  }
};

// PATCH update video
exports.update = async (req, res) => {
  try {
    const updated = await VideoService.update(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: "Video not found" });
    res.json({ message: "Video updated successfully", video: updated });
  } catch (err) {
    console.error("PATCH /videos/:id error:", err);
    res.status(500).json({ message: err.message });
  }
};

// DELETE video
exports.delete = async (req, res) => {
  try {
    const deleted = await VideoService.delete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Video not found" });
    res.json({ message: "Video deleted successfully" });
  } catch (err) {
    console.error("DELETE /videos/:id error:", err);
    res.status(500).json({ message: err.message });
  }
};