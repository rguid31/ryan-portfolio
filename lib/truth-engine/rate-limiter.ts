/**
 * Rate Limiter - Prevent abuse and DoS attacks
 *
 * Simple in-memory rate limiter for MVP.
 * For production at scale, consider Redis-based solution.
 */

import { NextRequest, NextResponse } from 'next/server';
import type { ApiError } from './types';

interface RateLimitRecord {
    count: number;
    resetAt: number; // Unix timestamp in ms
}

// In-memory store (resets on server restart - acceptable for MVP)
const ipLimits = new Map<string, RateLimitRecord>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipLimits.entries()) {
        if (now > record.resetAt) {
            ipLimits.delete(ip);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    /** Max requests per window */
    maxRequests: number;
    /** Window duration in milliseconds */
    windowMs: number;
    /** Custom error message */
    message?: string;
}

/** Default rate limit: 100 requests per minute */
export const DEFAULT_RATE_LIMIT: RateLimitConfig = {
    maxRequests: 100,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many requests. Please try again later.',
};

/** Strict rate limit for auth endpoints: 10 per minute */
export const AUTH_RATE_LIMIT: RateLimitConfig = {
    maxRequests: 10,
    windowMs: 60 * 1000,
    message: 'Too many authentication attempts. Please try again later.',
};

/** Generous rate limit for read-only public endpoints: 300 per minute */
export const PUBLIC_READ_RATE_LIMIT: RateLimitConfig = {
    maxRequests: 300,
    windowMs: 60 * 1000,
};

/**
 * Extract client IP from request
 * Handles X-Forwarded-For (proxies), X-Real-IP, and direct connection
 */
function getClientIp(request: NextRequest): string {
    // Check X-Forwarded-For header (most common with proxies/CDNs)
    const forwardedFor = request.headers.get('x-forwarded-for');
    if (forwardedFor) {
        // Take the first IP (client)
        return forwardedFor.split(',')[0].trim();
    }

    // Check X-Real-IP header
    const realIp = request.headers.get('x-real-ip');
    if (realIp) {
        return realIp.trim();
    }

    // Fallback to unknown if no IP headers are present
    // (request.ip is not available in all Next.js deployment environments)
    return 'unknown';
}

/**
 * Check if request is rate limited
 *
 * @returns NextResponse with 429 if rate limited, null otherwise
 */
export function checkRateLimit(
    request: NextRequest,
    config: RateLimitConfig = DEFAULT_RATE_LIMIT
): NextResponse | null {
    const ip = getClientIp(request);
    const now = Date.now();

    // Get or create record for this IP
    let record = ipLimits.get(ip);

    if (!record || now > record.resetAt) {
        // Create new record or reset expired one
        record = {
            count: 1,
            resetAt: now + config.windowMs,
        };
        ipLimits.set(ip, record);
        return null; // Not rate limited
    }

    // Increment counter
    record.count++;

    // Check if limit exceeded
    if (record.count > config.maxRequests) {
        const retryAfter = Math.ceil((record.resetAt - now) / 1000); // seconds

        return NextResponse.json(
            {
                code: 'RATE_LIMIT_EXCEEDED',
                message: config.message || DEFAULT_RATE_LIMIT.message || 'Too many requests',
            } satisfies ApiError,
            {
                status: 429,
                headers: {
                    'Retry-After': retryAfter.toString(),
                    'X-RateLimit-Limit': config.maxRequests.toString(),
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': (record.resetAt / 1000).toString(),
                },
            }
        );
    }

    // Not rate limited yet
    return null;
}

/**
 * Rate limit middleware wrapper for API routes
 *
 * @example
 * ```typescript
 * export async function POST(request: NextRequest) {
 *     const rateLimitResponse = checkRateLimit(request, AUTH_RATE_LIMIT);
 *     if (rateLimitResponse) return rateLimitResponse;
 *
 *     // ... rest of your handler
 * }
 * ```
 */
export function withRateLimit(
    handler: (request: NextRequest) => Promise<NextResponse>,
    config?: RateLimitConfig
) {
    return async (request: NextRequest): Promise<NextResponse> => {
        const rateLimitResponse = checkRateLimit(request, config);
        if (rateLimitResponse) {
            return rateLimitResponse;
        }
        return handler(request);
    };
}

/**
 * Get current rate limit status for an IP
 * Useful for debugging or monitoring
 */
export function getRateLimitStatus(request: NextRequest): {
    ip: string;
    count: number;
    resetAt: number;
    remaining: number;
} {
    const ip = getClientIp(request);
    const record = ipLimits.get(ip);

    if (!record) {
        return {
            ip,
            count: 0,
            resetAt: 0,
            remaining: DEFAULT_RATE_LIMIT.maxRequests,
        };
    }

    return {
        ip,
        count: record.count,
        resetAt: record.resetAt,
        remaining: Math.max(0, DEFAULT_RATE_LIMIT.maxRequests - record.count),
    };
}

/**
 * Clear rate limit for an IP (admin use only)
 */
export function clearRateLimit(ip: string): void {
    ipLimits.delete(ip);
}

/**
 * Get all rate limit records (admin/monitoring use only)
 */
export function getAllRateLimits(): Map<string, RateLimitRecord> {
    return new Map(ipLimits);
}
