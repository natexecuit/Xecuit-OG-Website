import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { rateLimit } from '@/lib/rate-limit';

// Initialize Resend with API key from environment variables
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

// Buyer type labels for display
const buyerTypeLabels: Record<string, string> = {
  individual: 'Individual Buyer',
  company: 'Corporate Buyer',
  private_equity: 'Private Equity / Investment Firm',
  family_office: 'Family Office',
  search_fund: 'Search Fund',
};

// Timeline labels for display
const timelineLabels: Record<string, string> = {
  immediate: 'Immediate (within 30 days)',
  '1_3_months': '1-3 months',
  '3_6_months': '3-6 months',
  '6_12_months': '6-12 months',
  exploring: 'Just exploring, no specific timeline',
};

// Motivation labels for display
const motivationLabels: Record<string, string> = {
  primary_income: 'Primary source of income',
  diversification: 'Investment diversification',
  add_on: 'Add-on to existing portfolio',
  lifestyle: 'Lifestyle business',
  growth: 'Growth opportunity',
};

// Capital range labels for display
const capitalLabels: Record<string, string> = {
  under_100k: 'Under $100,000',
  '100k_250k': '$100,000 - $250,000',
  '250k_500k': '$250,000 - $500,000',
  '500k_1m': '$500,000 - $1,000,000',
  '1m_2m': '$1,000,000 - $2,000,000',
  '2m_5m': '$2,000,000 - $5,000,000',
  '5m_10m': '$5,000,000 - $10,000,000',
  '10m_25m': '$10,000,000 - $25,000,000',
  '25m_50m': '$25,000,000 - $50,000,000',
  '50m_100m': '$50,000,000 - $100,000,000',
  '100m_250m': '$100,000,000 - $250,000,000',
  '250m_500m': '$250,000,000 - $500,000,000',
  '500m_1b': '$500,000,000 - $1,000,000,000',
  over_1b: 'Over $1,000,000,000',
};

const netWorthLabels: Record<string, string> = {
  under_500k: 'Under $500,000',
  '500k_1m': '$500,000 - $1,000,000',
  '1m_5m': '$1,000,000 - $5,000,000',
  '5m_10m': '$5,000,000 - $10,000,000',
  '10m_25m': '$10,000,000 - $25,000,000',
  '25m_50m': '$25,000,000 - $50,000,000',
  '50m_100m': '$50,000,000 - $100,000,000',
  '100m_250m': '$100,000,000 - $250,000,000',
  '250m_500m': '$250,000,000 - $500,000,000',
  '500m_1b': '$500,000,000 - $1,000,000,000',
  over_1b: 'Over $1,000,000,000',
};

// Industry labels for display
const industryLabels: Record<string, string> = {
  health_wellness: 'Health & Wellness / Fitness',
  ecommerce_dtc: 'E-commerce / DTC',
  technology_software: 'Technology / Software / SaaS',
  manufacturing: 'Manufacturing / Industrial',
  retail_consumer: 'Retail / Consumer Goods',
  financial_services: 'Financial Services / Banking',
  real_estate: 'Real Estate / Construction',
  healthcare: 'Healthcare / Medical',
  energy: 'Energy / Utilities',
  telecom: 'Telecommunications',
  transportation_logistics: 'Transportation / Logistics',
  food_beverage: 'Food & Beverage',
  education: 'Education / EdTech',
  media_entertainment: 'Media / Entertainment',
  professional_services: 'Professional Services (Legal, Consulting, etc.)',
  automotive: 'Automotive / Transportation',
  aerospace_defense: 'Aerospace & Defense',
  agriculture: 'Agriculture / AgTech',
  pharma_biotech: 'Pharmaceuticals / Biotechnology',
  hospitality_travel: 'Hospitality / Travel',
  private_equity: 'Private Equity / Investment Management',
  family_office: 'Family Office / Wealth Management',
  conglomerate: 'Conglomerate / Holding Company',
  other: 'Other',
};

interface BuyerFormData {
  // Contact Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;

  // Buyer Profile
  buyerType: string;
  companyName: string;
  website: string;
  businessOfInterest: string;

  // Financial Qualification
  liquidCapital: string;
  netWorth: string;
  fundingSource: string;
  financingNeeded: boolean;

  // Experience & Background
  industryExperience: string;
  acquisitionExperience: boolean;
  backgroundSummary: string;

  // Timeline & Intent
  purchaseTimeline: string;
  primaryMotivation: string;

  // Agreement
  agreesToNDA: boolean;
  agreesToProcess: boolean;
}

function validateBuyerForm(data: Partial<BuyerFormData>): { success: boolean; errors?: Record<string, string>; data?: BuyerFormData } {
  const errors: Record<string, string> = {};
  const cleaned: any = {};

  // Required fields validation
  const requiredFields = [
    'firstName', 'lastName', 'email', 'phone',
    'buyerType', 'liquidCapital', 'netWorth', 'fundingSource',
    'backgroundSummary', 'purchaseTimeline', 'primaryMotivation',
    'agreesToNDA', 'agreesToProcess'
  ] as const;

  for (const field of requiredFields) {
    const value = data[field];
    if (typeof value === 'boolean') {
      if (!value) errors[field] = `${field} is required`;
      else cleaned[field] = value;
    } else if (!value || (typeof value === 'string' && value.trim() === '')) {
      errors[field] = `${field} is required`;
    } else {
      cleaned[field] = value;
    }
  }

  // Email validation
  if (cleaned.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned.email)) {
    errors.email = 'Invalid email address';
  }

  // Phone validation (basic)
  if (cleaned.phone && !/^[\d\s\-\+\(\)]{10,}$/.test(cleaned.phone.replace(/\s/g, ''))) {
    errors.phone = 'Invalid phone number';
  }

  // Company name required for certain buyer types
  if ((cleaned.buyerType === 'company' || cleaned.buyerType === 'private_equity' || cleaned.buyerType === 'family_office') && !cleaned.companyName) {
    errors.companyName = 'Company name required for this buyer type';
  }

  // Optional fields
  cleaned.companyName = data.companyName || '';
  cleaned.website = data.website || '';
  cleaned.businessOfInterest = data.businessOfInterest || '';
  cleaned.financingNeeded = data.financingNeeded || false;
  cleaned.industryExperience = data.industryExperience || '';
  cleaned.acquisitionExperience = data.acquisitionExperience || false;

  if (Object.keys(errors).length > 0) {
    return { success: false, errors };
  }

  return { success: true, data: cleaned as BuyerFormData };
}

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Apply rate limiting: 3 submissions per hour per IP (buyer inquiries are more deliberate)
    const rateLimitResult = await rateLimit(ip, 3, 3600000);
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many submissions. Please try again later.' },
        { status: 429 }
      );
    }

    // Parse request body
    const body = await request.json();

    // Validate and sanitize input
    const validation = validateBuyerForm(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.errors },
        { status: 400 }
      );
    }

    const data = validation.data!;

    // Build experience items
    const experienceItems = [];
    if (data.industryExperience) experienceItems.push(industryLabels[data.industryExperience] || data.industryExperience);
    if (data.acquisitionExperience) experienceItems.push('Business Acquisitions');

    // Send email using Resend
    if (resend) {
      try {
        const { data: emailData, error } = await resend.emails.send({
          from: 'Xecuit Buyer Qualification <buyers@xecuit.com>',
          to: 'buyers@xecuit.com',
          replyTo: data.email,
          subject: `Buyer Inquiry: ${data.firstName} ${data.lastName} - ${buyerTypeLabels[data.buyerType] || data.buyerType}`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>New Buyer Qualification Submission</title>
                <style>
                  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 700px; margin: 0 auto; padding: 20px; }
                  .header { background: #264C3F; color: #E2DBCF; padding: 30px; border-radius: 8px 8px 0 0; text-align: center; }
                  .header h1 { margin: 0; font-size: 24px; font-weight: 600; }
                  .content { background: #f9f7f4; padding: 30px; border-radius: 0 0 8px 8px; }
                  .section { margin-bottom: 24px; padding-bottom: 24px; border-bottom: 1px solid #e0e0e0; }
                  .section:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }
                  .section-title { font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #9E8461; font-weight: 600; margin-bottom: 12px; }
                  .field { margin-bottom: 16px; }
                  .field-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #666; font-weight: 500; margin-bottom: 4px; }
                  .field-value { font-size: 16px; color: #264C3F; font-weight: 500; }
                  .field-value-light { font-size: 15px; color: #264C3F; }
                  .highlight-box { background: white; padding: 20px; border-left: 4px solid #9E8461; margin-top: 16px; }
                  .checklist { list-style: none; padding: 0; margin: 0; }
                  .checklist li { padding: 6px 0; color: #264C3F; }
                  .checklist li:before { content: "✓ "; color: #9E8461; font-weight: bold; margin-right: 8px; }
                  .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #666; }
                  .badge { display: inline-block; background: #9E8461; color: white; padding: 4px 12px; border-radius: 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>New Buyer Qualification</h1>
                    <p style="margin: 8px 0 0 0; font-size: 13px; opacity: 0.8;">Xecuit Holdings Portfolio Company Opportunity</p>
                  </div>
                  <div class="content">

                    <!-- Contact Information -->
                    <div class="section">
                      <div class="section-title">Contact Information</div>
                      <div class="field">
                        <div class="field-label">Name</div>
                        <div class="field-value">${data.firstName} ${data.lastName}</div>
                      </div>
                      <div class="field">
                        <div class="field-label">Email</div>
                        <div class="field-value"><a href="mailto:${data.email}" style="color: #9E8461;">${data.email}</a></div>
                      </div>
                      <div class="field">
                        <div class="field-label">Phone</div>
                        <div class="field-value">${data.phone}</div>
                      </div>
                    </div>

                    <!-- Buyer Profile -->
                    <div class="section">
                      <div class="section-title">Buyer Profile</div>
                      <div class="field">
                        <div class="field-label">Buyer Type</div>
                        <div class="field-value">${buyerTypeLabels[data.buyerType] || data.buyerType}
                        ${data.companyName ? `<span class="badge">${data.companyName}</span>` : ''}</div>
                      </div>
                      ${data.website ? `
                      <div class="field">
                        <div class="field-label">Website</div>
                        <div class="field-value"><a href="${data.website}" target="_blank" style="color: #9E8461;">${data.website}</a></div>
                      </div>
                      ` : ''}
                      ${data.businessOfInterest ? `
                      <div class="field">
                        <div class="field-label">Business of Interest</div>
                        <div class="field-value">${data.businessOfInterest}</div>
                      </div>
                      ` : ''}
                    </div>

                    <!-- Financial Qualification -->
                    <div class="section">
                      <div class="section-title">Financial Qualification</div>
                      <div class="field">
                        <div class="field-label">Liquid Capital Available</div>
                        <div class="field-value">${capitalLabels[data.liquidCapital] || data.liquidCapital}</div>
                      </div>
                      <div class="field">
                        <div class="field-label">Net Worth</div>
                        <div class="field-value">${netWorthLabels[data.netWorth] || data.netWorth}</div>
                      </div>
                      <div class="field">
                        <div class="field-label">Funding Source</div>
                        <div class="field-value">${data.fundingSource}</div>
                      </div>
                      ${data.financingNeeded ? `
                      <div class="field">
                        <div class="field-label">Financing</div>
                        <div class="field-value-light" style="color: #9E8461;">⚠ Will require external financing</div>
                      </div>
                      ` : ''}
                    </div>

                    <!-- Experience & Background -->
                    <div class="section">
                      <div class="section-title">Experience & Background</div>
                      ${data.industryExperience ? `
                      <div class="field">
                        <div class="field-label">Industry Experience</div>
                        <div class="field-value">${industryLabels[data.industryExperience] || data.industryExperience}</div>
                      </div>
                      ` : ''}
                      ${data.acquisitionExperience ? `
                      <div class="field">
                        <div class="field-label">Additional Experience</div>
                        <div class="field-value">Prior business acquisitions</div>
                      </div>
                      ` : ''}
                      <div class="highlight-box">
                        <div style="font-size: 14px; color: #264C3F; line-height: 1.6; white-space: pre-wrap;">${data.backgroundSummary.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
                      </div>
                    </div>

                    <!-- Timeline & Intent -->
                    <div class="section">
                      <div class="section-title">Timeline & Intent</div>
                      <div class="field">
                        <div class="field-label">Purchase Timeline</div>
                        <div class="field-value">${timelineLabels[data.purchaseTimeline] || data.purchaseTimeline}</div>
                      </div>
                      <div class="field">
                        <div class="field-label">Primary Motivation</div>
                        <div class="field-value">${motivationLabels[data.primaryMotivation] || data.primaryMotivation}</div>
                      </div>
                    </div>

                    <!-- Agreements -->
                    <div class="section" style="border-bottom: none;">
                      <div class="section-title">Agreements</div>
                      <ul class="checklist">
                        <li>Agrees to sign NDA for confidential information</li>
                        <li>Understands qualification process and approval requirements</li>
                      </ul>
                    </div>

                    <div class="footer">
                      <p>Submitted via xecuit.com/buyers qualification form</p>
                      <p style="margin-top: 8px;">${new Date().toLocaleString()}</p>
                      <p style="margin-top: 12px; font-size: 11px; color: #999;">
                        IP: ${ip} | ID: ${Date.now().toString(36).toUpperCase()}
                      </p>
                    </div>
                  </div>
                </div>
              </body>
            </html>
          `,
          text: `
NEW BUYER QUALIFICATION SUBMISSION
==================================

Business: Xecuit Holdings Portfolio Company

CONTACT INFORMATION
--------------------
Name: ${data.firstName} ${data.lastName}
Email: ${data.email}
Phone: ${data.phone}

BUYER PROFILE
-------------
Buyer Type: ${buyerTypeLabels[data.buyerType] || data.buyerType}
${data.companyName ? `Company: ${data.companyName}` : ''}
${data.website ? `Website: ${data.website}` : ''}
${data.businessOfInterest ? `Business of Interest: ${data.businessOfInterest}` : ''}

FINANCIAL QUALIFICATION
-----------------------
Liquid Capital: ${capitalLabels[data.liquidCapital] || data.liquidCapital}
Net Worth: ${netWorthLabels[data.netWorth] || data.netWorth}
Funding Source: ${data.fundingSource}
${data.financingNeeded ? '⚠ Requires external financing' : ''}

EXPERIENCE & BACKGROUND
------------------------
${data.industryExperience ? `Industry: ${industryLabels[data.industryExperience] || data.industryExperience}` : ''}
${data.acquisitionExperience ? 'Acquisitions: Prior business acquisition experience' : ''}

Background Summary:
${data.backgroundSummary}

TIMELINE & INTENT
-----------------
Purchase Timeline: ${timelineLabels[data.purchaseTimeline] || data.purchaseTimeline}
Primary Motivation: ${motivationLabels[data.primaryMotivation] || data.primaryMotivation}

AGREEMENTS
----------
✓ Agrees to NDA
✓ Understands qualification process

---
Submitted: ${new Date().toLocaleString()}
IP: ${ip}
ID: ${Date.now().toString(36).toUpperCase()}
          `,
        });

        if (error) {
          console.error('[Resend Error]', error);
          // Continue anyway - don't block submission if email fails
        } else {
          console.log('[Buyer Inquiry Email Sent]', emailData);
        }
      } catch (emailError) {
        console.error('[Email Error]', emailError);
        // Continue anyway - don't block submission if email fails
      }
    } else {
      console.warn('[Resend Not Configured] RESEND_API_KEY environment variable not set');
    }

    // Log submission (regardless of email status)
    console.log('[Buyer Qualification Submission]', {
      timestamp: new Date().toISOString(),
      name: `${data.firstName} ${data.lastName}`,
      email: data.email,
      buyerType: data.buyerType,
      liquidCapital: data.liquidCapital,
      netWorth: data.netWorth,
      emailSent: !!resend,
    });

    // Return success
    return NextResponse.json(
      {
        success: true,
        message: 'Thank you for your interest. We will review your qualification and contact you within 48 hours.',
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
    console.error('[Buyer Form Error]', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}

// Prevent GET requests to the buyer endpoint
export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}
