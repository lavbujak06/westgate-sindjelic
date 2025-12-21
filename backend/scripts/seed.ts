import pool from "../lib/db";

async function seed() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(100)
    );
    
    INSERT INTO users (name, email) VALUES
      ('Alice', 'alice@example.com'),
      ('Bob', 'bob@example.com')
    ON CONFLICT DO NOTHING;
  `);
  console.log("Database seeded!");
  process.exit(0);
}

seed();