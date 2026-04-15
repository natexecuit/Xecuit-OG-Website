import { NextRequest, NextResponse } from 'next/server';
import { rateLimit } from '@/lib/rate-limit';
import { validateFormData } from '@/lib/validation';

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Apply rate limiting: 5 requests per hour per IP
    const rateLimitResult = await rateLimit(ip, 5, 3600000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate and sanitize input
    const validation = validateFormData(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const { name, email, company, inquiry } = validation.data;

    // TODO: Implement actual form submission logic
    // Options: Send email, save to database, post to CRM, etc.
    // For now, log to server (not client console)
    console.log('[Contact Form Submission]', {
      timestamp: new Date().toISOString(),
      name,
      email,
      company: company || 'N/A',
      inquiryLength: inquiry.length,
    });

    // Return success with remaining rate limit
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your inquiry. We will get back to you soon.',
        remainingRequests: rateLimitResult.remaining,
      },
      {
        status: 200,
        headers: {
          'X-RateLimit-Remaining': String(rateLimitResult.remaining || 0),
        },
      }
    );

  } catch (error) {
    console.error('[Contact Form Error]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Prevent GET requests to the contact endpoint
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
