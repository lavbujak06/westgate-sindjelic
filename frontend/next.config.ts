import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              // 1. We explicitly define script-src to stop the "fallback" warning
              // 2. We allow 'unsafe-eval' so Next.js development mode works
              // 3. We allow cloudflare domains so the Turnstile widget can run
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://challenges.cloudflare.com",
              // Cloudflare uses iframes, so we must allow them here
              "frame-src 'self' https://challenges.cloudflare.com",
              // This allows your frontend to talk to your backend API
              `connect-src 'self' https://challenges.cloudflare.com ${process.env.NEXT_PUBLIC_API_URL}`,
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data:",
              "font-src 'self'",
              "object-src 'none'",
              "base-uri 'self'",
              "upgrade-insecure-requests"
            ].join('; ')
          },
        ],
      },
    ];
  },
};

export default nextConfig;