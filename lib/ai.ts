import { GoogleGenerativeAI } from '@google/generative-ai';
import * as cheerio from 'cheerio';

const API_KEY = process.env.GOOGLE_API_KEY;

export async function parseTextWithAI(text: string): Promise<Record<string, any>> {
    if (!API_KEY) {
        throw new Error('Missing GOOGLE_API_KEY environment variable. Please add it to your .env.local file.');
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `
    You are a helpful assistant that extracts structured professional profile data from unstructured text.
    
    The user will provide text from a resume, LinkedIn profile, or personal website.
    Your task is to extract information and return a JSON object matching the following structure (CanonicalProfile draft):
    
    {
        "identity": {
            "name": "Full Name",
            "headline": "Current Role or Professional Headline",
            "summary": "Brief professional summary (max 2000 chars)",
            "location": { "city": "City", "region": "State/Region", "country": "Country Code (2 chars)" }
        },
        "links": {
            "website": "Personal Website URL",
            "sameAs": ["LinkedIn URL", "GitHub URL", "Twitter URL", etc.]
        },
        "contact": {
            "phone": "Phone Number",
            "emails": [{ "email": "extracted@email.com", "type": "public" }]
        },
        "experience": [
            {
                "organization": "Company Name",
                "title": "Job Title",
                "location": "City, State",
                "startDate": "YYYY-MM-DD",
                "endDate": "YYYY-MM-DD (or leave empty if current)",
                "isCurrent": boolean,
                "highlights": ["Key achievement 1", "Key achievement 2"]
            }
        ],
        "education": [
            {
                "institution": "University Name",
                "degree": "Degree (e.g., BS, MS)",
                "program": "Field of Study",
                "startDate": "YYYY-MM-DD",
                "endDate": "YYYY-MM-DD",
                "status": "completed"
            }
        ],
        "skills": [
            {
                "category": "Main Category (e.g., Languages, Tools)",
                "items": ["Skill 1", "Skill 2"]
            }
        ],
        "projects": [
            {
                "name": "Project Name",
                "description": "Short description",
                "tech": ["Tech 1", "Tech 2"],
                "url": "Project URL",
                "repoUrl": "Repository URL"
            }
        ]
    }

    Instructions:
    1. Extract only what is explicitly present or strongly implied in the text.
    2. Do NOT invent information.
    3. Return valid JSON only. Do not include markdown code blocks.
    4. For dates, use YYYY-MM-DD format. If only year is known, use YYYY-01-01.
    5. Attempt to group skills into logical categories if not already categorized.

    Text to process:
    """
    ${text}
    """
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const textResponse = response.text();

    // Clean up markdown blocks if present
    const jsonString = textResponse.replace(/^```json\n|\n```$/g, '').trim();

    try {
        const rawData = JSON.parse(jsonString);
        return cleanProfileData(rawData);
    } catch (e) {
        console.error('Failed to parse AI response:', textResponse);
        throw new Error('Failed to parse AI response as JSON.');
    }
}

function cleanProfileData(data: any): any {
    if (Array.isArray(data)) {
        return data.map(cleanProfileData).filter(item => item !== null && item !== undefined && item !== '');
    }
    if (typeof data === 'object' && data !== null) {
        const cleaned: any = {};
        for (const [key, value] of Object.entries(data)) {
            // Recursively clean
            const cleanedValue = cleanProfileData(value);

            // Filter out empty strings, nulls, undefined
            if (cleanedValue !== null && cleanedValue !== undefined && cleanedValue !== '') {
                // Special handling for known schema constraints
                if ((key === 'website' || key === 'url' || key === 'repoUrl' || key === 'image') && typeof cleanedValue === 'string') {
                    // Ensure URI format if possible, or drop if invalid/empty
                    if (!cleanedValue.startsWith('http')) continue;
                }
                if ((key === 'startDate' || key === 'endDate') && typeof cleanedValue === 'string') {
                    // Ensure date format YYYY-MM-DD
                    if (!/^\d{4}-\d{2}-\d{2}$/.test(cleanedValue)) continue;
                }
                if (key === 'status' && !['completed', 'in-progress', 'incomplete', 'withdrawn'].includes(cleanedValue as string)) {
                    continue; // Drop invalid status
                }

                cleaned[key] = cleanedValue;
            }
        }
        return Object.keys(cleaned).length > 0 ? cleaned : undefined;
    }
    return data;
}

export async function fetchTextFromUrl(url: string): Promise<string> {
    try {
        const res = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)'
            }
        });
        if (!res.ok) throw new Error(`Failed to fetch URL: ${res.statusText}`);

        const html = await res.text();
        const $ = cheerio.load(html);

        // Remove scripts, styles, and other non-content elements
        $('script, style, nav, footer, header, aside, .ad, .advertisement').remove();

        // Extract text from body
        const text = $('body').text();

        // Clean up whitespace
        return text.replace(/\s+/g, ' ').trim().slice(0, 20000); // Limit context window
    } catch (e) {
        throw new Error(`Could not fetch content from URL: ${e instanceof Error ? e.message : 'Unknown error'}`);
    }
}
