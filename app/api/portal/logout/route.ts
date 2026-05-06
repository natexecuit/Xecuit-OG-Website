import { NextRequest, NextResponse } from 'next/server';
import { invalidateSession } from '@/lib/portal/auth';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('portal-session')?.value;
    const adminSessionToken = request.cookies.get('portal-admin-session')?.value;

    if (sessionToken) {
      invalidateSession(sessionToken);
    }

    // Admin sessions are self-validating and don't need server-side invalidation
    // We just need to clear the cookie

    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    });

    // Clear both session cookies
    const cookiesToDelete = [
      'portal-session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
      'portal-admin-session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT',
    ];

    response.headers.append('Set-Cookie', cookiesToDelete[0]);
    response.headers.append('Set-Cookie', cookiesToDelete[1]);

    return response;
  } catch (error) {
    console.error('[Logout Error]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}
