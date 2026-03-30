import { NextRequest, NextResponse } from 'next/server';
import { getUserByIp, upsertUser } from '@/lib/db';

function getIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  );
}

export async function GET(req: NextRequest) {
  try {
    const ip = getIp(req);
    const username = await getUserByIp(ip);
    return NextResponse.json({ username });
  } catch (err) {
    console.error('GET /api/username error:', err);
    return NextResponse.json({ username: null });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username } = body;
    if (!username || typeof username !== 'string') {
      return NextResponse.json({ error: 'Missing username' }, { status: 400 });
    }
    const ip = getIp(req);
    await upsertUser(ip, username.trim().slice(0, 50));
    return NextResponse.json({ username: username.trim().slice(0, 50) });
  } catch (err) {
    console.error('POST /api/username error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
