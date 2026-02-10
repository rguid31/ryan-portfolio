import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/profile/draft', '/api/profile/me'],
            },
            // Explicitly allow AI crawlers
            {
                userAgent: ['GPTBot', 'ChatGPT-User', 'Claude-Web', 'CCBot', 'PerplexityBot', 'anthropic-ai'],
                allow: '/',
            },
        ],
        sitemap: 'https://ryanguidry.com/sitemap.xml',
    };
}
