import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/truth-engine/auth';
import { checkRateLimit, DEFAULT_RATE_LIMIT } from '@/lib/truth-engine';
import { parseTextWithAI, fetchTextFromUrl } from '@/lib/ai';

export async function POST(request: NextRequest) {
    // Rate limiting: 100 requests per minute
    const rateLimitResponse = checkRateLimit(request, DEFAULT_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        await requireAuth();
        const { text, url } = await request.json();

        if (!text && !url) {
            return NextResponse.json({ message: 'Missing "text" or "url".' }, { status: 400 });
        }

        let contentToProcess = text;
        if (url) {
            // Attempt to fetch URL
            try {
                contentToProcess = await fetchTextFromUrl(url);
            } catch (e) {
                return NextResponse.json({
                    message: `Failed to fetch URL. Try pasting the text manually. Error: ${e instanceof Error ? e.message : 'Unknown'}`
                }, { status: 422 });
            }
        }

        // Send to AI
        const extractedData = await parseTextWithAI(contentToProcess);

        return NextResponse.json({ parsed: extractedData });
    } catch (e) {
        if (e instanceof Error && e.message.includes('GOOGLE_API_KEY')) {
            return NextResponse.json({ message: 'Autofill requires "GOOGLE_API_KEY" environment variable.' }, { status: 500 });
        }
        return NextResponse.json({ message: e instanceof Error ? e.message : 'Failed to process request.' }, { status: 500 });
    }
}
