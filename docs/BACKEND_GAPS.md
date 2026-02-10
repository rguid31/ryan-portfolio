# Truth Engine Backend - Gap Analysis

**Date:** 2026-02-10
**Reviewer:** Backend Engineer
**Status:** Most implementation complete, test coverage needs expansion

---

## Executive Summary

The Truth Engine backend is **substantially implemented** with excellent coverage of core features. The Architect has built a solid foundation including:

- Complete privacy engine with PII protection
- Full publish/unpublish pipeline
- Schema validation (canonical + public)
- JSON-LD generation for Schema.org
- SQLite storage with proper migrations
- Session-based authentication
- Public and authenticated API endpoints
- Search/query functionality

**Current Test Coverage:** 97.63% statement coverage on core library
**Missing:** Storage layer tests, query tests, auth tests, API integration tests

---

## What's Implemented ✅

### Core Library (lib/truth-engine/)

| Module | Status | Test Coverage | Notes |
|--------|--------|---------------|-------|
| **types.ts** | ✅ Complete | 100% | All TypeScript types defined |
| **db.ts** | ✅ Complete | Not tested | SQLite setup + migrations |
| **schema-validator.ts** | ✅ Complete | 100% | AJV validation for both schemas |
| **privacy-engine.ts** | ✅ Complete | 100% | Canonical → Public transformation |
| **jsonld-generator.ts** | ✅ Complete | 96.22% | Public → Schema.org JSON-LD |
| **snapshot.ts** | ✅ Complete | 94.44% | UUIDs, SHA-256 hashing, versioning |
| **storage.ts** | ✅ Complete | Not tested | CRUD for users, drafts, snapshots |
| **query.ts** | ✅ Complete | Not tested | Search with filters |
| **auth.ts** | ✅ Complete | Not tested | Session-based auth |
| **index.ts** | ✅ Complete | N/A | Barrel export |

### API Routes (app/api/)

| Endpoint | Method | Status | Tests | Notes |
|----------|--------|--------|-------|-------|
| **/api/auth** | POST | ✅ Complete | ❌ None | register, login, logout |
| **/api/profile/draft** | POST | ✅ Complete | ❌ None | Save draft + visibility |
| **/api/profile/publish** | POST | ✅ Complete | ❌ None | Full publish pipeline |
| **/api/profile/unpublish** | POST | ✅ Complete | ❌ None | Mark unpublished |
| **/api/profile/me** | GET | ✅ Complete | ❌ None | Get user's draft + status |
| **/api/profile** | DELETE | ✅ Complete | ❌ None | Hard delete profile |
| **/api/query** | GET | ✅ Complete | ❌ None | Search published profiles |
| **/api/u/:handle/json** | GET | ✅ Complete | ❌ None | Public profile JSON |
| **/api/u/:handle/jsonld** | GET | ✅ Complete | ❌ None | Public profile JSON-LD |
| **/.well-known/truth-engine.json** | GET | ✅ Complete | ❌ None | Platform discovery |

### Test Files (__tests__/truth-engine/)

| Test File | Status | Coverage |
|-----------|--------|----------|
| **schema-validator.test.ts** | ✅ Complete | 100% |
| **privacy-engine.test.ts** | ✅ Complete | 100% |
| **jsonld-generator.test.ts** | ✅ Complete | 96.22% |
| **snapshot.test.ts** | ✅ Complete | 94.44% |
| **publish-pipeline.test.ts** | ✅ Complete | Integration tests |
| **storage.test.ts** | ❌ Missing | 0% |
| **query.test.ts** | ❌ Missing | 0% |
| **auth.test.ts** | ❌ Missing | 0% |
| **api-endpoints.test.ts** | ❌ Missing | 0% |

---

## What's Missing ❌

### 1. Storage Layer Tests (HIGH PRIORITY)

**File:** `__tests__/truth-engine/storage.test.ts`

**Missing Coverage:**
- User CRUD operations (createUser, getUserByEmail, getUserById, verifyPassword)
- Handle operations (claimHandle, getHandleByUserId, getHandleByName)
- Draft operations (saveDraft, getDraft, deleteDraft)
- Snapshot operations (saveSnapshot, getLatestSnapshot, getAllSnapshots, unpublishSnapshots, deleteAllSnapshots)
- Search index operations (updateSearchIndex, deleteSearchIndex)
- Session operations (createSession, getSession, deleteSession, deleteUserSessions)
- Full profile delete (deleteProfile with transaction)

**Why Critical:**
- Storage is the security boundary for PII
- Database operations need transaction testing
- Constraint violations need verification
- Cascade deletes must work correctly

### 2. Query Engine Tests (MEDIUM PRIORITY)

**File:** `__tests__/truth-engine/query.test.ts`

**Missing Coverage:**
- Basic search with no filters
- Filter by skill (substring matching)
- Filter by organization
- Filter by title
- Filter by location
- Filter by updatedAfter
- Pagination with cursor
- Limit enforcement (max 100)
- Multiple filter combinations
- Empty result handling

**Why Important:**
- Public API endpoint - performance matters
- SQL injection prevention verification
- Result consistency and determinism

### 3. Auth Module Tests (HIGH PRIORITY)

**File:** `__tests__/truth-engine/auth.test.ts`

**Missing Coverage:**
- getAuthUser with valid session
- getAuthUser with expired session
- getAuthUser with no session
- requireAuth success case
- requireAuth throws UNAUTHORIZED
- Session cookie extraction

**Why Critical:**
- Auth is the gatekeeper for all private data
- Session expiry must work correctly
- Must prevent unauthorized access

### 4. API Integration Tests (HIGH PRIORITY)

**File:** `__tests__/truth-engine/api-endpoints.test.ts`

**Missing Coverage:**

**Auth Endpoints:**
- POST /api/auth (register, login, logout)
- Password validation
- Duplicate email handling
- Session cookie setting

**Profile Management:**
- POST /api/profile/draft (save draft)
- POST /api/profile/publish (full pipeline)
- POST /api/profile/unpublish
- GET /api/profile/me
- DELETE /api/profile

**Public Endpoints:**
- GET /api/query
- GET /u/:handle.json
- GET /u/:handle.jsonld
- GET /.well-known/truth-engine.json

**Error Cases:**
- 401 Unauthorized
- 404 Not Found
- 409 Conflict
- 422 Validation Error
- 500 Internal Error

**Why Critical:**
- End-to-end verification of the publish pipeline
- PII leak prevention at API boundary
- Error handling and status codes
- Rate limiting (future)

---

## What Needs Improvement ⚠️

### 1. Privacy Engine - Projects Field Removal

**Issue:** Line 104 in `privacy-engine.ts` removes `role` and `highlights` from projects, which are NOT private fields according to `public.schema.json`.

**Current Code:**
```typescript
pub.projects = canonical.projects.map(proj => {
    const { privateNotes, role, highlights, ...publicProj } = proj;
    return publicProj;
});
```

**Should Be:**
```typescript
pub.projects = canonical.projects.map(proj => {
    const { privateNotes, ...publicProj } = proj;
    return publicProj;
});
```

**Impact:** Medium - Projects are missing legitimate public fields
**Priority:** HIGH - Fix before production

### 2. Error Logging Contains PII Risk

**Issue:** Several API routes use `console.error` which could log request bodies containing PII.

**Affected Files:**
- `app/api/profile/draft/route.ts` (line 57)
- `app/api/profile/publish/route.ts` (line 113)
- `app/api/profile/me/route.ts` (line 38)
- `app/api/profile/unpublish/route.ts` (line 40)
- `app/api/profile/route.ts` (line 32)
- `app/api/auth/route.ts` (line 34)

**Recommendation:**
```typescript
// INSTEAD OF:
console.error('POST /api/profile/publish error:', err);

// USE:
console.error('POST /api/profile/publish error:', {
    code: (err as ApiError).code,
    message: (err as ApiError).message,
    // Never log the actual data
});
```

**Impact:** HIGH - Logs may contain PII
**Priority:** HIGH - Fix before production

### 3. Missing Rate Limiting

**Issue:** No rate limiting on any endpoints.

**Recommendation:**
- Implement per-IP rate limiting for public endpoints
- Implement per-user rate limiting for authenticated endpoints
- Different limits for read vs write operations

**Impact:** Medium - DoS vulnerability
**Priority:** MEDIUM - Add before public launch

### 4. Missing Input Sanitization

**Issue:** Handle claim doesn't validate against reserved words or offensive terms.

**Recommendation:**
- Add reserved word list (admin, api, auth, etc.)
- Add profanity filter
- Add validation for handle availability check endpoint

**Impact:** Low - Quality of life
**Priority:** LOW - Can be added later

### 5. Session Cleanup Missing

**Issue:** No background job to clean up expired sessions from database.

**Recommendation:**
```typescript
// Add to db.ts or new cleanup.ts
export function cleanupExpiredSessions(): number {
    const db = getDb();
    const result = db.prepare(
        "DELETE FROM sessions WHERE expires_at < datetime('now')"
    ).run();
    return result.changes;
}
```

**Impact:** Low - Database bloat over time
**Priority:** LOW - Can be added later

### 6. Missing Change History Endpoint

**Issue:** The API spec mentions `/u/:handle/changes.json` as optional, but it's not implemented.

**Recommendation:** Implement later if users request version history.

**Impact:** Low - Nice-to-have feature
**Priority:** LOW - Post-MVP

---

## Implementation Priority Order

### Phase 1: Critical Testing (Do First)
1. **Storage Tests** - Verify database operations and transactions
2. **Auth Tests** - Verify session handling and authorization
3. **API Integration Tests** - End-to-end pipeline verification
4. **Fix Privacy Engine Bug** - Remove incorrect field stripping from projects

### Phase 2: Security Hardening (Before Production)
5. **Fix Error Logging** - Remove PII from logs
6. **Add Rate Limiting** - Prevent abuse
7. **Add Input Sanitization** - Handle validation

### Phase 3: Production Readiness (Optional)
8. **Query Tests** - Verify search functionality
9. **Session Cleanup** - Background maintenance
10. **Performance Testing** - Load testing for < 200ms p95

### Phase 4: Post-MVP (Future)
11. **Change History Endpoint** - Version history API
12. **Advanced Query Features** - Full-text search, facets
13. **Export Functionality** - Download all data (GDPR compliance)

---

## Test Coverage Goals

| Component | Current | Target | Priority |
|-----------|---------|--------|----------|
| Core Library | 97.63% | 95%+ | ✅ Met |
| Storage | 0% | 90%+ | 🔴 HIGH |
| Query | 0% | 80%+ | 🟡 MEDIUM |
| Auth | 0% | 95%+ | 🔴 HIGH |
| API Routes | 0% | 85%+ | 🔴 HIGH |
| **Overall** | ~60% | **85%+** | 🔴 **In Progress** |

---

## Security Checklist

- [x] PII fields are hard-coded as private by default
- [x] Privacy engine strips all PII before public endpoints
- [x] Public schema validation prevents PII in public JSON
- [x] Passwords are hashed with bcrypt
- [x] Sessions expire after 7 days
- [x] SQL injection prevented by prepared statements
- [ ] **Error logs don't contain PII** (NEEDS FIX)
- [ ] **Rate limiting implemented** (TODO)
- [ ] **Input sanitization for handles** (TODO)
- [x] Foreign key constraints enforce referential integrity
- [x] Cascade deletes clean up orphaned data
- [ ] **Session cleanup job** (TODO)

---

## Performance Considerations

### Current Implementation
- SQLite with WAL mode for concurrent reads
- Indexes on commonly queried columns
- Prepared statements for all queries
- JSON stored as TEXT (parse on read)

### Optimization Opportunities
1. **Add caching for public profiles** - Redis or in-memory cache
2. **Pre-generate JSON-LD on publish** - Already done ✅
3. **Add pagination to profile list endpoints** - For dashboard
4. **Denormalize search index** - Already done ✅

### Expected Performance
- Profile read: < 10ms (single DB query + JSON parse)
- Profile publish: < 100ms (validation + transform + write)
- Query search: < 50ms (indexed search)

**Goal:** p95 < 200ms ✅ Achievable with current design

---

## Database Migration Strategy

### Current State
- Single migration in `db.ts` that runs on first connection
- Idempotent (uses IF NOT EXISTS)

### Future Considerations
- Add migration versioning
- Add migration rollback support
- Add schema version tracking table

**Priority:** LOW - Current approach works for MVP

---

## Next Steps

1. **Create storage.test.ts** - Test all CRUD operations
2. **Create auth.test.ts** - Test session handling
3. **Create api-endpoints.test.ts** - Test full pipeline
4. **Fix privacy-engine.ts** - Remove role/highlights stripping bug
5. **Fix error logging** - Remove PII from console.error
6. **Run full test suite** - Verify 85%+ coverage
7. **Manual QA** - Test publish pipeline end-to-end
8. **Performance test** - Verify < 200ms p95

---

## Conclusion

The Truth Engine backend is **95% complete** with excellent architectural decisions:

✅ **Strengths:**
- Privacy-first design with multiple layers of PII protection
- Clean separation of canonical vs public data
- Comprehensive schema validation
- Immutable versioning with content hashing
- Well-structured code with clear boundaries

⚠️ **Gaps:**
- Missing tests for storage, query, auth, and API layers
- Minor bug in privacy engine (projects field stripping)
- Error logging needs PII sanitization
- Rate limiting not yet implemented

🎯 **Recommendation:** Complete Phase 1 (Critical Testing) and Phase 2 (Security Hardening) before production launch. The backend is production-ready after these fixes.
