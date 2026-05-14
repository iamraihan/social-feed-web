import type { NextConfig } from 'next';

// Production posture lives here. Anything that's a "every request should
// have it" header / behaviour ships from this file so we don't repeat
// ourselves per-route.

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,

  // Server Action posture. Next.js 16 already compares Origin vs Host by
  // default — `allowedOrigins` is an explicit allow-list for setups where
  // the host header isn't trustworthy (custom proxies, multi-domain).
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
      allowedOrigins:
        process.env.NEXT_PUBLIC_APP_ORIGIN
          ? [process.env.NEXT_PUBLIC_APP_ORIGIN]
          : ['localhost:3000'],
    },
  },

  // Remote image hosts the AppImage / Avatar may load from. Local images
  // ship in /public and don't need remotePatterns. The backend serves
  // user-uploaded avatars at /uploads/** — register them so Next.js can
  // optimise + serve WebP for those URLs once the feed API integration
  // sends real image keys.
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/uploads/**',
      },
    ],
  },

  // Baseline security headers for every response. The CSP here is a
  // permissive starting point — `'unsafe-inline'` on scripts/styles is a
  // stop-gap because Next.js injects inline runtime chunks and the design
  // ships inline `style` props in places. Tighten by adopting nonces (via
  // `nonce()` from `next/headers`) and then dropping the unsafe-inline.
  async headers() {
    const apiOrigin =
      process.env.API_URL?.replace(/\/$/, '') ?? 'http://localhost:8000';
    const csp = [
      `default-src 'self'`,
      `script-src 'self' 'unsafe-inline' 'unsafe-eval'`,
      `style-src 'self' 'unsafe-inline' https://fonts.googleapis.com`,
      `font-src 'self' https://fonts.gstatic.com`,
      `img-src 'self' data: blob: ${apiOrigin}`,
      `connect-src 'self' ${apiOrigin}`,
      `frame-ancestors 'none'`,
      `base-uri 'self'`,
      `form-action 'self'`,
    ].join('; ');

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
