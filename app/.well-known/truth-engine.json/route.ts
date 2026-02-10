// GET /.well-known/truth-engine.json — Platform discovery endpoint
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, PUBLIC_READ_RATE_LIMIT } from '@/lib/truth-engine';

export async function GET(request: NextRequest) {
    // Rate limiting: 300 requests per minute for public read endpoints
    const rateLimitResponse = checkRateLimit(request, PUBLIC_READ_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    return NextResponse.json(
        {
            platform: 'truth-engine',
            schemaVersion: '1.0.0',
            endpoints: {
                profileHtml: '/u/{handle}',
                profileJson: '/u/{handle}.json',
                profileJsonLd: '/u/{handle}.jsonld',
                query: '/api/query',
            },
            lastUpdated: new Date().toISOString(),
        },
        {
            headers: {
                'Cache-Control': 'public, max-age=3600',
            },
        },
    );
}
