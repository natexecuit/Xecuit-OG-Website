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
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Gilroy', 'Plus Jakarta Sans', Arial, sans-serif;
      background-color: #f4f4f4;
      -webkit-font-smoothing: antialiased;
    }
    @media only screen and (max-width: 600px) {
      .email-container {
        width: 100% !important;
        margin: 0 !important;
      }
      .padding-mobile {
        padding: 24px !important;
      }
      .header-content {
        flex-direction: column !important;
        text-align: center !important;
        align-items: center !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; font-family: 'Gilroy', 'Plus Jakarta Sans', Arial, sans-serif; background-color: #f4f4f4;">
  <div style="padding: 40px 20px;">
    <div class="email-container" style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e5e5; overflow: hidden;">
      <!-- Header -->
      <div style="padding: 40px 40px 24px 40px; border-bottom: 2px solid #9E8461;">
        <div class="header-content" style="display: flex; align-items: center; gap: 16px; margin-bottom: 16px;">
          <img src="https://maas-log-prod.cn-wlcb.ufileos.com/anthropic/99628082-b392-45ea-8a9d-bee787dad33e/5a3b738a9e3925545404fbbe6a71d6d6.png?UCloudPublicKey=TOKEN_e15ba47a-d098-4fbd-9afc-a0dcf0e4e621&Expires=1778198400&Signature=c41g1MQf5XKt//t2XrIn1OtP8vI=" alt="Xecuit" style="width: 48px; height: 48px; border-radius: 50%; display: block;">
          <img src="https://vgbujcuwptvheqijyjbe.supabase.co/storage/v1/object/public/hmac-uploads/uploads/91674c7c-9744-4574-9bfd-0371e88f8f51/1769154265370-6f776441/Xecuit_Logo_dark_Green.png" alt="Xecuit" style="height: 32px; width: auto; display: block;">
        </div>
        <h1 style="margin: 0; color: #264C3F; font-size: 12px; font-weight: 700; letter-spacing: 0.2em; text-transform: uppercase;">Portal Access Invitation</h1>
      </div>

      <!-- Content -->
      <div class="padding-mobile" style="padding: 40px 40px 32px 40px;">
        <p style="margin: 0 0 24px 0; color: #264C3F; font-size: 16px; line-height: 1.6;">Dear Partner,</p>

        <p style="margin: 0 0 24px 0; color: #264C3F; font-size: 15px; line-height: 1.6; opacity: 0.9;">
          You have been granted access to the <strong style="font-weight: 700;">Xecuit Counterparty Access Portal</strong>.
          This environment serves as the central repository for our acquisition framework,
          investment intelligence, and active capital structures.
        </p>

        <p style="margin: 0 0 32px 0; color: #264C3F; font-size: 15px; line-height: 1.6; opacity: 0.9;">
          The materials enclosed within the portal are intended for qualified institutional counterparties
          engaged in direct strategic discussions with Xecuit Holdings LLC.
        </p>

        <!-- Credentials Box -->
        <div style="background-color: #F9F8F6; border: 1px solid #E2DBCF; padding: 32px; margin-bottom: 32px;">
          <h2 style="margin: 0 0 24px 0; color: #264C3F; font-size: 12px; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase;">Access Details</h2>

          <div style="margin: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid #E2DBCF; margin-bottom: 16px;">
              <span style="color: #9E8461; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; min-width: 100px;">Email</span>
              <span style="color: #264C3F; font-size: 14px; font-weight: 500; display: block; text-align: right;">${recipientEmail}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 12px; border-bottom: 1px solid #E2DBCF; margin-bottom: 16px;">
              <span style="color: #9E8461; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; min-width: 100px;">Password</span>
              <span style="color: #264C3F; font-size: 14px; font-weight: 500; font-family: 'Courier New', monospace; display: block; text-align: right;">${password}</span>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px;">
              <span style="color: #9E8461; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; min-width: 100px;">Portal URL</span>
              <a href="${portalUrl}" style="color: #264C3F; font-size: 14px; font-weight: 700; text-decoration: underline; text-underline-offset: 4px; display: block; text-align: right;">xecuit.com/portal</a>
            </div>
          </div>
        </div>

        <div style="margin-bottom: 40px;">
          <a href="${portalUrl}" style="display: inline-block; background-color: #264C3F; color: #ffffff; padding: 12px 32px; font-size: 14px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; text-decoration: none; border-radius: 2px;">
            Enter Portal
          </a>
        </div>

        <p style="margin: 0 0 8px 0; color: #264C3F; font-size: 15px; font-weight: 500;">Best regards,</p>
        <p style="margin: 0; color: #264C3F; font-size: 15px; opacity: 0.8; line-height: 1.5;">
          Xecuit Holdings LLC<br>
          <span style="font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; opacity: 0.6;">Acquisition Platform</span>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #F9F8F6; padding: 40px; border-top: 1px solid #e5e5e5;">
        <p style="margin: 0 0 32px 0; color: #264C3F; font-size: 11px; line-height: 1.6; opacity: 0.5; text-transform: uppercase; letter-spacing: 0.02em;">
          <strong style="font-weight: 700;">Confidentiality Notice:</strong> The information contained in this communication,
          including any login credentials, is strictly proprietary and confidential. It is intended
          solely for the use of the individual or entity to whom it is addressed. Unauthorized review,
          use, disclosure, or distribution is prohibited. If you have received this message in error,
          please contact <a href="mailto:LEGAL@xecuit.com" style="color: #264C3F; text-decoration: underline;">LEGAL@xecuit.com</a> immediately.
        </p>

        <div style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #E2DBCF; display: flex; justify-content: space-between; align-items: flex-end; flex-wrap: wrap; gap: 16px;">
          <div style="color: #264C3F; font-size: 10px; opacity: 0.4;">
            © 2026 Xecuit Holdings LLC. All Rights Reserved.
          </div>
          <div style="display: flex; gap: 16px;">
            <a href="https://linkedin.com/company/xecuit" style="color: #264C3F; opacity: 0.4; text-decoration: none;">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
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
