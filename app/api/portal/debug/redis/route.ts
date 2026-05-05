import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const debugInfo: any = {
    environment: process.env.NODE_ENV || 'unknown',
    timestamp: new Date().toISOString(),
    envVars: {
      UPSTASH_REDIS_REST_URL: process.env.UPSTASH_REDIS_REST_URL ? 'SET' : 'NOT SET',
      UPSTASH_REDIS_REST_TOKEN: process.env.UPSTASH_REDIS_REST_TOKEN ? 'SET' : 'NOT SET',
    },
  };

  // Only show partial URL for security
  if (process.env.UPSTASH_REDIS_REST_URL) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    debugInfo.envVars['UPSTASH_REDIS_REST_URL'] = `${url.substring(0, 30)}...`;
  }

  // Try to connect to Redis
  try {
    const { Redis } = await import('@upstash/redis');
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || '',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    });

    // Test connection
    await redis.set('health-check', 'ok');
    const result = await redis.get('health-check');
    await redis.del('health-check');

    debugInfo.redis = {
      status: 'connected',
      testResult: result,
    };
  } catch (error: any) {
    debugInfo.redis = {
      status: 'error',
      error: error.message || 'Unknown error',
    };
  }

  return NextResponse.json(debugInfo);
}
