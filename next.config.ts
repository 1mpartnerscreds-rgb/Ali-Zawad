import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,

  experimental: {
    // The stylesheet is ~5KB. Inlining it removes the only render-blocking
    // request on the page, which is worth ~140ms of first paint. This site is
    // not allowed to be slower than the sites it grades.
    inlineCss: true,
  },

  async redirects() {
    return [
      // The previous static site lived at /home. Keep those links alive.
      { source: '/home', destination: '/', permanent: true },
      { source: '/index.html', destination: '/', permanent: true },
      // /pricing used to be an overlay on the old homepage. Services replace it.
      { source: '/pricing', destination: '/services/build', permanent: true },
    ];
  },

  async rewrites() {
    return [
      // The client portal and admin dashboard are unchanged static apps in /public.
      // These rewrites preserve their extensionless URLs from the old cleanUrls setup.
      { source: '/client-portal', destination: '/client-portal.html' },
      { source: '/admin-dashboard', destination: '/admin-dashboard.html' },
    ];
  },

  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ];
  },
};

export default nextConfig;
