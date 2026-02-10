// GET /api/u/:handle/json — Public dataset endpoint
import { NextRequest, NextResponse } from 'next/server';
import { getLatestSnapshot, checkRateLimit, PUBLIC_READ_RATE_LIMIT } from '@/lib/truth-engine';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ handle: string }> }
) {
    // Rate limiting: 300 requests per minute for public read endpoints
    const rateLimitResponse = checkRateLimit(request, PUBLIC_READ_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    const { handle } = await params;
    const snapshot = getLatestSnapshot(handle);

    if (!snapshot) {
        return NextResponse.json(
            { code: 'NOT_FOUND', message: `No published profile found for handle "${handle}".` },
            { status: 404 },
        );
    }

    return NextResponse.json(JSON.parse(snapshot.public_json), {
        headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
        },
    });
}
