import type { CanonicalProfile } from '@/lib/truth-engine/types';

export async function fetchGitHubData(username: string) {
  const [profile, repos] = await Promise.all([
    fetch(`https://api.github.com/users/${username}`).then(r => r.json()),
    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=10`).then(r => r.json())
  ]);

  if (profile.message) throw new Error('GitHub user not found');

  return {
    identity: {
      name: profile.name || profile.login,
      headline: profile.bio || undefined,
      location: profile.location ? { city: profile.location } : undefined,
      image: profile.avatar_url,
    },
    links: {
      website: profile.blog || undefined,
      sameAs: [profile.html_url],
    },
    projects: repos.filter((r: any) => !r.fork).map((r: any) => ({
      name: r.name,
      description: r.description || undefined,
      url: r.html_url,
      repoUrl: r.html_url,
      tech: [r.language, ...r.topics].filter(Boolean),
    })),
  } as Partial<CanonicalProfile>;
}
