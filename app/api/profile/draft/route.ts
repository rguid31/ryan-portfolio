// POST /api/profile/draft — Save canonical draft + visibility settings
import { NextRequest, NextResponse } from 'next/server';
import {
    requireAuth,
    saveDraft,
    getHandleByUserId,
    claimHandle,
    validateCanonicalProfile,
    safeLogError,
    checkRateLimit,
    DEFAULT_RATE_LIMIT,
} from '@/lib/truth-engine';
import type { ApiError, CanonicalProfile, VisibilitySettings } from '@/lib/truth-engine';

export async function POST(request: NextRequest) {
    // Rate limiting: 100 requests per minute
    const rateLimitResponse = checkRateLimit(request, DEFAULT_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const user = await requireAuth();
        const body = await request.json();

        const { draft, visibility } = body as {
            draft: CanonicalProfile;
            visibility: VisibilitySettings;
        };

        if (!draft || !visibility) {
            return NextResponse.json(
                { code: 'VALIDATION_ERROR', message: 'Both "draft" and "visibility" are required.' } satisfies ApiError,
                { status: 422 },
            );
        }

        // Validate canonical draft against schema
        const validation = validateCanonicalProfile(draft);

        // Ensure user has a handle matching the draft handle
        let handle = await getHandleByUserId(user.id);
        if (!handle && draft.handle) {
            try {
                handle = await claimHandle(user.id, draft.handle);
            } catch {
                return NextResponse.json(
                    { code: 'CONFLICT', message: `Handle "${draft.handle}" is already taken.` } satisfies ApiError,
                    { status: 409 },
                );
            }
        }

        // Save draft (even if validation fails — let user fix iteratively)
        const saved = await saveDraft(user.id, draft, visibility);

        return NextResponse.json({
            saved: true,
            draftUpdatedAt: saved.updated_at,
            validation,
        });
    } catch (err) {
        if ((err as ApiError).code === 'UNAUTHORIZED') {
            return NextResponse.json(err, { status: 401 });
        }
        safeLogError('POST /api/profile/draft', err);
        return NextResponse.json(
            { code: 'INTERNAL', message: 'Internal server error.' } satisfies ApiError,
            { status: 500 },
        );
    }
}
