import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  async rewrites() {
    return [
      // /u/:handle.json → /api/u/:handle/json
      {
        source: '/u/:handle.json',
        destination: '/api/u/:handle/json',
      },
      // /u/:handle.jsonld → /api/u/:handle/jsonld
      {
        source: '/u/:handle.jsonld',
        destination: '/api/u/:handle/jsonld',
      },
    ];
  },
};

export default nextConfig;
