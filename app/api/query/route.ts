// GET /api/query — Search published profiles
import { NextRequest, NextResponse } from 'next/server';
import { queryProfiles, checkRateLimit, PUBLIC_READ_RATE_LIMIT } from '@/lib/truth-engine';

export async function GET(request: NextRequest) {
    // Rate limiting: 300 requests per minute for public read endpoints
    const rateLimitResponse = checkRateLimit(request, PUBLIC_READ_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    const { searchParams } = request.nextUrl;

    const results = queryProfiles({
        skill: searchParams.get('skill') || undefined,
        org: searchParams.get('org') || undefined,
        title: searchParams.get('title') || undefined,
        location: searchParams.get('location') || undefined,
        updatedAfter: searchParams.get('updatedAfter') || undefined,
        limit: searchParams.has('limit') ? parseInt(searchParams.get('limit')!) : undefined,
        cursor: searchParams.get('cursor') || undefined,
    });

    return NextResponse.json(results);
}
