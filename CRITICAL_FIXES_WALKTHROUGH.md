# 🔧 Critical Fixes Walkthrough

**Time to Complete:** ~2-3 hours
**Difficulty:** Easy
**Impact:** Makes system production-ready

---

## Overview

We need to fix 2 critical security issues before launch:

1. **PII Exposure in Error Logs** - Error logs might contain sensitive data
2. **Missing Rate Limiting** - No DoS protection

---

## ✅ What's Already Done

I've created all the infrastructure you need:

### Files Created:
- ✅ `lib/truth-engine/safe-logger.ts` - Sanitizes error logs
- ✅ `lib/truth-engine/rate-limiter.ts` - Rate limiting middleware
- ✅ `fix-error-logging.sh` - Automated fix script
- ✅ `ADD_RATE_LIMITING_GUIDE.md` - Step-by-step guide

### Already Updated:
- ✅ `lib/truth-engine/index.ts` - Exports new utilities

---

## 🚀 Step-by-Step Fix Process

### PHASE 1: Fix Error Logging (30-45 minutes)

#### Option A: Automated Fix (Recommended)

```bash
cd /Users/ryanguidry/ryan-portfolio

# Run the fix script
./fix-error-logging.sh

# Review changes
git diff

# Clean up backup files
rm app/api/**/*.bak

# Test one endpoint
npm run dev
# Visit http://localhost:3000/api/profile/me
# Check logs - should see [SAFE_ERROR] format
```

#### Option B: Manual Fix (if script fails)

Edit each file and make these 2 changes:

**1. Add import:**
```typescript
import {
    requireAuth,
    safeLogError,  // ← ADD THIS LINE
    // ... other imports
} from '@/lib/truth-engine';
```

**2. Replace console.error:**
```typescript
// BEFORE
console.error('POST /api/profile/publish error:', err);

// AFTER
safeLogError('POST /api/profile/publish', err);
```

**Files to update:**
- `app/api/profile/draft/route.ts`
- `app/api/profile/publish/route.ts`
- `app/api/profile/me/route.ts`
- `app/api/profile/unpublish/route.ts`
- `app/api/profile/route.ts`
- `app/api/auth/route.ts`

#### Verify Fix Works

```bash
# Trigger an error and check logs
curl -X POST http://localhost:3000/api/profile/publish \
  -H "Content-Type: application/json" \
  -d '{"invalid": true}'

# Check terminal - should see:
# [SAFE_ERROR] {
#   "context": "POST /api/profile/publish",
#   "code": "UNAUTHORIZED",
#   "message": "...",
#   "timestamp": "2026-02-10T..."
# }

# Should NOT see full request body or PII!
```

---

### PHASE 2: Add Rate Limiting (45-60 minutes)

#### Step 1: Update Auth Endpoint

**File:** `app/api/auth/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';
import {
    checkRateLimit,
    AUTH_RATE_LIMIT,  // ← ADD THIS
    safeLogError,
    // ... other imports
} from '@/lib/truth-engine';

export async function POST(request: NextRequest) {
    // ADD THIS CHECK FIRST
    const rateLimitResponse = checkRateLimit(request, AUTH_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    // ... rest of your code
}
```

#### Step 2: Update Write Endpoints

Add to these files:
- `app/api/profile/draft/route.ts`
- `app/api/profile/publish/route.ts`
- `app/api/profile/unpublish/route.ts`
- `app/api/profile/route.ts` (DELETE)

```typescript
import {
    checkRateLimit,
    DEFAULT_RATE_LIMIT,  // ← ADD THIS
    // ... other imports
} from '@/lib/truth-engine';

export async function POST(request: NextRequest) {
    // ADD THIS CHECK FIRST
    const rateLimitResponse = checkRateLimit(request, DEFAULT_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    // ... rest of your code
}
```

#### Step 3: Update Read Endpoints

Add to these files:
- `app/api/profile/me/route.ts` (GET)
- `app/api/query/route.ts`
- `app/u/[handle]/json/route.ts`
- `app/u/[handle]/jsonld/route.ts`
- `app/.well-known/truth-engine.json/route.ts`

```typescript
import {
    checkRateLimit,
    PUBLIC_READ_RATE_LIMIT,  // ← ADD THIS
    // ... other imports
} from '@/lib/truth-engine';

export async function GET(request: NextRequest) {
    // ADD THIS CHECK FIRST
    const rateLimitResponse = checkRateLimit(request, PUBLIC_READ_RATE_LIMIT);
    if (rateLimitResponse) return rateLimitResponse;

    // ... rest of your code
}
```

#### Verify Rate Limiting Works

```bash
# Test auth endpoint (limit: 10/min)
for i in {1..15}; do
  echo "Request $i:"
  curl -X POST http://localhost:3000/api/auth \
    -H "Content-Type: application/json" \
    -d '{"email":"test@test.com","password":"test"}' \
    -w "\nHTTP Status: %{http_code}\n\n"
  sleep 0.5
done

# Expected output:
# Requests 1-10: HTTP Status: 200 or 422 (normal errors)
# Requests 11-15: HTTP Status: 429 (rate limited!)
```

**Success looks like:**
```json
{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many authentication attempts. Please try again later."
}
```

---

## 🧪 Testing Checklist

### Error Logging Tests

- [ ] Trigger an error in each endpoint
- [ ] Check logs show `[SAFE_ERROR]` format
- [ ] Verify NO request bodies in logs
- [ ] Verify NO email/phone/PII in logs

### Rate Limiting Tests

- [ ] Auth endpoint blocks after 10 requests/min
- [ ] Write endpoints block after 100 requests/min
- [ ] Read endpoints block after 300 requests/min
- [ ] 429 response includes `Retry-After` header
- [ ] Rate limit resets after window expires

---

## 📊 Validation

### Run This Command:

```bash
cd /Users/ryanguidry/ryan-portfolio

# Check all files are updated
echo "=== Checking Safe Logger ==="
grep -r "safeLogError" app/api/ | wc -l
# Should show: 6 (one per API file)

echo "=== Checking Rate Limiting ==="
grep -r "checkRateLimit" app/api/ | wc -l
# Should show: 10 (all endpoints)

echo "=== No Unsafe console.error ==="
grep -r "console.error.*err)" app/api/ | wc -l
# Should show: 0 (all replaced!)
```

---

## 🎯 What Success Looks Like

### Before Fix:
```typescript
// ❌ DANGEROUS
console.error('Error:', err);
// Logs: Error: { email: "user@example.com", password: "..." }
```

### After Fix:
```typescript
// ✅ SAFE
safeLogError('POST /api/auth', err);
// Logs: [SAFE_ERROR] { "context": "POST /api/auth", "code": "...", "message": "..." }
```

### Rate Limiting Working:
```bash
$ curl -X POST .../api/auth -d '{...}'
HTTP/1.1 429 Too Many Requests
Retry-After: 42
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 0

{
  "code": "RATE_LIMIT_EXCEEDED",
  "message": "Too many authentication attempts. Please try again later."
}
```

---

## 🚢 Ready to Deploy Checklist

- [ ] All 6 API files use `safeLogError` instead of `console.error`
- [ ] All 10 endpoints have rate limiting
- [ ] Tested error logging shows no PII
- [ ] Tested rate limiting blocks excess requests
- [ ] All tests still pass: `npm test`
- [ ] Manual testing of publish pipeline works
- [ ] Git commit: `git commit -m "fix: add PII-safe logging and rate limiting"`

---

## 🔍 Quick Debug

### If Safe Logging Doesn't Work:

```bash
# Check import exists
grep "safeLogError" app/api/profile/publish/route.ts

# Check it's exported from truth-engine
grep "safeLogError" lib/truth-engine/index.ts

# Check the file exists
ls lib/truth-engine/safe-logger.ts
```

### If Rate Limiting Doesn't Work:

```bash
# Check import exists
grep "checkRateLimit" app/api/auth/route.ts

# Check it's exported
grep "checkRateLimit" lib/truth-engine/index.ts

# Check the file exists
ls lib/truth-engine/rate-limiter.ts
```

---

## ⏱️ Time Estimate

| Task | Time |
|------|------|
| Error logging fix (automated) | 10 min |
| Rate limiting (manual updates) | 45 min |
| Testing both fixes | 30 min |
| Git commit & documentation | 15 min |
| **Total** | **~1.5-2 hours** |

---

## 📝 Commit Message Templates

```bash
# After fixing error logging
git add lib/truth-engine/safe-logger.ts app/api/
git commit -m "fix: sanitize error logs to prevent PII exposure

- Created safe-logger utility to sanitize error output
- Updated all API routes to use safeLogError
- Prevents PII leakage in application logs
- Addresses critical security issue #1"

# After adding rate limiting
git add lib/truth-engine/rate-limiter.ts app/api/
git commit -m "feat: add rate limiting to prevent DoS attacks

- Implemented in-memory rate limiter with configurable limits
- Auth endpoints: 10 req/min
- Write endpoints: 100 req/min
- Read endpoints: 300 req/min
- Returns 429 with Retry-After header
- Addresses critical security issue #2"
```

---

## 🎉 After Both Fixes

Your system will be:
- ✅ **Production-ready** - No critical security issues
- ✅ **PII-safe** - Error logs won't leak sensitive data
- ✅ **DoS-protected** - Rate limiting prevents abuse
- ✅ **Standards-compliant** - HTTP 429 with proper headers

---

## 🆘 Need Help?

### Common Issues:

**"Cannot find module '@/lib/truth-engine'"**
- Solution: Make sure you're in the ryan-portfolio directory
- Run: `npm install` to ensure dependencies are up to date

**"Rate limiting not working"**
- Check: Did you add `checkRateLimit` call BEFORE other logic?
- Check: Is import statement correct?
- Restart dev server: `npm run dev`

**"Tests failing"**
- Some tests may need updating to handle rate limits
- Add rate limit bypass for tests (see test files)

---

## 🚀 Next Steps After Fixing

1. ✅ Commit changes
2. ✅ Run full test suite
3. ✅ Deploy to staging
4. ✅ Test on staging environment
5. ✅ Deploy to production

**You're ready to launch!** 🎊
