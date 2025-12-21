import { NextResponse } from "next/server";
import { pool } from "@/lib/db";

export async function GET() {
  const result = await pool.query("SELECT * FROM users;");
  return NextResponse.json(result.rows);
}

export async function POST() {
  const result = await pool.query(
    "INSERT INTO users (email, name) VALUES ($1, $2) RETURNING *;",
    ["test@example.com", "First User"]
  );
  return NextResponse.json(result.rows[0]);
}
