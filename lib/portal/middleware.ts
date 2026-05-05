import { NextRequest, NextResponse } from 'next/server';
import { getSession, isAdminSession } from './auth';

export function requireAuth(request: NextRequest) {
  const sessionToken = request.cookies.get('portal-session')?.value;
  const session = sessionToken ? getSession(sessionToken) : null;

  if (!session) {
    return NextResponse.redirect(new URL('/portal/login', request.url));
  }

  return null; // Authenticated
}

export function requireAdminAuth(request: NextRequest) {
  const sessionToken = request.cookies.get('portal-admin-session')?.value;

  if (!sessionToken || !isAdminSession(sessionToken)) {
    return NextResponse.redirect(new URL('/portal/invite', request.url));
  }

  return null; // Authenticated
}

export function getUserFromRequest(request: NextRequest) {
  const sessionToken = request.cookies.get('portal-session')?.value;
  const session = sessionToken ? getSession(sessionToken) : null;
  return session?.email || null;
}
