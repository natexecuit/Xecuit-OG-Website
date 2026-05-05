import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminPassword, createAdminSession } from '@/lib/portal/auth';
import { rateLimit } from '@/lib/rate-limit';
import { cookies } from 'next/headers';
import { trackAdminLogin } from '@/lib/analytics';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Rate limit: 5 attempts per hour for admin login
    const rateLimitResult = await rateLimit(`admin-${ip}`, 5, 3600000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many attempts. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { password } = body;

    if (!password) {
      return NextResponse.json(
        { error: 'Password is required' },
        { status: 400 }
      );
    }

    // Verify admin password
    if (!verifyAdminPassword(password)) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    // Create admin session
    const sessionToken = createAdminSession();

    // Track admin login
    await trackAdminLogin();

    // Build cookie string
    const maxAge = 2 * 60 * 60; // 2 hours
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
    const cookieString = `portal-admin-session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Expires=${expires}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;

    const response = NextResponse.json({
      success: true,
      message: 'Admin access granted'
    });

    response.headers.set('Set-Cookie', cookieString);

    return response;
  } catch (error) {
    console.error('[Admin Verify Error]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
