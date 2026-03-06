// services/doctor.service.js
// Table: doctors — UUID id, images TEXT[], consultation JSONB, conditions JSONB
const pool = require("../config/db");

const makeSlug = (name) => {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 150);
  return `${base}-${Date.now()}`;
};

class DoctorService {

  // GET all active doctors (public)
  async getAllPublished() {
    const result = await pool.query(`
      SELECT id, full_name AS name, slug,
             specialization AS specialty,
             short_title    AS title,
             degrees, experience_years,
             about          AS description,
             images, consultation, conditions,
             is_active,
             meta_title, meta_description,
             created_at, updated_at
      FROM doctors
      WHERE is_active = TRUE
      ORDER BY created_at ASC
    `);
    return result.rows;
  }

  // GET all doctors (admin — includes inactive)
  async getAllAdmin() {
    const result = await pool.query(`
      SELECT id, full_name AS name, slug,
             specialization AS specialty,
             short_title    AS title,
             degrees, experience_years,
             about          AS description,
             images, consultation, conditions,
             is_active,
             meta_title, meta_description,
             created_at, updated_at
      FROM doctors
      ORDER BY created_at DESC
    `);
    return result.rows;
  }

  // GET single doctor by UUID
  async getById(id) {
    const result = await pool.query(`
      SELECT id, full_name AS name, slug,
             specialization AS specialty,
             short_title    AS title,
             degrees, experience_years,
             about          AS description,
             images, consultation, conditions,
             is_active,
             meta_title, meta_description,
             created_at, updated_at
      FROM doctors
      WHERE id = $1
    `, [id]);
    return result.rows[0] || null;
  }

  // GET doctor by slug
  async getBySlug(slug) {
    const result = await pool.query(`
      SELECT id, full_name AS name, slug,
             specialization AS specialty,
             short_title    AS title,
             degrees, experience_years,
             about          AS description,
             images, consultation, conditions,
             is_active,
             meta_title, meta_description,
             created_at, updated_at
      FROM doctors WHERE slug = $1
    `, [slug]);
    return result.rows[0] || null;
  }

  // GET profile image (images[0]) as Buffer
  // images stores base64 data URL strings
  async getImage(id) {
    const result = await pool.query(
      `SELECT images FROM doctors WHERE id = $1`, [id]
    );
    const row = result.rows[0];
    if (!row || !row.images || row.images.length === 0) return null;
    return row.images[0]; // return raw base64 data URL string
  }

  // CREATE doctor
  async create({ name, title, specialty, description, image,
                 degrees, experienceYears, consultation,
                 conditions, status, metaTitle, metaDescription }) {
    const slug      = makeSlug(name);
    const is_active = status !== "draft"; // default published

    // Store image as first element of images[]
    const imagesArr = image ? [image] : [];

    // Parse degrees — accept string "MBBS, MD" or array
    let degreesArr = ["MBBS"];
    if (Array.isArray(degrees) && degrees.length > 0) {
      degreesArr = degrees;
    } else if (typeof degrees === "string" && degrees.trim()) {
      degreesArr = degrees.split(",").map(d => d.trim()).filter(Boolean);
    }

    const result = await pool.query(`
      INSERT INTO doctors (
        full_name, slug, specialization, short_title,
        degrees, experience_years, about,
        images, consultation, conditions,
        is_active, meta_title, meta_description
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING id, full_name AS name, slug,
                specialization AS specialty,
                short_title AS title,
                degrees, is_active
    `, [
      name.trim(),
      slug,
      specialty.trim(),
      title?.trim()       || null,
      degreesArr,
      experienceYears     || null,
      description?.trim() || null,
      imagesArr,
      consultation        ? JSON.stringify(consultation) : null,
      conditions          ? JSON.stringify(conditions)   : null,
      is_active,
      metaTitle           || null,
      metaDescription     || null,
    ]);

    return result.rows[0];
  }

  // UPDATE doctor
  async update(id, data) {
    const { name, title, specialty, description, image,
            degrees, experienceYears, consultation,
            conditions, status, isActive,
            metaTitle, metaDescription } = data;

    const sets   = [];
    const values = [];
    let   p      = 1;

    if (name !== undefined) {
      sets.push(`full_name = $${p++}`, `slug = $${p++}`);
      values.push(name.trim(), makeSlug(name.trim()));
    }
    if (title           !== undefined) { sets.push(`short_title = $${p++}`);      values.push(title);       }
    if (specialty       !== undefined) { sets.push(`specialization = $${p++}`);   values.push(specialty.trim()); }
    if (description     !== undefined) { sets.push(`about = $${p++}`);            values.push(description); }
    if (experienceYears !== undefined) { sets.push(`experience_years = $${p++}`); values.push(experienceYears); }
    if (metaTitle       !== undefined) { sets.push(`meta_title = $${p++}`);       values.push(metaTitle);   }
    if (metaDescription !== undefined) { sets.push(`meta_description = $${p++}`); values.push(metaDescription); }

    // is_active from status string OR direct boolean
    if (status !== undefined) {
      sets.push(`is_active = $${p++}`);
      values.push(status !== "draft");
    } else if (isActive !== undefined) {
      sets.push(`is_active = $${p++}`);
      values.push(isActive);
    }

    if (degrees !== undefined) {
      let arr = Array.isArray(degrees)
        ? degrees
        : degrees.split(",").map(d => d.trim()).filter(Boolean);
      sets.push(`degrees = $${p++}`);
      values.push(arr);
    }

    if (consultation !== undefined) {
      sets.push(`consultation = $${p++}`);
      values.push(JSON.stringify(consultation));
    }

    if (conditions !== undefined) {
      sets.push(`conditions = $${p++}`);
      values.push(JSON.stringify(conditions));
    }

    // Replace profile image (images[1] = first element, PostgreSQL 1-based)
    if (image !== undefined) {
      sets.push(`images[1] = $${p++}`);
      values.push(image);
    }

    if (sets.length === 0) return null;

    values.push(id);
    const result = await pool.query(`
      UPDATE doctors
      SET ${sets.join(", ")}, updated_at = NOW()
      WHERE id = $${p}
      RETURNING id, full_name AS name, slug,
                specialization AS specialty,
                short_title AS title,
                is_active
    `, values);

    return result.rows[0] || null;
  }

  // DELETE doctor
  async delete(id) {
    const result = await pool.query(
      `DELETE FROM doctors WHERE id = $1 RETURNING id`, [id]
    );
    return result.rows[0];
  }
}

module.exports = new DoctorService();