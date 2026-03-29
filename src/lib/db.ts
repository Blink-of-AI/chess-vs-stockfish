import { neon } from '@neondatabase/serverless';

export function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL environment variable is not set');
  return neon(url);
}

export async function initSchema() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS games (
      id          SERIAL PRIMARY KEY,
      played_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      player_color CHAR(1) NOT NULL,
      result      VARCHAR(10) NOT NULL,
      end_reason  VARCHAR(30) NOT NULL,
      moves       TEXT NOT NULL,
      move_count  INTEGER NOT NULL
    )
  `;
}
