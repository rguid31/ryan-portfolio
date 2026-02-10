import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/truth-engine';
import { fetchGitHubData } from '@/lib/social/github';

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const { username } = await request.json();
    if (!username) return NextResponse.json({ error: 'Username required' }, { status: 400 });
    
    const data = await fetchGitHubData(username);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
