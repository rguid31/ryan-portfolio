// Truth Engine — barrel export
export { validateCanonicalProfile, validatePublicProfile } from './schema-validator';
export { derivePublicProfile } from './privacy-engine';
export { generateJsonLd } from './jsonld-generator';
export { generateVersionId, computeContentHash, now, buildSnapshotHeader } from './snapshot';
export { getDb, closeDb } from './db';
export { queryProfiles } from './query';
export { getAuthUser, requireAuth, SESSION_COOKIE } from './auth';
export { safeLogError, safeLogWarning, safeLogInfo } from './safe-logger';
export {
    checkRateLimit,
    withRateLimit,
    getRateLimitStatus,
    DEFAULT_RATE_LIMIT,
    AUTH_RATE_LIMIT,
    PUBLIC_READ_RATE_LIMIT,
} from './rate-limiter';
export * from './storage';
export * from './types';
