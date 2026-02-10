// DELETE /api/profile — Hard delete user profile + all data
import { NextRequest, NextResponse } from 'next/server';
import {
    requireAuth,
    deleteProfile,
    safeLogError,
    checkRateLimit,
    DEFAULT_RATE_LIMIT,
} from '@/lib/truth-engine';
import type { ApiError } from '@/lib/truth-engine';

export async function DELETE(request: NextRequest) {
    // Rate limiting: 100 requests per minute
    const rateLimitResponse = checkRateLimit(request, DEFAULT_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const user = await requireAuth();
        const body = await request.json();

        if (!body?.confirm) {
            return NextResponse.json(
                { code: 'VALIDATION_ERROR', message: 'Delete requires { "confirm": true }.' } satisfies ApiError,
                { status: 422 },
            );
        }

        // Hard delete: user, handle, draft, snapshots, search index, sessions
        deleteProfile(user.id);

        // Clear session cookie
        const response = NextResponse.json({ deleted: true });
        response.cookies.delete('te_session');
        return response;
    } catch (err) {
        if ((err as ApiError).code === 'UNAUTHORIZED') {
            return NextResponse.json(err, { status: 401 });
        }
        safeLogError('DELETE /api/profile', err);
        return NextResponse.json(
            { code: 'INTERNAL', message: 'Internal server error.' } satisfies ApiError,
            { status: 500 },
        );
    }
}
