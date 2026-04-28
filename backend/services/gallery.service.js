// services/gallery.service.js
const pool = require("../config/db");

const makeSlug = (title) => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 200);
  return `${base}-${Date.now()}`;
};

class GalleryService {

  // GET all active galleries — images column EXCLUDED (too heavy)
  async getAll() {
    const result = await pool.query(`
      SELECT id, title, slug, badge AS category, description,
             thumbnail_index, is_active,
             display_order, meta_title, meta_description,
             array_length(images, 1) AS "imageCount",
             created_at AS "createdAt", updated_at AS "updatedAt"
      FROM gallery
      WHERE is_active = TRUE
      ORDER BY display_order ASC, created_at DESC
    `);
    return result.rows;
  }

  // GET single by UUID
  async getById(id) {
    const result = await pool.query(
      `SELECT id, title, slug, badge, description,
              images, thumbnail_index, is_active,
              display_order, meta_title, meta_description,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM gallery WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  // GET featured/thumbnail image — returns { data, contentType }
  async getFeatured(id) {
    const result = await pool.query(
      `SELECT images, thumbnail_index FROM gallery WHERE id = $1`,
      [id]
    );
    const row = result.rows[0];
    if (!row || !row.images || row.images.length === 0) return null;
    const idx = (row.thumbnail_index || 1) - 1;
    const imageStr = row.images[idx] || row.images[0];
    return this._parseDataUrl(imageStr);
  }

  // GET image by 0-based index
  async getImageByIndex(id, index) {
    const result = await pool.query(
      `SELECT images FROM gallery WHERE id = $1`,
      [id]
    );
    const row = result.rows[0];
    if (!row || !row.images || row.images.length === 0) return null;
    const imageStr = row.images[index];
    if (!imageStr) return null;
    return this._parseDataUrl(imageStr);
  }

  // CREATE gallery
  async create({ title, category, badge, description, featuredImage, images,
                 thumbnailIndex, displayOrder, metaTitle, metaDescription }) {
    const slug = makeSlug(title);
    const allImages = [];
    if (featuredImage) allImages.push(featuredImage);
    if (Array.isArray(images)) allImages.push(...images);

    const result = await pool.query(
      `INSERT INTO gallery
         (title, slug, badge, description, images, thumbnail_index,
          display_order, meta_title, meta_description)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9)
       RETURNING id, title, slug`,
      [
        title.trim(),
        slug,
        category || badge || "equipment",
        description || "",
        allImages,
        thumbnailIndex || 1,
        displayOrder   || 0,
        metaTitle      || null,
        metaDescription|| null,
      ]
    );
    return result.rows[0];
  }

  // UPDATE gallery metadata
  async update(id, data) {
    const { title, category, badge, description, featuredImage,
            thumbnailIndex, displayOrder, isActive,
            metaTitle, metaDescription } = data;

    const sets   = [];
    const values = [];
    let   p      = 1;
    const resolvedBadge = category || badge;

    if (title           !== undefined) { sets.push(`title = $${p++}`);             values.push(title.trim());  }
    if (resolvedBadge   !== undefined) { sets.push(`badge = $${p++}`);             values.push(resolvedBadge); }
    if (description     !== undefined) { sets.push(`description = $${p++}`);       values.push(description);   }
    if (isActive        !== undefined) { sets.push(`is_active = $${p++}`);         values.push(isActive);      }
    if (displayOrder    !== undefined) { sets.push(`display_order = $${p++}`);     values.push(displayOrder);  }
    if (thumbnailIndex  !== undefined) { sets.push(`thumbnail_index = $${p++}`);   values.push(thumbnailIndex);}
    if (metaTitle       !== undefined) { sets.push(`meta_title = $${p++}`);        values.push(metaTitle);     }
    if (metaDescription !== undefined) { sets.push(`meta_description = $${p++}`);  values.push(metaDescription);}
    if (featuredImage)                 { sets.push(`images[1] = $${p++}`);         values.push(featuredImage); }

    if (sets.length === 0) return false;

    values.push(id);
    await pool.query(
      `UPDATE gallery SET ${sets.join(", ")}, updated_at = NOW() WHERE id = $${p}`,
      values
    );
    return true;
  }

  // UPDATE images array
  async updateImages(id, deleteIndices = [], addImages = []) {
    const result = await pool.query(
      `SELECT images FROM gallery WHERE id = $1`, [id]
    );
    const row = result.rows[0];
    if (!row) return false;

    let current = row.images || [];
    current = current.filter((_, i) => !deleteIndices.includes(i));
    if (Array.isArray(addImages)) current = [...current, ...addImages];

    await pool.query(
      `UPDATE gallery SET images = $1, updated_at = NOW() WHERE id = $2`,
      [current, id]
    );
    return true;
  }

  // DELETE gallery
  async delete(id) {
    const result = await pool.query(
      `DELETE FROM gallery WHERE id = $1 RETURNING id`, [id]
    );
    return result.rows[0];
  }

  // Parse base64 data URL → { data: Buffer, contentType }
  _parseDataUrl(str) {
    if (!str) return null;
    if (str.startsWith("data:")) {
      const comma       = str.indexOf(",");
      const header      = str.substring(0, comma);
      const mimeMatch   = header.match(/data:([^;]+);/);
      const contentType = mimeMatch ? mimeMatch[1] : "image/jpeg";
      const data        = Buffer.from(str.substring(comma + 1), "base64");
      return { data, contentType };
    }
    return { data: Buffer.from(str, "base64"), contentType: "image/jpeg" };
  }
}

module.exports = new GalleryService();