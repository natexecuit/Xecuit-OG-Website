'use client';

import { PostHog } from 'posthog-js/react';
import { useEffect, useState } from 'react';
import posthog from 'posthog-js';

const POSTHOG_KEY = 'phc_vjjrrSTsgN7Vnnkesc52TviCPH7drwDQ26fubv6LQBpi';

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const [posthogInstance, setPosthogInstance] = useState<PostHog | null>(null);

  useEffect(() => {
    // Initialize PostHog
    if (typeof window !== 'undefined') {
      posthog.init(POSTHOG_KEY, {
        api_host: 'https://us.i.posthog.com',
        capture_pageview: false, // We'll handle page views manually
        capture_pageleave: true, // Track when users leave the page
        persistence: 'cookie',
      });

      setPosthogInstance(posthog as any);
    }

    return () => {
      if (posthog) {
        posthog.reset();
      }
    };
  }, []);

  return (
    <PostHogContext.Provider value={posthogInstance}>
      {children}
    </PostHogContext.Provider>
  );
}

import { createContext, useContext } from 'react';

const PostHogContext = createContext<PostHog | null>(null);

export function usePostHog() {
  return useContext(PostHogContext);
}

// Helper functions for tracking specific portal events
export const PortalEvents = {
  // Authentication events
  USER_LOGIN: 'portal_user_login',
  USER_LOGOUT: 'portal_user_logout',
  USER_SESSION_START: 'portal_session_start',
  USER_SESSION_END: 'portal_session_end',

  // Document events
  DOCUMENT_VIEW: 'portal_document_view',
  DOCUMENT_DOWNLOAD: 'portal_document_download',

  // Navigation events
  NAVIGATE_TO_DASHBOARD: 'portal_navigate_dashboard',
  NAVIGATE_TO_LOGIN: 'portal_navigate_login',
  NAVIGATE_TO_INVITE: 'portal_navigate_invite',
};

// Tracking helpers
export function trackUserLogin(email: string, posthog: PostHog | null) {
  if (!posthog) return;

  posthog.identify(email, {
    email,
    firstSeen: new Date().toISOString(),
  });

  posthog.capture(PortalEvents.USER_LOGIN, {
    email,
    timestamp: new Date().toISOString(),
  });

  posthog.capture(PortalEvents.USER_SESSION_START, {
    email,
    timestamp: new Date().toISOString(),
  });
}

export function trackUserLogout(posthog: PostHog | null) {
  if (!posthog) return;

  const email = posthog.get_distinct_id();

  posthog.capture(PortalEvents.USER_LOGOUT, {
    email,
    timestamp: new Date().toISOString(),
  });

  posthog.capture(PortalEvents.USER_SESSION_END, {
    email,
    timestamp: new Date().toISOString(),
  });

  posthog.reset();
}

export function trackDocumentView(documentId: string, documentTitle: string, posthog: PostHog | null) {
  if (!posthog) return;

  posthog.capture(PortalEvents.DOCUMENT_VIEW, {
    documentId,
    documentTitle,
    timestamp: new Date().toISOString(),
  });

  // Track page view as well for session duration
  posthog.capture('$pageview', {
    $current_url: `/portal/document/${documentId}`,
  });
}

export function trackDocumentDownload(documentId: string, documentTitle: string, posthog: PostHog | null) {
  if (!posthog) return;

  posthog.capture(PortalEvents.DOCUMENT_DOWNLOAD, {
    documentId,
    documentTitle,
    timestamp: new Date().toISOString(),
  });
}
