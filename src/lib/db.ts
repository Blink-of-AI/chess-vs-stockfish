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

export async function initUsersSchema() {
  const sql = getDb();
  await sql`
    CREATE TABLE IF NOT EXISTS users (
      ip          VARCHAR(64) PRIMARY KEY,
      username    VARCHAR(50) NOT NULL,
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;
}

export async function getUserByIp(ip: string): Promise<string | null> {
  await initUsersSchema();
  const sql = getDb();
  const rows = await sql`SELECT username FROM users WHERE ip = ${ip}`;
  return (rows[0]?.username as string) ?? null;
}

export async function upsertUser(ip: string, username: string): Promise<void> {
  await initUsersSchema();
  const sql = getDb();
  await sql`
    INSERT INTO users (ip, username, updated_at)
    VALUES (${ip}, ${username}, NOW())
    ON CONFLICT (ip) DO UPDATE SET username = ${username}, updated_at = NOW()
  `;
}
