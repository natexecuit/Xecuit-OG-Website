import { NextRequest, NextResponse } from 'next/server';
import { invalidateSession } from '@/lib/portal/auth';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('portal-session')?.value;
    if (sessionToken) {
      invalidateSession(sessionToken);
    }

    // Clear session cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    response.headers.set('Set-Cookie', 'portal-session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT');

    return response;
  } catch (error) {
    console.error('[Logout Error]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
