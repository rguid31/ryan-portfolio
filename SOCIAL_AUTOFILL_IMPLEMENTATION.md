# Social Profile Autofill Feature

## Overview

Allow users to connect their GitHub, LinkedIn, and Facebook accounts to automatically populate their Truth Engine profile with data from these platforms.

## Architecture

### Phase 1: OAuth Connection (Link Accounts)
Users connect their social accounts via OAuth 2.0

### Phase 2: Data Fetching
Fetch profile data from connected platforms

### Phase 3: Smart Merge
Intelligently merge social data into Truth Engine profile

## Implementation Plan

### 1. Database Schema Changes

Add new tables to track connected accounts:

```sql
-- Connected social accounts
CREATE TABLE IF NOT EXISTS social_connections (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  provider TEXT NOT NULL CHECK (provider IN ('github', 'linkedin', 'facebook')),
  provider_user_id TEXT NOT NULL,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  token_expires_at TEXT,
  profile_data TEXT, -- Cached JSON
  connected_at TEXT NOT NULL DEFAULT (datetime('now')),
  last_synced_at TEXT,
  UNIQUE(user_id, provider)
);

CREATE INDEX IF NOT EXISTS idx_social_user ON social_connections(user_id);
```

### 2. Environment Variables Needed

Add to `.env.local` and Vercel:

```bash
# GitHub OAuth
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

# LinkedIn OAuth
LINKEDIN_CLIENT_ID="your_linkedin_client_id"
LINKEDIN_CLIENT_SECRET="your_linkedin_client_secret"

# Facebook OAuth (optional)
FACEBOOK_APP_ID="your_facebook_app_id"
FACEBOOK_APP_SECRET="your_facebook_app_secret"

# OAuth Callback URL
NEXT_PUBLIC_BASE_URL="http://localhost:3000" # or your production URL
```

### 3. File Structure

```
lib/
├── social/
│   ├── github.ts          # GitHub API integration
│   ├── linkedin.ts        # LinkedIn API integration
│   ├── facebook.ts        # Facebook API integration
│   ├── oauth.ts           # OAuth flow helpers
│   └── mapper.ts          # Map social data to Truth Engine schema
│
app/api/
├── social/
│   ├── connect/
│   │   └── [provider]/
│   │       └── route.ts   # Initiate OAuth flow
│   ├── callback/
│   │   └── [provider]/
│   │       └── route.ts   # OAuth callback handler
│   ├── disconnect/
│   │   └── [provider]/
│   │       └── route.ts   # Disconnect account
│   └── sync/
│       └── [provider]/
│           └── route.ts   # Fetch & sync data
│
components/
└── social/
    ├── SocialConnectButton.tsx    # Connect account button
    ├── SocialConnectionCard.tsx   # Show connected accounts
    └── SocialAutofillModal.tsx    # Preview & confirm autofill
```

## API Endpoints

### Connect Social Account
```
GET /api/social/connect/[provider]
→ Redirects to OAuth provider
```

### OAuth Callback
```
GET /api/social/callback/[provider]?code=xxx
→ Exchanges code for token, saves connection
→ Redirects back to dashboard
```

### Sync Data
```
POST /api/social/sync/[provider]
→ Fetches latest data from provider
→ Returns mapped profile data for preview
```

### Disconnect
```
DELETE /api/social/disconnect/[provider]
→ Removes connection
```

## Data Mapping

### GitHub → Truth Engine

```typescript
GitHub Profile:
- name → identity.name
- bio → identity.headline
- location → identity.location
- avatar_url → identity.image
- blog → links.website
- html_url → links.social (GitHub)
- email → contact.emails

GitHub Repos:
- public repos → projects[]
  - name → project.name
  - description → project.description
  - html_url → project.url
  - homepage → project.url
  - language + topics → project.tech
```

### LinkedIn → Truth Engine

```typescript
LinkedIn Profile:
- firstName + lastName → identity.name
- headline → identity.headline
- summary → identity.summary
- location → identity.location
- profilePicture → identity.image

LinkedIn Experience:
- positions → experience[]
  - company → organization
  - title → title
  - description → highlights
  - startDate/endDate → dates

LinkedIn Education:
- schools → education[]
  - schoolName → institution
  - degreeName → degree
  - fieldOfStudy → field

LinkedIn Skills:
- skills → skills[]
```

### Facebook → Truth Engine

```typescript
Facebook Profile:
- name → identity.name
- about → identity.summary
- location → identity.location
- picture → identity.image
- website → links.website
- email → contact.emails
```

## UI Components

### Dashboard Integration

Add a new section in the dashboard:

```tsx
// In app/dashboard/page.tsx

<section className="mb-8">
  <h2 className="text-xl font-bold mb-4">🔗 Connect Social Accounts</h2>
  <p className="text-sm text-gray-600 mb-4">
    Import your profile data from GitHub, LinkedIn, or Facebook
  </p>
  
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    <SocialConnectionCard provider="github" />
    <SocialConnectionCard provider="linkedin" />
    <SocialConnectionCard provider="facebook" />
  </div>
</section>
```

### Connection Card

```tsx
// components/social/SocialConnectionCard.tsx

interface Props {
  provider: 'github' | 'linkedin' | 'facebook';
  connection?: SocialConnection;
}

export function SocialConnectionCard({ provider, connection }: Props) {
  const isConnected = !!connection;
  
  return (
    <div className="border rounded-lg p-4">
      <div className="flex items-center gap-3 mb-3">
        <ProviderIcon provider={provider} />
        <h3 className="font-semibold capitalize">{provider}</h3>
      </div>
      
      {isConnected ? (
        <>
          <p className="text-sm text-gray-600 mb-3">
            Connected as {connection.provider_user_id}
          </p>
          <div className="flex gap-2">
            <button onClick={handleSync} className="btn-primary">
              Sync Data
            </button>
            <button onClick={handleDisconnect} className="btn-secondary">
              Disconnect
            </button>
          </div>
        </>
      ) : (
        <button onClick={handleConnect} className="btn-primary w-full">
          Connect {provider}
        </button>
      )}
    </div>
  );
}
```

### Autofill Preview Modal

```tsx
// components/social/SocialAutofillModal.tsx

interface Props {
  provider: string;
  fetchedData: Partial<CanonicalProfile>;
  currentData: CanonicalProfile;
  onConfirm: (mergedData: CanonicalProfile) => void;
  onCancel: () => void;
}

export function SocialAutofillModal({ provider, fetchedData, currentData, onConfirm, onCancel }: Props) {
  const [selectedFields, setSelectedFields] = useState<string[]>([]);
  
  return (
    <div className="modal">
      <h2>Import from {provider}</h2>
      <p>Select which fields to import:</p>
      
      <div className="space-y-4">
        {/* Show diff for each field */}
        <FieldDiff
          label="Name"
          current={currentData.identity.name}
          imported={fetchedData.identity?.name}
          selected={selectedFields.includes('name')}
          onToggle={() => toggleField('name')}
        />
        
        {/* More fields... */}
      </div>
      
      <div className="flex gap-2 mt-6">
        <button onClick={handleConfirm} className="btn-primary">
          Import Selected
        </button>
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
      </div>
    </div>
  );
}
```

## Security Considerations

### 1. Token Storage
- Encrypt access tokens before storing in database
- Use environment variable for encryption key
- Rotate tokens regularly

### 2. OAuth Security
- Use PKCE (Proof Key for Code Exchange) for public clients
- Validate state parameter to prevent CSRF
- Use secure, httpOnly cookies for OAuth state

### 3. Rate Limiting
- Limit sync requests to prevent API abuse
- Cache fetched data for 1 hour minimum

### 4. Privacy
- Only fetch public profile data by default
- Request minimal OAuth scopes needed
- Allow users to disconnect anytime

## OAuth Setup Instructions

### GitHub OAuth App

1. Go to: https://github.com/settings/developers
2. Click "New OAuth App"
3. Fill in:
   - Application name: Truth Engine
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL: `https://your-domain.com/api/social/callback/github`
4. Copy Client ID and Client Secret

**Scopes needed:**
- `read:user` - Read user profile
- `user:email` - Read email addresses
- `public_repo` - Read public repositories (optional)

### LinkedIn OAuth App

1. Go to: https://www.linkedin.com/developers/apps
2. Click "Create app"
3. Fill in app details
4. Go to "Auth" tab
5. Add redirect URL: `https://your-domain.com/api/social/callback/linkedin`
6. Copy Client ID and Client Secret

**Scopes needed:**
- `r_liteprofile` - Read basic profile
- `r_emailaddress` - Read email
- `r_basicprofile` - Read full profile (if available)

### Facebook OAuth App

1. Go to: https://developers.facebook.com/apps
2. Click "Create App"
3. Choose "Consumer" type
4. Add "Facebook Login" product
5. Configure OAuth redirect URI: `https://your-domain.com/api/social/callback/facebook`
6. Copy App ID and App Secret

**Permissions needed:**
- `public_profile` - Read basic profile
- `email` - Read email address

## Implementation Priority

### Phase 1: GitHub (Easiest)
- ✅ Most developer-friendly API
- ✅ No review process needed
- ✅ Great for projects/repos
- **Start here**

### Phase 2: LinkedIn (Most Valuable)
- ⚠️ Requires app review for full access
- ⚠️ Limited API access in recent years
- ✅ Best for professional experience
- **Implement after GitHub works**

### Phase 3: Facebook (Optional)
- ⚠️ Requires app review
- ⚠️ Limited professional data
- ⚠️ Privacy concerns
- **Consider skipping or doing last**

## Alternative: Simpler Approach

If OAuth is too complex initially, consider:

### Option A: Manual Import
- User pastes their GitHub username
- Fetch public data via GitHub API (no OAuth needed)
- Same for LinkedIn public profiles

### Option B: Resume Upload Enhancement
- Enhance existing AI autofill
- Add prompt: "Extract GitHub/LinkedIn URLs from resume"
- Fetch public data from those URLs

### Option C: Browser Extension
- Build a Chrome extension
- Scrape data from social profiles
- Send to Truth Engine API

## Cost Considerations

### API Limits (Free Tiers)

**GitHub:**
- 60 requests/hour (unauthenticated)
- 5,000 requests/hour (authenticated)
- ✅ Very generous

**LinkedIn:**
- Limited free tier
- May require paid partnership
- ⚠️ Check current pricing

**Facebook:**
- Free for basic profile access
- Rate limits apply
- ✅ Adequate for personal use

## Next Steps

1. **Start with GitHub** (easiest, most valuable for developers)
2. **Create OAuth app** on GitHub
3. **Implement basic flow**:
   - Connect button
   - OAuth redirect
   - Callback handler
   - Fetch repos
   - Map to profile
4. **Test thoroughly**
5. **Add LinkedIn** if GitHub works well
6. **Consider Facebook** last (or skip)

## Estimated Development Time

- GitHub integration: 4-6 hours
- LinkedIn integration: 6-8 hours (includes app review wait)
- Facebook integration: 4-6 hours
- UI components: 3-4 hours
- Testing & polish: 2-3 hours

**Total: 19-27 hours** for all three platforms

**Recommendation:** Start with GitHub only (7-10 hours total)

---

Would you like me to implement the GitHub integration first?
