// Truth Engine — Simple session-based auth helpers for API routes
import { cookies } from 'next/headers';
import { getSession, getUserById } from './storage';
import type { UserRow, ApiError } from './types';

const SESSION_COOKIE = 'te_session';

/**
 * Get the authenticated user from the request cookies.
 * Returns null if not authenticated.
 */
export async function getAuthUser(): Promise<UserRow | null> {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get(SESSION_COOKIE)?.value;
    if (!sessionId) return null;

    const session = await getSession(sessionId);
    if (!session) return null;

    const user = await getUserById(session.userId);
    return user || null;
}

/**
 * Require authentication — returns the user or throws an error response.
 */
export async function requireAuth(): Promise<UserRow> {
    const user = await getAuthUser();
    if (!user) {
        throw createAuthError();
    }
    return user;
}

/**
 * Create an unauthorized error object.
 */
function createAuthError(): ApiError {
    return {
        code: 'UNAUTHORIZED',
        message: 'Authentication required. Please log in.',
    };
}

export { SESSION_COOKIE };
