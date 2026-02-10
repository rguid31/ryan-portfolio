# GitHub Autofill - Quick Start Guide

## Simplest Approach: Public API (No OAuth Required!)

For MVP, we can use GitHub's public API without OAuth. Users just enter their GitHub username.

## Implementation (30 minutes)

### Step 1: Add GitHub Fetcher

```typescript
// lib/social/github.ts

export interface GitHubProfile {
  login: string;
  name: string;
  bio: string;
  location: string;
  avatar_url: string;
  blog: string;
  html_url: string;
  email: string;
  public_repos: number;
  followers: number;
}

export interface GitHubRepo {
  name: string;
  description: string;
  html_url: string;
  homepage: string;
  language: string;
  topics: string[];
  stargazers_count: number;
  fork: boolean;
}

export async function fetchGitHubProfile(username: string): Promise<GitHubProfile> {
  const response = await fetch(`https://api.github.com/users/${username}`, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Truth-Engine',
    },
  });
  
  if (!response.ok) {
    throw new Error(`GitHub user not found: ${username}`);
  }
  
  return response.json();
}

export async function fetchGitHubRepos(username: string, limit = 10): Promise<GitHubRepo[]> {
  const response = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=${limit}`,
    {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Truth-Engine',
      },
    }
  );
  
  if (!response.ok) {
    throw new Error('Failed to fetch GitHub repos');
  }
  
  const repos: GitHubRepo[] = await response.json();
  
  // Filter out forks, return only original repos
  return repos.filter(repo => !repo.fork);
}

export function mapGitHubToProfile(
  profile: GitHubProfile,
  repos: GitHubRepo[]
): Partial<CanonicalProfile> {
  return {
    identity: {
      name: profile.name || profile.login,
      headline: profile.bio || undefined,
      location: profile.location ? {
        city: profile.location.split(',')[0]?.trim(),
        region: profile.location.split(',')[1]?.trim(),
        country: profile.location.split(',')[2]?.trim(),
      } : undefined,
      image: profile.avatar_url,
    },
    links: {
      website: profile.blog || undefined,
      social: [
        {
          platform: 'GitHub',
          url: profile.html_url,
          handle: profile.login,
        },
      ],
    },
    projects: repos.map(repo => ({
      name: repo.name,
      description: repo.description || undefined,
      url: repo.html_url,
      repoUrl: repo.html_url,
      tech: [
        repo.language,
        ...repo.topics,
      ].filter(Boolean),
      highlights: repo.stargazers_count > 10 
        ? [`⭐ ${repo.stargazers_count} stars`]
        : undefined,
    })),
  };
}
```

### Step 2: Add API Endpoint

```typescript
// app/api/social/github/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/truth-engine';
import { fetchGitHubProfile, fetchGitHubRepos, mapGitHubToProfile } from '@/lib/social/github';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json(
        { error: 'GitHub username is required' },
        { status: 400 }
      );
    }
    
    // Fetch data from GitHub
    const profile = await fetchGitHubProfile(username);
    const repos = await fetchGitHubRepos(username, 10);
    
    // Map to Truth Engine format
    const mappedData = mapGitHubToProfile(profile, repos);
    
    return NextResponse.json({
      success: true,
      data: mappedData,
      meta: {
        source: 'github',
        username: profile.login,
        fetchedAt: new Date().toISOString(),
      },
    });
    
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch GitHub data' },
      { status: 500 }
    );
  }
}
```

### Step 3: Add UI Component

```typescript
// components/social/GitHubImport.tsx

'use client';

import { useState } from 'react';
import type { CanonicalProfile } from '@/lib/truth-engine/types';

interface Props {
  onImport: (data: Partial<CanonicalProfile>) => void;
}

export function GitHubImport({ onImport }: Props) {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Partial<CanonicalProfile> | null>(null);

  const handleFetch = async () => {
    if (!username.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/social/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.trim() }),
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch GitHub data');
      }
      
      setPreview(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleImport = () => {
    if (preview) {
      onImport(preview);
      setPreview(null);
      setUsername('');
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-3 mb-4">
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
        </svg>
        <div>
          <h3 className="text-lg font-semibold">Import from GitHub</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Automatically populate your profile with GitHub data
          </p>
        </div>
      </div>

      {!preview ? (
        <div>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFetch()}
              placeholder="Enter GitHub username"
              className="flex-1 px-3 py-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
              disabled={loading}
            />
            <button
              onClick={handleFetch}
              disabled={loading || !username.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Fetching...' : 'Fetch'}
            </button>
          </div>
          
          {error && (
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          )}
          
          <p className="text-xs text-gray-500 mt-2">
            Example: octocat, torvalds, gaearon
          </p>
        </div>
      ) : (
        <div>
          <div className="mb-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="font-semibold mb-2">Preview</h4>
            <div className="space-y-2 text-sm">
              {preview.identity?.name && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Name:</span>{' '}
                  <span className="font-medium">{preview.identity.name}</span>
                </div>
              )}
              {preview.identity?.headline && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Bio:</span>{' '}
                  <span>{preview.identity.headline}</span>
                </div>
              )}
              {preview.projects && preview.projects.length > 0 && (
                <div>
                  <span className="text-gray-600 dark:text-gray-400">Projects:</span>{' '}
                  <span className="font-medium">{preview.projects.length} repositories</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex gap-2">
            <button
              onClick={handleImport}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              Import Data
            </button>
            <button
              onClick={() => setPreview(null)}
              className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
```

### Step 4: Integrate into Dashboard

```typescript
// In app/dashboard/page.tsx

import { GitHubImport } from '@/components/social/GitHubImport';

// Inside the component, add this section:

<section className="mb-8">
  <h2 className="text-xl font-bold mb-4">🚀 Quick Import</h2>
  <GitHubImport
    onImport={(data) => {
      // Merge imported data with existing draft
      setDraft(prev => ({
        ...prev,
        identity: { ...prev.identity, ...data.identity },
        links: data.links ? { ...prev.links, ...data.links } : prev.links,
        projects: data.projects || prev.projects,
      }));
      
      // Show success message
      success('GitHub data imported successfully!');
      
      // Auto-save
      handleSave();
    }}
  />
</section>
```

## Testing

```bash
# Test with public GitHub profiles
curl -X POST http://localhost:3000/api/social/github \
  -H "Content-Type: application/json" \
  -d '{"username":"octocat"}'
```

## Rate Limits

GitHub API (unauthenticated):
- 60 requests per hour per IP
- Should be fine for personal use
- Can add OAuth later for 5,000 req/hour

## Advantages of This Approach

✅ No OAuth setup needed
✅ Works immediately
✅ No app registration required
✅ Simple implementation
✅ Public data only (privacy-friendly)

## Limitations

⚠️ Only public profile data
⚠️ 60 requests/hour limit
⚠️ Can't access private repos
⚠️ Can't access email (unless public)

## Future Enhancement: Add OAuth

If you need more data or higher limits, add OAuth later:

1. Register GitHub OAuth app
2. Add OAuth flow
3. Store access token
4. Use authenticated API calls
5. Get 5,000 requests/hour
6. Access private email

---

**Ready to implement?** This can be done in ~30 minutes and provides immediate value!
