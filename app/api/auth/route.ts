// POST /api/auth/register — Create account + claim handle
// POST /api/auth/login    — Login + create session
// POST /api/auth/logout   — Destroy session
import { NextRequest, NextResponse } from 'next/server';
import {
    createUser,
    getUserByEmail,
    verifyPassword,
    createSession,
    deleteSession,
    SESSION_COOKIE,
    safeLogError,
    checkRateLimit,
    AUTH_RATE_LIMIT,
} from '@/lib/truth-engine';
import type { ApiError } from '@/lib/truth-engine';

// ─── Register ────────────────────────────────────────────────────
export async function POST(request: NextRequest) {
    // Rate limiting: 10 requests per minute for auth endpoints
    const rateLimitResponse = checkRateLimit(request, AUTH_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const body = await request.json();
        const { action, email, password } = body;

        if (action === 'register') {
            return handleRegister(email, password);
        } else if (action === 'login') {
            return handleLogin(email, password);
        } else if (action === 'logout') {
            return handleLogout(request);
        }

        return NextResponse.json(
            { code: 'VALIDATION_ERROR', message: 'Invalid action. Use "register", "login", or "logout".' } satisfies ApiError,
            { status: 400 },
        );
    } catch (err) {
        safeLogError('Auth', err);
        return NextResponse.json(
            { code: 'INTERNAL', message: 'Internal server error.' } satisfies ApiError,
            { status: 500 },
        );
    }
}

async function handleRegister(email: string, password: string) {
    if (process.env.ALLOW_REGISTRATION === 'false') {
        return NextResponse.json(
            { code: 'FORBIDDEN', message: 'Registration is currently disabled.' } satisfies ApiError,
            { status: 403 },
        );
    }
    if (!email || !password) {
        return NextResponse.json(
            { code: 'VALIDATION_ERROR', message: 'Email and password are required.' } satisfies ApiError,
            { status: 422 },
        );
    }
    if (password.length < 8) {
        return NextResponse.json(
            { code: 'VALIDATION_ERROR', message: 'Password must be at least 8 characters.' } satisfies ApiError,
            { status: 422 },
        );
    }

    const existing = getUserByEmail(email);
    if (existing) {
        return NextResponse.json(
            { code: 'CONFLICT', message: 'An account with this email already exists.' } satisfies ApiError,
            { status: 409 },
        );
    }

    const user = createUser(email, password);
    const sessionId = createSession(user.id);

    const response = NextResponse.json({ registered: true, userId: user.id });
    response.cookies.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
    });

    return response;
}

async function handleLogin(email: string, password: string) {
    if (!email || !password) {
        return NextResponse.json(
            { code: 'VALIDATION_ERROR', message: 'Email and password are required.' } satisfies ApiError,
            { status: 422 },
        );
    }

    const user = getUserByEmail(email);
    if (!user || !verifyPassword(user, password)) {
        return NextResponse.json(
            { code: 'UNAUTHORIZED', message: 'Invalid email or password.' } satisfies ApiError,
            { status: 401 },
        );
    }

    const sessionId = createSession(user.id);

    const response = NextResponse.json({ loggedIn: true, userId: user.id });
    response.cookies.set(SESSION_COOKIE, sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60,
        path: '/',
    });

    return response;
}

async function handleLogout(request: NextRequest) {
    const sessionId = request.cookies.get(SESSION_COOKIE)?.value;
    if (sessionId) {
        deleteSession(sessionId);
    }

    const response = NextResponse.json({ loggedOut: true });
    response.cookies.delete(SESSION_COOKIE);
    return response;
}
