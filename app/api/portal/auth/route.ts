import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, updateUserStatus } from '@/lib/portal/storage';
import { verifyPassword, createSession } from '@/lib/portal/auth';
import { rateLimit } from '@/lib/rate-limit';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Rate limit: 10 attempts per hour
    const rateLimitResult = await rateLimit(ip, 10, 3600000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many login attempts. Please try again later.' },
        { status: 429 }
      );
    }

    let body;
    try {
      const text = await request.text();
      body = JSON.parse(text);
    } catch (parseError) {
      console.error('[Portal Auth] JSON parse error:', parseError);
      return NextResponse.json(
        { error: 'Invalid request format' },
        { status: 400 }
      );
    }

    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find user
    const user = getUserByEmail(email);
    if (!user) {
      console.log('[Portal Auth] User not found:', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    console.log('[Portal Auth] Attempting login for:', email);
    const passwordValid = verifyPassword(password, user.passwordHash);
    console.log('[Portal Auth] Password valid:', passwordValid);

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Update user status to active if this is their first login
    if (user.status === 'pending') {
      updateUserStatus(email, 'active');
    }

    // Create session
    const sessionToken = createSession(email);

    // Build cookie string
    const maxAge = 24 * 60 * 60; // 24 hours
    const expires = new Date(Date.now() + maxAge * 1000).toUTCString();
    const cookieString = `portal-session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}; Expires=${expires}${process.env.NODE_ENV === 'production' ? '; Secure' : ''}`;

    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      redirect: '/portal/dashboard'
    });

    // Set cookie using headers
    response.headers.set('Set-Cookie', cookieString);

    return response;
  } catch (error) {
    console.error('[Portal Auth Error]', error);
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
