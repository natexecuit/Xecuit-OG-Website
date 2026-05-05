import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/portal/auth';
import { getAllUsers } from '@/lib/portal/storage';

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get('portal-session')?.value;
  const session = sessionToken ? getSession(sessionToken) : null;
  const users = await getAllUsers();

  return NextResponse.json({
    sessionToken: sessionToken ? 'exists' : 'missing',
    session: session ? 'valid' : 'invalid',
    sessionEmail: session?.email || null,
    usersCount: users.length,
    users: users.map(u => ({ email: u.email, status: u.status })),
  });
}
