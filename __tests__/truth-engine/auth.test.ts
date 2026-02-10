// Tests: Auth module — session-based authentication
// Note: These tests mock Next.js cookies() since auth.ts uses next/headers

import { getDb, closeDb } from '../../lib/truth-engine/db';
import { createUser, createSession, deleteSession } from '../../lib/truth-engine/storage';

// Mock next/headers
jest.mock('next/headers', () => ({
    cookies: jest.fn(),
}));

import { cookies } from 'next/headers';
import { getAuthUser, requireAuth, SESSION_COOKIE } from '../../lib/truth-engine/auth';

describe('Auth Module', () => {
    let userId: number;
    let validSessionId: string;
    let expiredSessionId: string;

    beforeAll(() => {
        // Ensure database is closed before starting
        closeDb();
    });

    beforeEach(() => {
        // Reset database
        closeDb();
        const db = getDb();
        db.exec(`
            DELETE FROM sessions;
            DELETE FROM search_index;
            DELETE FROM profile_snapshots;
            DELETE FROM profile_drafts;
            DELETE FROM handles;
            DELETE FROM users;
        `);

        // Create test user and sessions
        const user = createUser('test@example.com', 'password123');
        userId = user.id;
        validSessionId = createSession(userId);

        // Create expired session manually
        expiredSessionId = 'expired-session-id';
        db.prepare(
            'INSERT INTO sessions (id, user_id, expires_at) VALUES (?, ?, ?)'
        ).run(expiredSessionId, userId, '2020-01-01T00:00:00.000Z');

        // Reset mock before each test
        jest.clearAllMocks();
    });

    afterAll(() => {
        closeDb();
    });

    describe('getAuthUser', () => {
        it('should return user when valid session cookie exists', async () => {
            // Mock cookies to return valid session
            (cookies as jest.Mock).mockResolvedValue({
                get: jest.fn((name: string) =>
                    name === SESSION_COOKIE ? { value: validSessionId } : undefined
                ),
            });

            const user = await getAuthUser();
            expect(user).toBeDefined();
            expect(user!.id).toBe(userId);
            expect(user!.email).toBe('test@example.com');
        });

        it('should return null when no session cookie exists', async () => {
            // Mock cookies to return nothing
            (cookies as jest.Mock).mockResolvedValue({
                get: jest.fn(() => undefined),
            });

            const user = await getAuthUser();
            expect(user).toBeNull();
        });

        it('should return null when session is expired', async () => {
            // Mock cookies to return expired session
            (cookies as jest.Mock).mockResolvedValue({
                get: jest.fn((name: string) =>
                    name === SESSION_COOKIE ? { value: expiredSessionId } : undefined
                ),
            });

            const user = await getAuthUser();
            expect(user).toBeNull();
        });

        it('should return null when session does not exist in database', async () => {
            // Mock cookies to return non-existent session
            (cookies as jest.Mock).mockResolvedValue({
                get: jest.fn((name: string) =>
                    name === SESSION_COOKIE ? { value: 'non-existent-session' } : undefined
                ),
            });

            const user = await getAuthUser();
            expect(user).toBeNull();
        });

        it('should return null when session points to deleted user', async () => {
            // Delete session but keep it in DB
            const db = getDb();
            db.prepare('DELETE FROM users WHERE id = ?').run(userId);

            (cookies as jest.Mock).mockResolvedValue({
                get: jest.fn((name: string) =>
                    name === SESSION_COOKIE ? { value: validSessionId } : undefined
                ),
            });

            const user = await getAuthUser();
            expect(user).toBeNull();
        });
    });

    describe('requireAuth', () => {
        it('should return user when authenticated', async () => {
            // Mock cookies to return valid session
            (cookies as jest.Mock).mockResolvedValue({
                get: jest.fn((name: string) =>
                    name === SESSION_COOKIE ? { value: validSessionId } : undefined
                ),
            });

            const user = await requireAuth();
            expect(user).toBeDefined();
            expect(user.id).toBe(userId);
            expect(user.email).toBe('test@example.com');
        });

        it('should throw UNAUTHORIZED error when not authenticated', async () => {
            // Mock cookies to return nothing
            (cookies as jest.Mock).mockResolvedValue({
                get: jest.fn(() => undefined),
            });

            await expect(requireAuth()).rejects.toMatchObject({
                code: 'UNAUTHORIZED',
                message: expect.stringContaining('Authentication required'),
            });
        });

        it('should throw UNAUTHORIZED error when session is expired', async () => {
            // Mock cookies to return expired session
            (cookies as jest.Mock).mockResolvedValue({
                get: jest.fn((name: string) =>
                    name === SESSION_COOKIE ? { value: expiredSessionId } : undefined
                ),
            });

            await expect(requireAuth()).rejects.toMatchObject({
                code: 'UNAUTHORIZED',
                message: expect.stringContaining('Authentication required'),
            });
        });
    });

    describe('SESSION_COOKIE constant', () => {
        it('should export SESSION_COOKIE constant', () => {
            expect(SESSION_COOKIE).toBe('te_session');
        });
    });
});
