// Authentication utilities for the portal

import { createHash, randomBytes, timingSafeEqual } from 'crypto';

const ADMIN_PASSWORD_HASH = 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'; // Hash of "1ron$harp3ns1ron"
const SESSION_SECRET = process.env.PORTAL_SESSION_SECRET || 'xecuit-portal-secret-change-in-production';

// Admin password (in production, store this in environment variables)
const ADMIN_PASSWORD = process.env.PORTAL_ADMIN_PASSWORD || '1ron$harp3ns1ron';

// Simple session storage (in-memory, for demo purposes)
// In production, use a proper session store with database
const sessions = new Map<string, { email: string; expiresAt: number }>();

export interface Session {
  email: string;
  expiresAt: number;
}

// Hash password using SHA-256 (in production, use bcrypt or similar)
export function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex');
}

// Verify password
export function verifyPassword(password: string, storedHash: string): boolean {
  const inputHash = hashPassword(password);

  // Simple comparison for reliability in dev environment
  // In production with persistent sessions, use timingSafeEqual
  if (inputHash.length !== storedHash.length) {
    return false;
  }

  // Use timing-safe comparison to prevent timing attacks
  try {
    return timingSafeEqual(
      Buffer.from(inputHash, 'hex'),
      Buffer.from(storedHash, 'hex')
    );
  } catch (e) {
    // Fallback to simple comparison if timingSafeEqual fails
    console.warn('[Auth] timingSafeEqual failed, using fallback');
    return inputHash === storedHash;
  }
}

// Verify admin password
export function verifyAdminPassword(password: string): boolean {
  // Direct comparison for simplicity (in production, use hashed passwords)
  return password === ADMIN_PASSWORD;
}

// Generate session token
export function generateSessionToken(): string {
  return randomBytes(32).toString('hex');
}

// Create session
export function createSession(email: string, duration: number = 24 * 60 * 60 * 1000): string {
  const token = generateSessionToken();
  const expiresAt = Date.now() + duration;
  sessions.set(token, { email, expiresAt });
  return token;
}

// Get session from token
export function getSession(token: string): Session | null {
  const session = sessions.get(token);
  if (!session) return null;

  // Check if session is expired
  if (Date.now() > session.expiresAt) {
    sessions.delete(token);
    return null;
  }

  return session;
}

// Invalidate session
export function invalidateSession(token: string): void {
  sessions.delete(token);
}

// Invalidate all sessions for a user
export function invalidateUserSessions(email: string): void {
  for (const [token, session] of sessions.entries()) {
    if (session.email.toLowerCase() === email.toLowerCase()) {
      sessions.delete(token);
    }
  }
}

// Create admin session (for invite page)
// Uses a token-based approach that includes expiry for Vercel compatibility
export function createAdminSession(duration: number = 2 * 60 * 60 * 1000): string {
  const expiresAt = Date.now() + duration;
  const token = randomBytes(32).toString('hex');
  // Store in memory as well for immediate requests
  sessions.set(token, { email: 'ADMIN', expiresAt });
  // Return token with expiry info encoded for validation
  return `${token}:${expiresAt}`;
}

// Check if session is admin
export function isAdminSession(token: string): boolean {
  // Handle both new format (token:expiry) and old format (just token)
  const [sessionToken, expiryStr] = token.split(':');

  if (expiryStr) {
    // New format: validate expiry and check memory
    const expiresAt = parseInt(expiryStr, 10);
    if (Date.now() > expiresAt) {
      return false; // Expired
    }
  }

  // Check in-memory sessions
  const session = sessions.get(sessionToken || token);
  return session?.email === 'ADMIN';
}

// Clean up expired sessions periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of sessions.entries()) {
    if (now > session.expiresAt) {
      sessions.delete(token);
    }
  }
}, 60 * 60 * 1000); // Clean up every hour
