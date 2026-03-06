// services/admin.service.js
const pool   = require("../config/db");
const bcrypt = require("bcryptjs");

class AdminService {

  async findByEmail(email) {
    const result = await pool.query(
      `SELECT id, name, email, password, role, created_at
       FROM admins WHERE email = $1`,
      [email.toLowerCase()]
    );
    return result.rows[0] || null;
  }

  async findById(id) {
    const result = await pool.query(
      `SELECT id, name, email, role, created_at
       FROM admins WHERE id = $1`,
      [id]
    );
    return result.rows[0] || null;
  }

  async create({ name, email, password, role = "admin" }) {
    const hashed = await bcrypt.hash(password, 12);
    const result = await pool.query(
      `INSERT INTO admins (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name.trim(), email.toLowerCase().trim(), hashed, role]
    );
    return result.rows[0];
  }

  async comparePassword(plainPassword, hashedPassword) {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}

module.exports = new AdminService();