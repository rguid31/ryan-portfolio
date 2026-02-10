/**
 * Safe Logger - Prevents PII leakage in error logs
 *
 * Use this instead of console.error to ensure no sensitive data is logged.
 */

export interface ApiError extends Error {
    code?: string;
    statusCode?: number;
}

/**
 * Safely log an error without exposing PII
 *
 * @param context - Description of what failed (e.g., "POST /api/profile/publish")
 * @param error - The error to log
 * @param metadata - Optional safe metadata (NO PII!)
 */
export function safeLogError(
    context: string,
    error: unknown,
    metadata?: Record<string, string | number | boolean>
): void {
    const err = error as ApiError;

    const safeError = {
        context,
        code: err.code || 'UNKNOWN_ERROR',
        message: err.message || 'Unknown error occurred',
        statusCode: err.statusCode,
        timestamp: new Date().toISOString(),
        ...metadata, // Only include safe metadata passed explicitly
    };

    // Log only the sanitized error - no request bodies, no PII
    console.error('[SAFE_ERROR]', JSON.stringify(safeError, null, 2));
}

/**
 * Safely log a warning without exposing PII
 */
export function safeLogWarning(
    context: string,
    message: string,
    metadata?: Record<string, string | number | boolean>
): void {
    const safeWarning = {
        context,
        message,
        timestamp: new Date().toISOString(),
        ...metadata,
    };

    console.warn('[SAFE_WARNING]', JSON.stringify(safeWarning, null, 2));
}

/**
 * Safely log info without exposing PII
 */
export function safeLogInfo(
    context: string,
    message: string,
    metadata?: Record<string, string | number | boolean>
): void {
    const safeInfo = {
        context,
        message,
        timestamp: new Date().toISOString(),
        ...metadata,
    };

    console.log('[SAFE_INFO]', JSON.stringify(safeInfo, null, 2));
}
