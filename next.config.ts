import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "script-src 'self' 'unsafe-eval' 'unsafe-inline'; object-src 'none';",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/.well-known/farcaster.json',
        destination: '/.well-known/farcaster.json',
      },
    ];
  },
};

export default nextConfig;
