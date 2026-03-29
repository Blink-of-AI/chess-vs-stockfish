import { NextRequest, NextResponse } from 'next/server';
import { getDb, initSchema } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { playerColor, result, endReason, moves, moveCount } = body;

    if (!playerColor || !result || !endReason || !moves || moveCount === undefined) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    await initSchema();
    const sql = getDb();

    const rows = await sql`
      INSERT INTO games (player_color, result, end_reason, moves, move_count)
      VALUES (${playerColor}, ${result}, ${endReason}, ${moves}, ${moveCount})
      RETURNING id, played_at
    `;

    return NextResponse.json({ id: rows[0].id, playedAt: rows[0].played_at }, { status: 201 });
  } catch (err) {
    console.error('POST /api/games error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    await initSchema();
    const sql = getDb();

    const rows = await sql`
      SELECT id, played_at, player_color, result, end_reason, move_count
      FROM games
      ORDER BY played_at DESC
      LIMIT 20
    `;

    return NextResponse.json({ games: rows });
  } catch (err) {
    console.error('GET /api/games error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
