import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, safeLogError } from '@/lib/truth-engine';

export async function POST(request: NextRequest) {
    try {
        const user = await requireAuth();
        const { handle, vercelToken } = await request.json();

        if (!vercelToken) {
            return NextResponse.json({ error: 'Vercel API Token is required.' }, { status: 400 });
        }

        // 1. Get the template HTML
        const templateRes = await fetch('https://raw.githubusercontent.com/rguid31/truth-engine-viewer/main/index.html');
        let html = await templateRes.text();
        html = html.replace('VITE_PREFILL_HANDLE', handle);

        // 2. Deploy to Vercel via REST API (Zero-Build Deployment)
        const deployRes = await fetch('https://api.vercel.com/v13/deployments', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${vercelToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: `${handle}-portfolio`,
                files: [
                    {
                        file: 'index.html',
                        data: html,
                    },
                    {
                        file: 'package.json',
                        data: JSON.stringify({ scripts: { start: "serve ." } }),
                    }
                ],
                projectSettings: {
                    framework: null,
                    buildCommand: null,
                    installCommand: null,
                }
            })
        });

        const deployment = await deployRes.json();

        if (!deployRes.ok) {
            console.error('Vercel API Error:', deployment);
            throw new Error(deployment.error?.message || 'Vercel Deployment Failed');
        }

        return NextResponse.json({
            success: true,
            url: `https://${deployment.url}`,
            deploymentId: deployment.id
        });

    } catch (err: any) {
        safeLogError('DEPLOY_API', err);
        return NextResponse.json({ error: err.message || 'Internal Server Error' }, { status: 500 });
    }
}
