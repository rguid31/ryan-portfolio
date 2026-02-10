# Privacy Features Quick Start Guide

This guide helps you get the privacy-first onboarding and dashboard features up and running.

## What's Been Built

1. **Onboarding Wizard** (`/app/onboarding/page.tsx`)
   - 7-step guided setup for new users
   - Privacy-first defaults
   - PII warnings for sensitive fields

2. **Privacy Dashboard** (`/app/dashboard/privacy/page.tsx`)
   - Field-level control over all profile data
   - Real-time preview of public profile
   - Bulk actions and search

3. **Privacy Components** (`/components/privacy/`)
   - 6 reusable React components
   - FieldToggle, SectionToggle, PIIWarningModal, etc.

4. **E2E Tests** (`/e2e/`)
   - 26 Playwright tests covering all user flows
   - Multi-browser and mobile testing

## Installation

### 1. Install Dependencies (if needed)

The privacy features use existing dependencies, but you'll need Playwright for tests:

```bash
npm install -D @playwright/test
npx playwright install
```

### 2. Update package.json

Add test script:

```json
{
  "scripts": {
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui"
  }
}
```

## Running the App

### Development Server

```bash
npm run dev
```

Then visit:
- **Onboarding:** http://localhost:3000/onboarding
- **Privacy Dashboard:** http://localhost:3000/dashboard/privacy

### Production Build

```bash
npm run build
npm start
```

## Testing

### Run E2E Tests

```bash
# All tests
npm run test:e2e

# Interactive UI mode
npm run test:e2e:ui

# Specific test file
npx playwright test onboarding.spec.ts

# Debug mode
npx playwright test --debug
```

### Manual Testing Checklist

1. **Onboarding Flow**
   - [ ] Visit `/onboarding`
   - [ ] Click through all 7 steps
   - [ ] Try toggling sections
   - [ ] Try publishing PII (should see warning)
   - [ ] Complete onboarding (redirects to dashboard)

2. **Privacy Dashboard**
   - [ ] Visit `/dashboard/privacy`
   - [ ] Toggle sections on/off
   - [ ] Try search functionality
   - [ ] Use bulk actions (Publish All, Hide All)
   - [ ] Try expanding sections (Contact, etc.)
   - [ ] Toggle PII field (should see warning)
   - [ ] Save changes
   - [ ] Verify preview updates

3. **Mobile Testing**
   - [ ] Open on mobile device or Chrome DevTools mobile view
   - [ ] Verify responsive layout (stacked panels)
   - [ ] Test touch targets (toggles should be easy to tap)
   - [ ] Verify keyboard on mobile works

4. **Accessibility**
   - [ ] Tab through controls with keyboard
   - [ ] Test with screen reader (VoiceOver, NVDA)
   - [ ] Verify focus indicators are visible
   - [ ] Check color contrast in both light/dark modes

## Architecture Overview

### Data Flow

```
User Action
    ↓
Component State Update (Optimistic)
    ↓
API Call (POST /api/profile/draft)
    ↓
Backend Validation
    ↓
Database Save
    ↓
Success/Error Response
    ↓
UI Feedback
```

### Privacy Model

```typescript
// Default: Everything private except identity/links
DEFAULT_VISIBILITY = {
  sections: {
    identity: 'public',
    links: 'public',
    contact: 'private',    // PII - requires confirmation
    experience: 'public',
    education: 'public',
    skills: 'public',
    projects: 'public'
  },
  overrides: {
    '/contact/phone': 'private',
    '/contact/emails': 'private'
  }
}
```

### PII Protection

Fields marked as PII require explicit confirmation:
- Email addresses
- Phone numbers
- Street addresses
- Date of birth

Modal appears with:
- Clear warning about risks
- List of potential dangers
- "Cancel" and "I Understand, Publish Anyway" buttons

## File Structure

```
app/
├── onboarding/
│   └── page.tsx                    # 7-step wizard
└── dashboard/
    └── privacy/
        └── page.tsx                # Privacy controls

components/privacy/
├── FieldToggle.tsx                 # Individual field toggle
├── SectionToggle.tsx               # Section with children
├── PIIWarningModal.tsx             # PII confirmation
├── PublicProfilePreview.tsx        # Live preview
├── BulkActionButtons.tsx           # Quick actions
├── PrivacySearchBox.tsx            # Search/filter
└── index.ts                        # Exports

e2e/
├── onboarding.spec.ts              # 13 onboarding tests
├── privacy-dashboard.spec.ts       # 13 dashboard tests
├── playwright.config.ts            # Test configuration
└── README.md                       # Test documentation

docs/
├── FRONTEND_IMPLEMENTATION.md      # Full implementation details
└── ARCHITECTURE.md                 # System architecture
```

## API Endpoints

### Load Profile
```typescript
GET /api/profile/me
→ { draft: CanonicalProfile, visibility: VisibilitySettings }
```

### Save Draft
```typescript
POST /api/profile/draft
Body: { draft: CanonicalProfile, visibility: VisibilitySettings }
→ { saved: true, draftUpdatedAt: ISO-8601, validation: {...} }
```

### Publish Profile
```typescript
POST /api/profile/publish
Body: { confirm: true }
→ { published: true, handle, versionId, urls: {...} }
```

## Common Issues & Solutions

### Issue: Components not rendering

**Solution:** Check imports in page files:
```typescript
import { FieldToggle, SectionToggle, ... } from '@/components/privacy';
```

### Issue: Dark mode colors not working

**Solution:** Verify Tailwind classes use `dark:` prefix:
```typescript
className="bg-white dark:bg-gray-800"
```

### Issue: API calls failing

**Solution:** Check backend is running and endpoints exist:
```bash
# Check if backend is up
curl http://localhost:3000/api/profile/me
```

### Issue: Tests timing out

**Solution:** Increase timeout in `playwright.config.ts`:
```typescript
timeout: 60 * 1000  // 60 seconds
```

## Customization

### Change Privacy Defaults

Edit `/lib/truth-engine/types.ts`:

```typescript
export const DEFAULT_VISIBILITY: VisibilitySettings = {
  sections: {
    identity: 'private',  // Make identity private by default
    // ... other sections
  }
}
```

### Add New PII Field Type

Edit `/components/privacy/PIIWarningModal.tsx`:

```typescript
const PII_WARNINGS = {
  // ... existing warnings
  ssn: {
    title: 'Publish Social Security Number?',
    warning: 'Never publish your SSN...',
    risks: [...]
  }
}
```

### Customize Preview Layout

Edit `/components/privacy/PublicProfilePreview.tsx` to match your design.

## Performance Tips

1. **Optimize Preview Updates**
   - Use `useMemo` for derived state
   - Debounce rapid changes

2. **Reduce Bundle Size**
   - Code split large components
   - Lazy load modal components

3. **Improve Load Time**
   - Prefetch profile data
   - Cache visibility settings locally

## Security Considerations

1. **Never Trust Client**
   - Backend must validate all visibility settings
   - Privacy rules enforced server-side

2. **PII Protection**
   - Always require confirmation for PII
   - Log PII publication attempts

3. **API Security**
   - All write operations require authentication
   - Rate limit draft saves

## Support & Documentation

- **Full Implementation:** `/docs/FRONTEND_IMPLEMENTATION.md`
- **Architecture:** `/docs/ARCHITECTURE.md`
- **Test Guide:** `/e2e/README.md`
- **API Spec:** `/spec/API.md`
- **Privacy Rules:** `/spec/PRIVACY.md`

## Next Steps

1. **Deploy to Staging**
   ```bash
   npm run build
   # Deploy to staging environment
   ```

2. **User Testing**
   - Get 5-10 beta users
   - Observe onboarding completion rate
   - Gather feedback on privacy controls

3. **Analytics**
   - Track onboarding completion rate
   - Monitor PII warning shown/dismissed
   - Measure time to complete wizard

4. **Iterate**
   - Fix critical issues
   - Improve UX based on feedback
   - Add requested features

## Success Metrics

- **Onboarding Completion:** Target 70%+
- **PII Awareness:** 90%+ see at least one warning
- **Settings Changes:** Users update settings 1+ times/month
- **Error Rate:** < 1% of saves fail

## Getting Help

- Check `/docs/FRONTEND_IMPLEMENTATION.md` for detailed info
- Review test files for usage examples
- Read component comments for inline docs
- Check browser console for errors

---

**Privacy first. Always.**
