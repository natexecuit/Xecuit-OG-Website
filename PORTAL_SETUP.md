# Xecuit Counterparty Access Portal

This document provides setup and deployment instructions for the Xecuit Counterparty Access Portal.

## Overview

The portal consists of three main pages:

1. **Login Page** (`/portal/login`) - Authentication for counterparties
2. **Dashboard** (`/portal/dashboard`) - Secure document repository
3. **Admin Panel** (`/portal/invite`) - User management (password protected)

## Environment Variables

Create a `.env.local` file in the project root with the following variables:

```env
# Required for sending invitation emails
RESEND_API_KEY=re_xxxxxxxxxxxxxx

# Optional: Custom admin password (default: 1ron$harp3ns1ron)
PORTAL_ADMIN_PASSWORD=your-secure-password-here

# Optional: Custom session secret (default: xecuit-portal-secret-change-in-production)
PORTAL_SESSION_SECRET=your-session-secret-here
```

## Deployment

### Subdomain Configuration

The portal is designed to run on `portal.xecuit.com`. Configure your DNS:

```
portal.xecuit.com.  A  <your-deployment-ip>
```

### Vercel Deployment

1. Set environment variables in Vercel project settings
2. Deploy as usual - the `/portal` route structure is handled automatically

### Self-Hosted Deployment

Ensure the data directory exists and is writable:

```bash
mkdir -p data
echo "[]" > data/portal-users.json
```

## Admin Access

1. Navigate to `portal.xecuit.com/invite`
2. Enter admin password (default: `1ron$harp3ns1ron`)
3. Use the admin panel to:
   - Invite new users with auto-generated or custom passwords
   - View all invited users and their status (Pending/Active)
   - Revoke access for users

## User Workflow

1. **Invitation**: Admin invites a user via the admin panel
2. **Email**: User receives email with credentials and portal URL
3. **First Login**: User logs in at `portal.xecuit.com/login`
   - Status changes from "Pending" to "Active"
4. **Dashboard**: User accesses documents in Overview and Capital sections
5. **Session**: Sessions last 24 hours by default

## Document Storage

Place PDF documents in the `public/documents/` directory:

```
public/documents/
  ├── investment-strategy.pdf
  ├── acquisition-criteria.pdf
  ├── primary-capital.pdf
  └── institutional-capital.pdf
```

Update the `documents` array in `app/portal/dashboard/page.tsx` to match your files.

## Security Notes

⚠️ **Important**: This implementation uses:
- In-memory session storage (sessions are lost on server restart)
- File-based user storage (JSON files)
- SHA-256 password hashing

For production, consider:
- Redis or database-backed sessions
- Proper database for user storage
- bcrypt or Argon2 for password hashing
- Rate limiting and IP blocking
- Two-factor authentication

## API Endpoints

### Authentication
- `POST /api/portal/auth` - User login
- `POST /api/portal/logout` - User logout
- `POST /api/portal/verify-admin` - Admin authentication

### User Management (Admin Only)
- `GET /api/portal/users` - List all users
- `POST /api/portal/users` - Create new user (send invite)
- `DELETE /api/portal/users?email=xxx` - Delete user

## File Structure

```
app/
├── portal/
│   ├── layout.tsx              # Portal layout
│   ├── page.tsx                # Redirects to /login
│   ├── login/
│   │   └── page.tsx            # Login page
│   ├── dashboard/
│   │   ├── layout.tsx          # Auth wrapper
│   │   └── page.tsx            # Dashboard with documents
│   └── invite/
│       └── page.tsx            # Admin panel
├── api/
│   └── portal/
│       ├── auth/route.ts
│       ├── verify-admin/route.ts
│       ├── users/route.ts
│       └── logout/route.ts
lib/
└── portal/
    ├── auth.ts                 # Authentication utilities
    ├── storage.ts              # User data storage
    ├── email-template.ts       # Email templates
    └── middleware.ts           # Auth middleware
data/
└── portal-users.json           # User database (auto-created)
```

## Email Configuration

The portal uses Resend for sending invitation emails. Ensure:

1. You have a verified domain in Resend
2. The `from` address matches your verified domain
3. API key has proper permissions

Template emails are generated in `lib/portal/email-template.ts`.

## Troubleshooting

### Users can't login
- Check `data/portal-users.json` exists
- Verify password hashing is consistent
- Check browser console for errors

### Emails not sending
- Verify `RESEND_API_KEY` is set
- Check Resend dashboard for delivery status
- Verify domain is verified in Resend

### Admin panel inaccessible
- Verify `PORTAL_ADMIN_PASSWORD` environment variable
- Default password: `1ron$harp3ns1ron`
- Check browser console for authentication errors

### Documents not loading
- Verify files exist in `public/documents/`
- Check file URLs in dashboard page
- Ensure files are accessible via HTTP
