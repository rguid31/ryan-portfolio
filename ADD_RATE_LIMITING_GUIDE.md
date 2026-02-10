# Adding Rate Limiting to API Routes

## Quick Reference

Add these two lines to every API route:

```typescript
// 1. Import at top
import { checkRateLimit, AUTH_RATE_LIMIT } from '@/lib/truth-engine';

// 2. Check at start of handler
const rateLimitResponse = checkRateLimit(request, AUTH_RATE_LIMIT);
if (rateLimitResponse) return rateLimitResponse;
```

---

## Which Rate Limit to Use?

| Endpoint Type | Rate Limit | Max Requests |
|---------------|------------|--------------|
| **Auth endpoints** (login, register) | `AUTH_RATE_LIMIT` | 10/min |
| **Write endpoints** (draft, publish) | `DEFAULT_RATE_LIMIT` | 100/min |
| **Read endpoints** (query, profile) | `PUBLIC_READ_RATE_LIMIT` | 300/min |

---

## Example 1: Auth Endpoint

**File:** `app/api/auth/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, AUTH_RATE_LIMIT } from '@/lib/truth-engine';

export async function POST(request: NextRequest) {
    // Add rate limiting FIRST
    const rateLimitResponse = checkRateLimit(request, AUTH_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    // ... rest of auth logic
}
```

---

## Example 2: Publish Endpoint

**File:** `app/api/profile/publish/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import {
    requireAuth,
    checkRateLimit,
    DEFAULT_RATE_LIMIT,
    // ... other imports
} from '@/lib/truth-engine';

export async function POST(request: NextRequest) {
    // Rate limit BEFORE auth check (prevent auth spam)
    const rateLimitResponse = checkRateLimit(request, DEFAULT_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    try {
        const user = await requireAuth();
        // ... rest of publish logic
    } catch (err) {
        // ... error handling
    }
}
```

---

## Example 3: Public Read Endpoint

**File:** `app/api/query/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { queryProfiles, checkRateLimit, PUBLIC_READ_RATE_LIMIT } from '@/lib/truth-engine';

export async function GET(request: NextRequest) {
    // Use generous rate limit for public reads
    const rateLimitResponse = checkRateLimit(request, PUBLIC_READ_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    const { searchParams } = request.nextUrl;
    // ... rest of query logic
}
```

---

## Files to Update

### High Priority (Auth & Write)
1. ✅ `app/api/auth/route.ts` - Use `AUTH_RATE_LIMIT`
2. ✅ `app/api/profile/draft/route.ts` - Use `DEFAULT_RATE_LIMIT`
3. ✅ `app/api/profile/publish/route.ts` - Use `DEFAULT_RATE_LIMIT`
4. ✅ `app/api/profile/unpublish/route.ts` - Use `DEFAULT_RATE_LIMIT`
5. ✅ `app/api/profile/route.ts` (DELETE) - Use `DEFAULT_RATE_LIMIT`

### Medium Priority (Read)
6. ✅ `app/api/profile/me/route.ts` - Use `DEFAULT_RATE_LIMIT`
7. ✅ `app/api/query/route.ts` - Use `PUBLIC_READ_RATE_LIMIT`
8. ✅ `app/u/[handle]/json/route.ts` - Use `PUBLIC_READ_RATE_LIMIT`
9. ✅ `app/u/[handle]/jsonld/route.ts` - Use `PUBLIC_READ_RATE_LIMIT`

### Low Priority (Discovery)
10. ✅ `app/.well-known/truth-engine.json/route.ts` - Use `PUBLIC_READ_RATE_LIMIT`

---

## Testing Rate Limits

### Test Script

```bash
# Test auth rate limit (should block after 10 requests)
for i in {1..15}; do
  curl -X POST http://localhost:3000/api/auth \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"test123"}' \
    -w "\nStatus: %{http_code}\n" \
    -s | head -1
  sleep 0.1
done
```

**Expected:** First 10 succeed, requests 11-15 get `429 Too Many Requests`

### Manual Testing

1. Open browser dev tools
2. Make repeated requests to an endpoint
3. After limit exceeded, check response:
   - Status: `429`
   - Body: `{"code":"RATE_LIMIT_EXCEEDED","message":"Too many requests..."}`
   - Headers:
     - `Retry-After: 47` (seconds until reset)
     - `X-RateLimit-Limit: 100`
     - `X-RateLimit-Remaining: 0`

---

## Monitoring

### Get Rate Limit Status (Dev/Debug)

```typescript
import { getRateLimitStatus } from '@/lib/truth-engine';

// In any API route
const status = getRateLimitStatus(request);
console.log('Rate limit status:', status);
// {
//   ip: "192.168.1.100",
//   count: 5,
//   resetAt: 1707523200000,
//   remaining: 95
// }
```

---

## Production Considerations

### Current Implementation (MVP)
- ✅ In-memory storage (resets on server restart)
- ✅ Per-IP limiting
- ✅ Different limits for different endpoint types
- ✅ Standard 429 responses with Retry-After

### Future Improvements (Post-MVP)
- [ ] Redis-based storage (persistent, multi-server)
- [ ] Per-user rate limiting (authenticated endpoints)
- [ ] Dynamic rate limits based on user tier
- [ ] Monitoring/alerting for abuse patterns
- [ ] Whitelist for trusted IPs

---

## Why This Works for MVP

1. **Simple** - No external dependencies (Redis)
2. **Effective** - Prevents basic DoS attacks
3. **Fast** - O(1) lookups in Map
4. **Standard** - Uses HTTP 429 + Retry-After
5. **Flexible** - Easy to adjust limits per endpoint

For production at scale, migrate to Redis:
```bash
npm install ioredis
# Update rate-limiter.ts to use Redis instead of Map
```

---

## Commit Checklist

- [ ] Added rate limiting to all 10 endpoints
- [ ] Tested each endpoint exceeds limit properly
- [ ] Verified 429 responses have correct headers
- [ ] Documented rate limits in API.md
- [ ] Commit: `git commit -m "feat: add rate limiting to prevent DoS"`

---

**Rate limiting protects your API from abuse while keeping it fast for legitimate users!** ⚡🛡️
