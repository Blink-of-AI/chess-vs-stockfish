import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

const ADMIN_USERNAME = 'Kamil Admin';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    if (body.username !== ADMIN_USERNAME) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    const sql = getDb();
    await sql`DELETE FROM games`;
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('POST /api/admin/reset error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
