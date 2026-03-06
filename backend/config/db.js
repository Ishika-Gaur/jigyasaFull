// config/db.js
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl:
          process.env.DB_SSL === "true"
            ? { rejectUnauthorized: false }
            : false,
      }
    : {
        host:     process.env.DB_HOST     || "localhost",
        port:     process.env.DB_PORT     || 5432,
        user:     process.env.DB_USER     || "postgres",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME     || "jigyasa_Clinic",
        ssl:
          process.env.DB_SSL === "true"
            ? { rejectUnauthorized: false }
            : false,
      }
);

// Test connection on startup
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ PostgreSQL Connection Failed:", err.message);
    process.exit(1);
  }
  release();
  console.log("✅ PostgreSQL Connected Successfully");
});

module.exports = pool;