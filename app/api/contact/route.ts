import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { rateLimit } from '@/lib/rate-limit';
import { validateFormData } from '@/lib/validation';

// Initialize Resend with API key from environment variables
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

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

    // Send email using Resend
    if (resend) {
      try {
        const { data, error } = await resend.emails.send({
          from: 'Xecuit Website <contact@xecuit.com>',
          to: 'engage@xecuit.com',
          replyTo: email,
          subject: `New Inquiry from ${name}${company ? ` at ${company}` : ''}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Contact Form Submission</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: #264C3F; color: #E2DBCF; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                  .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
                  .content { background: #f9f7f4; padding: 30px; border-radius: 0 0 8px 8px; }
                  .field { margin-bottom: 20px; }
                  .field-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.1em; color: #9E8461; font-weight: 600; margin-bottom: 5px; }
                  .field-value { font-size: 16px; color: #264C3F; }
                  .message { background: white; padding: 20px; border-left: 4px solid #9E8461; margin-top: 20px; }
                  .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>New Engagement Inquiry</h1>
                  </div>
                  <div class="content">
                    <div class="field">
                      <div class="field-label">From</div>
                      <div class="field-value">${name} &lt;${email}&gt;</div>
                    </div>
                    ${company ? `
                    <div class="field">
                      <div class="field-label">Company</div>
                      <div class="field-value">${company}</div>
                    </div>
                    ` : ''}
                    <div class="field">
                      <div class="field-label">Message</div>
                      <div class="message">${inquiry.replace(/\n/g, '<br>')}</div>
                    </div>
                    <div class="footer">
                      <p>Sent from xecuit.com contact form</p>
                      <p>${new Date().toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `,
          text: `
New Contact Form Submission

From: ${name} <${email}>
${company ? `Company: ${company}` : ''}

Message:
${inquiry}

---
Sent from xecuit.com contact form
${new Date().toLocaleString()}
          `,
        });

        if (error) {
          console.error('[Resend Error]', error);
          // Continue anyway - don't block submission if email fails
        } else {
          console.log('[Email Sent]', data);
        }
      } catch (emailError) {
        console.error('[Email Error]', emailError);
        // Continue anyway - don't block submission if email fails
      }
    } else {
      console.warn('[Resend Not Configured] RESEND_API_KEY environment variable not set');
    }

    // Log submission (regardless of email status)
    console.log('[Contact Form Submission]', {
      timestamp: new Date().toISOString(),
      name,
      email,
      company: company || 'N/A',
      inquiryLength: inquiry.length,
      emailSent: !!resend,
    });

    // Return success
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
