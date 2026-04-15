// Simple in-memory rate limiter for production
// For production, consider using Redis or a dedicated rate limiting service

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const limiters = new Map<string, RateLimitEntry>();

export async function rateLimit(
  identifier: string,
  limit: number = 5, // 5 requests
  window: number = 3600000 // 1 hour in milliseconds
): Promise<{ success: boolean; remaining?: number }> {
  const now = Date.now();
  const entry = limiters.get(identifier);

  if (!entry || now > entry.resetTime) {
    // Create new entry or reset expired one
    limiters.set(identifier, {
      count: 1,
      resetTime: now + window,
    });
    return { success: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { success: false };
  }

  entry.count++;
  return { success: true, remaining: limit - entry.count };
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of limiters.entries()) {
    if (now > entry.resetTime) {
      limiters.delete(key);
    }
  }
}, 300000); // Clean up every 5 minutes
