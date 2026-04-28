// scripts/createAdmin.js
// Run: node scripts/createAdmin.js
const pool   = require("../config/db");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const ADMIN_NAME     = "admin";
const ADMIN_EMAIL    = "admin@gmail.com";
const ADMIN_PASSWORD = "admin123";
const ADMIN_ROLE     = "superadmin";

async function createAdmin() {
  const client = await pool.connect();
  try {
    console.log("✅ Connected to PostgreSQL");

    // Check if already exists
    const existing = await client.query(
      "SELECT id FROM admins WHERE email = $1",
      [ADMIN_EMAIL]
    );
    if (existing.rows.length > 0) {
      console.log("⚠️  Admin already exists:", ADMIN_EMAIL);
      process.exit(0);
    }

    const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
    const result = await client.query(
      `INSERT INTO admins (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [ADMIN_NAME, ADMIN_EMAIL, hashed, ADMIN_ROLE]
    );
    const admin = result.rows[0];

    console.log("🎉 Admin created successfully!");
    console.log("────────────────────────────────");
    console.log("  Name  :", admin.name);
    console.log("  Email :", admin.email);
    console.log("  Role  :", admin.role);
    console.log("────────────────────────────────");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error:", err.message);
    process.exit(1);
  } finally {
    client.release();
  }
}

createAdmin();