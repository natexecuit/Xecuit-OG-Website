// Server-side PostHog analytics for backend events

const POSTHOG_KEY = 'phc_vjjrrSTsgN7Vnnkesc52TviCPH7drwDQ26fubv6LQBpi';
const POSTHOG_API_HOST = 'https://us.i.posthog.com';

interface PostHogEvent {
  event: string;
  properties?: Record<string, any>;
  distinctId?: string;
}

async function captureEvent(eventData: PostHogEvent) {
  try {
    const response = await fetch(`${POSTHOG_API_HOST}/capture/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: POSTHOG_KEY,
        ...eventData,
        timestamp: new Date().toISOString(),
      }),
    });

    if (!response.ok) {
      console.error('[Analytics] Failed to capture event:', await response.text());
    }
  } catch (error) {
    console.error('[Analytics] Error capturing event:', error);
  }
}

// Portal-specific event tracking functions
export const AnalyticsEvents = {
  // Authentication events
  USER_LOGIN: 'portal_user_login',
  USER_LOGOUT: 'portal_user_logout',
  USER_REGISTER: 'portal_user_register',
  FAILED_LOGIN: 'portal_failed_login',

  // Document events
  DOCUMENT_VIEW: 'portal_document_view',
  DOCUMENT_DOWNLOAD: 'portal_document_download',

  // Admin events
  ADMIN_LOGIN: 'portal_admin_login',
  INVITE_SENT: 'portal_invite_sent',
  USER_REVOKED: 'portal_user_revoked',
};

// Track user login
export async function trackUserLogin(email: string) {
  await captureEvent({
    event: AnalyticsEvents.USER_LOGIN,
    distinctId: email,
    properties: {
      email,
      timestamp: new Date().toISOString(),
    },
  });

  // Also identify the user
  await identifyUser(email, { email });
}

// Track failed login attempt
export async function trackFailedLogin(email: string, reason?: string) {
  await captureEvent({
    event: AnalyticsEvents.FAILED_LOGIN,
    distinctId: email,
    properties: {
      email,
      reason,
      timestamp: new Date().toISOString(),
    },
  });
}

// Track admin login
export async function trackAdminLogin() {
  await captureEvent({
    event: AnalyticsEvents.ADMIN_LOGIN,
    distinctId: 'admin',
    properties: {
      timestamp: new Date().toISOString(),
    },
  });
}

// Track invite sent
export async function trackInviteSent(inviteEmail: string, adminEmail: string) {
  await captureEvent({
    event: AnalyticsEvents.INVITE_SENT,
    distinctId: adminEmail,
    properties: {
      inviteEmail,
      timestamp: new Date().toISOString(),
    },
  });

  // Also identify the invited user
  await identifyUser(inviteEmail, { email: inviteEmail });
}

// Track user revoked
export async function trackUserRevoked(userEmail: string, adminEmail: string) {
  await captureEvent({
    event: AnalyticsEvents.USER_REVOKED,
    distinctId: adminEmail,
    properties: {
      userEmail,
      timestamp: new Date().toISOString(),
    },
  });
}

// Identify/update user properties
async function identifyUser(distinctId: string, properties: Record<string, any>) {
  await captureEvent({
    event: '$identify',
    distinctId,
    properties: {
      $set: properties,
    },
  });
}
