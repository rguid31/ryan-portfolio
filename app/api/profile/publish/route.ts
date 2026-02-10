// POST /api/profile/publish — Validate + publish public snapshot
import { NextRequest, NextResponse } from 'next/server';
import {
    requireAuth,
    getDraft,
    getHandleByUserId,
    validateCanonicalProfile,
    validatePublicProfile,
    derivePublicProfile,
    generateJsonLd,
    generateVersionId,
    computeContentHash,
    now,
    saveSnapshot,
    updateSearchIndex,
    safeLogError,
    checkRateLimit,
    DEFAULT_RATE_LIMIT,
} from '@/lib/truth-engine';
import type { ApiError, CanonicalProfile, VisibilitySettings, PublishResult } from '@/lib/truth-engine';

export async function POST(request: NextRequest) {
    // Rate limiting: 100 requests per minute
    const rateLimitResponse = checkRateLimit(request, DEFAULT_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const user = await requireAuth();
        const body = await request.json();

        if (!body?.confirm) {
            return NextResponse.json(
                { code: 'VALIDATION_ERROR', message: 'Publish requires { "confirm": true }.' } satisfies ApiError,
                { status: 422 },
            );
        }

        // Load draft
        const draftRow = await getDraft(user.id);
        if (!draftRow) {
            return NextResponse.json(
                { code: 'CONFLICT', message: 'No draft exists. Save a draft first.' } satisfies ApiError,
                { status: 409 },
            );
        }

        const handle = await getHandleByUserId(user.id);
        if (!handle) {
            return NextResponse.json(
                { code: 'CONFLICT', message: 'No handle claimed. Save a draft with a handle first.' } satisfies ApiError,
                { status: 409 },
            );
        }

        const canonical: CanonicalProfile = JSON.parse(draftRow.canonical_json);
        const visibility: VisibilitySettings = JSON.parse(draftRow.visibility_json);

        // Step 1: Validate canonical
        const canonicalValidation = validateCanonicalProfile(canonical);
        if (!canonicalValidation.isValid) {
            return NextResponse.json(
                {
                    code: 'VALIDATION_ERROR',
                    message: 'Canonical draft has validation errors. Fix them before publishing.',
                    fields: canonicalValidation.fields,
                } satisfies ApiError,
                { status: 422 },
            );
        }

        // Step 2: Derive public profile
        const versionId = generateVersionId();
        const publishedAt = now();
        const publicProfile = derivePublicProfile(canonical, visibility, versionId, '', publishedAt);

        // Step 3: Compute content hash
        const contentHash = computeContentHash(publicProfile);
        publicProfile.contentHash = contentHash;

        // Step 4: Validate public profile
        const publicValidation = validatePublicProfile(publicProfile);
        if (!publicValidation.isValid) {
            return NextResponse.json(
                {
                    code: 'VALIDATION_ERROR',
                    message: 'Derived public profile failed validation. This is likely a bug.',
                    fields: publicValidation.fields,
                } satisfies ApiError,
                { status: 422 },
            );
        }

        // Step 5: Generate JSON-LD
        const jsonLd = generateJsonLd(publicProfile);

        // Step 6: Save snapshot
        await saveSnapshot(handle.handle, versionId, publicProfile, jsonLd, contentHash);

        // Step 7: Update search index
        await updateSearchIndex(handle.handle, publicProfile);

        const result: PublishResult = {
            published: true,
            handle: handle.handle,
            versionId,
            publishedAt,
            contentHash,
            urls: {
                html: `/u/${handle.handle}`,
                json: `/u/${handle.handle}.json`,
                jsonld: `/u/${handle.handle}.jsonld`,
            },
        };

        return NextResponse.json(result);
    } catch (err) {
        if ((err as ApiError).code === 'UNAUTHORIZED') {
            return NextResponse.json(err, { status: 401 });
        }
        safeLogError('POST /api/profile/publish', err);
        return NextResponse.json(
            { code: 'INTERNAL', message: 'Internal server error.' } satisfies ApiError,
            { status: 500 },
        );
    }
}
