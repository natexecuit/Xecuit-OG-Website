// Email template for portal access invitations

export function generateInviteEmail({
  recipientEmail,
  password,
  portalUrl = 'https://xecuit.com/portal',
}: {
  recipientEmail: string;
  password: string;
  portalUrl?: string;
}): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Xecuit Portal Access</title>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&amp;display=swap">
  <style>
    @font-face {
      font-family: 'Gilroy';
      src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154383871-7a29b740/Gilroy-Regular.ttf') format('truetype');
      font-weight: 400;
    }
    @font-face {
      font-family: 'Gilroy';
      src: url('https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154322537-56f5335a/Gilroy-Bold.ttf') format('truetype');
      font-weight: 700;
    }
    body {
      font-family: 'Gilroy', 'Plus Jakarta Sans', Arial, sans-serif;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border: 1px solid #e5e5e5;
    }
    .gold-border {
      border-bottom: 2px solid #9E8461;
    }
  </style>
</head>
<body>
  <div class="min-h-screen bg-[#f4f4f4] py-12 px-4">
    <div class="email-container overflow-hidden">
      <!-- Header -->
      <div class="p-10 pb-6 gold-border">
        <img src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154265286-1feb109e/Xecuit_logo_charcoal.png" alt="Xecuit" class="h-6 mb-4">
        <h1 class="text-[#264C3F] text-xs font-bold tracking-[0.2em] uppercase">Portal Access Invitation</h1>
      </div>

      <!-- Content -->
      <div class="p-10 pt-8">
        <p class="text-[#264C3F] text-base mb-6">Dear Partner,</p>

        <p class="text-[#264C3F] text-[15px] leading-relaxed mb-6 opacity-90">
          You have been granted access to the <strong>Xecuit Counterparty Access Portal</strong>.
          This environment serves as the central repository for our acquisition framework,
          investment intelligence, and active capital structures.
        </p>

        <p class="text-[#264C3F] text-[15px] leading-relaxed mb-8 opacity-90">
          The materials enclosed within the portal are intended for qualified institutional counterparties
          engaged in direct strategic discussions with Xecuit Holdings LLC.
        </p>

        <!-- Credentials Box -->
        <div class="bg-[#F9F8F6] border border-[#E2DBCF] p-8 mb-8">
          <h2 class="text-[#264C3F] text-xs font-bold tracking-[0.1em] uppercase mb-6">Access Details</h2>

          <div class="space-y-4">
            <div class="flex justify-between items-center border-b border-[#E2DBCF] pb-3">
              <span class="text-[#9E8461] text-xs font-semibold uppercase tracking-wider">Email</span>
              <span class="text-[#264C3F] text-sm font-medium">${recipientEmail}</span>
            </div>
            <div class="flex justify-between items-center border-b border-[#E2DBCF] pb-3">
              <span class="text-[#9E8461] text-xs font-semibold uppercase tracking-wider">Password</span>
              <span class="text-[#264C3F] text-sm font-medium font-mono">${password}</span>
            </div>
            <div class="flex justify-between items-center pt-2">
              <span class="text-[#9E8461] text-xs font-semibold uppercase tracking-wider">Portal URL</span>
              <a href="${portalUrl}" class="text-[#264C3F] text-sm font-bold underline underline-offset-4">portal.xecuit.com</a>
            </div>
          </div>
        </div>

        <div class="mb-10">
          <a href="${portalUrl}" class="inline-block bg-[#264C3F] text-white px-8 py-3 text-sm font-bold tracking-widest uppercase hover:bg-[#1a352c] transition-colors">
            Enter Portal
          </a>
        </div>

        <p class="text-[#264C3F] text-[15px] mb-2 font-medium">Best regards,</p>
        <p class="text-[#264C3F] text-[15px] opacity-80">
          Xecuit Holdings LLC<br>
          <span class="text-xs tracking-wider uppercase opacity-60">Acquisition Platform</span>
        </p>
      </div>

      <div class="bg-[#F9F8F6] p-10 border-t border-[#e5e5e5]">
        <p class="text-[#264C3F] text-[11px] leading-relaxed opacity-50 uppercase tracking-tighter">
          <strong>Confidentiality Notice:</strong> The information contained in this communication,
          including any login credentials, is strictly proprietary and confidential. It is intended
          solely for the use of the individual or entity to whom it is addressed. Unauthorized review,
          use, disclosure, or distribution is prohibited. If you have received this message in error,
          please contact <a href="mailto:LEGAL@xecuit.com" class="underline">LEGAL@xecuit.com</a> immediately.
        </p>

        <div class="mt-8 pt-8 border-t border-[#E2DBCF] flex justify-between items-end">
          <div class="text-[#264C3F] text-[10px] opacity-40">
            © 2026 Xecuit Holdings LLC. All Rights Reserved.
          </div>
          <div class="flex gap-4">
            <a href="https://linkedin.com/company/xecuit" class="text-[#264C3F] opacity-40 hover:opacity-100">
              <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>
            </a>
          </div>
        </div>
      </div></div>

      <!-- Footer -->

    </div>
  </div>

</body>
</html>
  `.trim();
}

export function generateInviteEmailText({
  recipientEmail,
  password,
  portalUrl = 'https://xecuit.com/portal',
}: {
  recipientEmail: string;
  password: string;
  portalUrl?: string;
}): string {
  return `
Xecuit Counterparty Access Portal - Invitation

Dear Partner,

You have been granted access to the Xecuit Counterparty Access Portal.
This environment serves as the central repository for our acquisition framework,
investment intelligence, and active capital structures.

The materials enclosed within the portal are intended for qualified institutional
counterparties engaged in direct strategic discussions with Xecuit Holdings LLC.

ACCESS DETAILS
--------------
Email: ${recipientEmail}
Password: ${password}
Portal URL: ${portalUrl}

Best regards,

Xecuit Holdings LLC
Acquisition Platform

---
CONFIDENTIALITY NOTICE: The information contained in this communication, including
any login credentials, is strictly proprietary and confidential. It is intended
solely for the use of the individual or entity to whom it is addressed. Unauthorized
review, use, disclosure, or distribution is prohibited. If you have received this
message in error, please contact LEGAL@xecuit.com immediately.

© 2026 Xecuit Holdings LLC. All Rights Reserved.
  `.trim();
}
