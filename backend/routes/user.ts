// backend/routes/users.ts
import express from "express";
import pool from "../lib/db"; // your Postgres pool setup

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users;");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

export default router;
