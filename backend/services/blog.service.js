// services/blog.service.js
const pool = require("../config/db");

// ── Helper: generate slug ─────────────────────────────────────
const makeSlug = (title) => {
  const base = title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 70);
  return `${base}-${Date.now()}`;
};

// ── Helper: parse base64 image string ────────────────────────
const parseBase64Image = (str) => {
  if (!str || typeof str !== "string") return null;
  const match = str.match(/^data:(.+);base64,(.+)$/);
  if (!match) return null;
  return {
    data:        Buffer.from(match[2], "base64"),
    contentType: match[1],
  };
};

class BlogService {

  // GET all blogs (without binary cover data)
  async getAll() {
    const result = await pool.query(`
      SELECT id, title, slug, author, category, excerpt, content,
             sections, status,
             (cover_data IS NOT NULL) AS "coverImage",
             created_at AS "createdAt", updated_at AS "updatedAt"
      FROM blogs
      ORDER BY created_at DESC
    `);
    return result.rows;
  }

  // GET single blog by id OR slug (without binary data)
  async getByIdOrSlug(idOrSlug) {
    const isNumeric = /^\d+$/.test(idOrSlug);
    let result;

    if (isNumeric) {
      result = await pool.query(
        `SELECT id, title, slug, author, category, excerpt, content,
                sections, status,
                (cover_data IS NOT NULL) AS "coverImage",
                created_at AS "createdAt", updated_at AS "updatedAt"
         FROM blogs WHERE id = $1`,
        [idOrSlug]
      );
    }

    // Fall back to slug
    if (!result || result.rows.length === 0) {
      result = await pool.query(
        `SELECT id, title, slug, author, category, excerpt, content,
                sections, status,
                (cover_data IS NOT NULL) AS "coverImage",
                created_at AS "createdAt", updated_at AS "updatedAt"
         FROM blogs WHERE slug = $1`,
        [idOrSlug]
      );
    }

    return result.rows[0] || null;
  }

  // GET cover image (binary)
  async getCover(id) {
    const result = await pool.query(
      `SELECT cover_data, cover_content_type FROM blogs WHERE id = $1`,
      [id]
    );
    const row = result.rows[0];
    if (!row || !row.cover_data) return null;
    return { data: row.cover_data, contentType: row.cover_content_type };
  }

  // CREATE blog
  async create(data) {
    const { title, author, category, excerpt, content, status, coverImage, sections } = data;
    const slug   = makeSlug(title);
    const cover  = parseBase64Image(coverImage);

    // sections: array se JSON string banao, ya empty array
    const sectionsJson = JSON.stringify(
      Array.isArray(sections) && sections.length > 0 ? sections : []
    );

    const result = await pool.query(
      `INSERT INTO blogs
         (title, slug, author, category, excerpt, content, sections, status,
          cover_data, cover_content_type)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
       RETURNING id, title, slug`,
      [
        title.trim(),
        slug,
        author   || "",
        category || "Uncategorized",
        excerpt  || "",
        content  || "",
        sectionsJson,
        status   || "published",
        cover?.data        || null,
        cover?.contentType || null,
      ]
    );
    return result.rows[0];
  }

  // UPDATE blog
  async update(id, data) {
    const { title, author, category, excerpt, content, status, coverImage, sections } = data;

    const updates = [];
    const values  = [];
    let   idx     = 1;

    if (title !== undefined) {
      updates.push(`title = $${idx++}`, `slug = $${idx++}`);
      values.push(title.trim(), makeSlug(title.trim()));
    }
    if (author    !== undefined) { updates.push(`author = $${idx++}`);   values.push(author);   }
    if (category  !== undefined) { updates.push(`category = $${idx++}`); values.push(category); }
    if (excerpt   !== undefined) { updates.push(`excerpt = $${idx++}`);  values.push(excerpt);  }
    if (content   !== undefined) { updates.push(`content = $${idx++}`);  values.push(content);  }
    if (status    !== undefined) { updates.push(`status = $${idx++}`);   values.push(status);   }

    // sections update
    if (sections !== undefined) {
      updates.push(`sections = $${idx++}`);
      values.push(JSON.stringify(Array.isArray(sections) ? sections : []));
    }

    if (coverImage) {
      const cover = parseBase64Image(coverImage);
      if (cover) {
        updates.push(`cover_data = $${idx++}`, `cover_content_type = $${idx++}`);
        values.push(cover.data, cover.contentType);
      }
    }

    if (updates.length === 0) return null;

    values.push(id);
    const result = await pool.query(
      `UPDATE blogs SET ${updates.join(", ")}, updated_at = NOW()
       WHERE id = $${idx} RETURNING id, title, slug`,
      values
    );
    return result.rows[0];
  }

  // DELETE blog
  async delete(id) {
    const result = await pool.query(
      `DELETE FROM blogs WHERE id = $1 RETURNING id`,
      [id]
    );
    return result.rows[0];
  }
}

module.exports = new BlogService();