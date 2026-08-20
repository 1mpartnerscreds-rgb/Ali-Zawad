import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { Footer } from '@/components/Footer';
import { Header } from '@/components/Header';
import { NAV, SITE } from '@/content/site';
import './globals.css';

/**
 * One family, self-hosted at build time by next/font. No runtime request to
 * Google, no render-blocking stylesheet, no layout shift when it swaps in.
 */
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  // Variable, not two static cuts: one file covers both weights, so there is a
  // single font request to preload instead of two competing for the same paint.
  axes: [],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.name} — Find out what your website is costing you`,
    template: `%s — ${SITE.name}`,
  },
  description: SITE.description,
  applicationName: SITE.name,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: `${SITE.name} — Find out what your website is costing you`,
    description: SITE.description,
    url: SITE.url,
  },
  twitter: { card: 'summary_large_image' },
};

export const viewport: Viewport = {
  themeColor: '#faf9f7',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <a href="#main" className="sr-only focus:not-sr-only">
          {NAV.skipToContent}
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
