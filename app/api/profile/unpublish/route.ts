// POST /api/profile/unpublish — Remove public visibility
import { NextRequest, NextResponse } from 'next/server';
import {
    requireAuth,
    getHandleByUserId,
    unpublishSnapshots,
    deleteSearchIndex,
    safeLogError,
    checkRateLimit,
    DEFAULT_RATE_LIMIT,
} from '@/lib/truth-engine';
import type { ApiError } from '@/lib/truth-engine';

export async function POST(request: NextRequest) {
    // Rate limiting: 100 requests per minute
    const rateLimitResponse = checkRateLimit(request, DEFAULT_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const user = await requireAuth();
        const body = await request.json();

        if (!body?.confirm) {
            return NextResponse.json(
                { code: 'VALIDATION_ERROR', message: 'Unpublish requires { "confirm": true }.' } satisfies ApiError,
                { status: 422 },
            );
        }

        const handle = await getHandleByUserId(user.id);
        if (!handle) {
            return NextResponse.json(
                { code: 'NOT_FOUND', message: 'No handle found for this user.' } satisfies ApiError,
                { status: 404 },
            );
        }

        // Mark all snapshots as unpublished (retains data, public endpoints return 404)
        await unpublishSnapshots(handle.handle);
        await deleteSearchIndex(handle.handle);

        return NextResponse.json({ published: false });
    } catch (err) {
        if ((err as ApiError).code === 'UNAUTHORIZED') {
            return NextResponse.json(err, { status: 401 });
        }
        safeLogError('POST /api/profile/unpublish', err);
        return NextResponse.json(
            { code: 'INTERNAL', message: 'Internal server error.' } satisfies ApiError,
            { status: 500 },
        );
    }
}
