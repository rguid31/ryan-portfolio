// lib/env.ts
// Type-safe environment variable access
// Validates required env vars at runtime to prevent silent failures

const requiredServerEnvVars = [
    'DATABASE_URL',
    'SESSION_SECRET',
    // 'GOOGLE_API_KEY', // Optional depending on feature usage
] as const;

const requiredClientEnvVars = [
    // Add public env vars here (NEXT_PUBLIC_...)
] as const;

export function getEnv(key: string): string {
    const value = process.env[key];
    if (!value) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export function getEnvSafe(key: string): string | undefined {
    return process.env[key];
}

// Validate on import (server-side only)
if (typeof window === 'undefined') {
    const missing = requiredServerEnvVars.filter((key) => !process.env[key]);
    if (missing.length > 0) {
        // We only log a warning here to avoid breaking build if .env is missing in CI/CD pipeline
        // fetching standard env vars during build often fails in some environments so warning is safer than throwing top-level
        console.warn(`[WARN] Missing environment variables: ${missing.join(', ')}`);
    }
}

export const env = {
    DATABASE_URL: process.env.DATABASE_URL || process.env.LIBSQL_URL || 'file:./data/truth-engine.db',
    LIBSQL_AUTH_TOKEN: process.env.LIBSQL_AUTH_TOKEN,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    SESSION_SECRET: process.env.SESSION_SECRET || 'default-dev-secret-do-not-use-in-prod',
    NODE_ENV: process.env.NODE_ENV || 'development',
} as const;
