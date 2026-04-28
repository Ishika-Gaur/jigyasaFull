// services/video.service.js
// Table: video_gallery — UUID id, video_url & thumbnail_url as TEXT (base64 data URLs)
const pool = require("../config/db");

const makeSlug = (title) => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 250);
  return `${base}-${Date.now()}`;
};

class VideoService {

  // GET all active videos (no binary data in list)
  async getAllPublished() {
    const result = await pool.query(`
      SELECT id, title, slug, category, description,
             duration, is_featured, is_active,
             display_order, meta_title, meta_description,
             video_metadata, created_at, updated_at
      FROM video_gallery
      WHERE is_active = TRUE
      ORDER BY display_order ASC, created_at DESC
    `);
    return result.rows;
  }

  // GET single video by UUID
  async getById(id) {
    const result = await pool.query(
      `SELECT id, title, slug, category, description,
              duration, is_featured, is_active, display_order,
              meta_title, meta_description, video_metadata,
              created_at, updated_at
       FROM video_gallery WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  // GET thumbnail_url only (base64 data URL string)
  async getThumbnailUrl(id) {
    const result = await pool.query(
      `SELECT thumbnail_url FROM video_gallery WHERE id = $1`, [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0].thumbnail_url;
  }

  // GET video_url only (base64 data URL string)
  async getVideoUrl(id) {
    const result = await pool.query(
      `SELECT video_url FROM video_gallery WHERE id = $1`, [id]
    );
    if (result.rows.length === 0) return null;
    return result.rows[0].video_url;
  }

  // CREATE video
  // thumbnail & video are base64 data URL strings from frontend
  async create({ title, description, category, duration, thumbnail, video, videoMetadata, displayOrder, isFeatured, metaTitle, metaDescription }) {
    const slug = makeSlug(title);

    const result = await pool.query(
      `INSERT INTO video_gallery
         (title, slug, category, description, duration,
          video_url, thumbnail_url, video_metadata,
          is_featured, display_order, meta_title, meta_description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING id, title, slug, category, description, duration, is_active`,
      [
        title.trim(),
        slug,
        category        || "Hospital",
        description?.trim() || "",
        duration        || null,
        video,
        thumbnail,
        videoMetadata   || null,
        isFeatured      || false,
        displayOrder    || 0,
        metaTitle       || null,
        metaDescription || null,
      ]
    );
    return result.rows[0];
  }

  // UPDATE video
  async update(id, data) {
    const { title, description, category, duration,
            thumbnail, isFeatured, isActive,
            displayOrder, metaTitle, metaDescription, videoMetadata } = data;

    const sets   = [];
    const values = [];
    let   p      = 1;

    if (title           !== undefined) { sets.push(`title = $${p++}`);            values.push(title.trim());  }
    if (description     !== undefined) { sets.push(`description = $${p++}`);      values.push(description);   }
    if (category        !== undefined) { sets.push(`category = $${p++}`);         values.push(category);      }
    if (duration        !== undefined) { sets.push(`duration = $${p++}`);         values.push(duration);      }
    if (thumbnail       !== undefined) { sets.push(`thumbnail_url = $${p++}`);    values.push(thumbnail);     }
    if (isFeatured      !== undefined) { sets.push(`is_featured = $${p++}`);      values.push(isFeatured);    }
    if (isActive        !== undefined) { sets.push(`is_active = $${p++}`);        values.push(isActive);      }
    if (displayOrder    !== undefined) { sets.push(`display_order = $${p++}`);    values.push(displayOrder);  }
    if (metaTitle       !== undefined) { sets.push(`meta_title = $${p++}`);       values.push(metaTitle);     }
    if (metaDescription !== undefined) { sets.push(`meta_description = $${p++}`); values.push(metaDescription);}
    if (videoMetadata   !== undefined) { sets.push(`video_metadata = $${p++}`);   values.push(JSON.stringify(videoMetadata)); }

    if (sets.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE video_gallery SET ${sets.join(", ")}, updated_at = NOW()
       WHERE id = $${p}
       RETURNING id, title, slug, category, description, duration, is_active`,
      values
    );
    return result.rows[0] || null;
  }

  // DELETE video
  async delete(id) {
    const result = await pool.query(
      `DELETE FROM video_gallery WHERE id = $1 RETURNING id`, [id]
    );
    return result.rows[0];
  }
}

module.exports = new VideoService();