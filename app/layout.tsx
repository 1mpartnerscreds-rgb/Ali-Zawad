import type { Metadata, Viewport } from 'next';
import { Fraunces, Inter, JetBrains_Mono } from 'next/font/google';
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
  // Not preloaded: the largest text on every page is set in the display face,
  // so that is the one request worth putting ahead of the first paint. Two
  // competing font preloads is what pushed LCP out.
  preload: false,
  // Variable, not static cuts: one file covers every weight, so there is a
  // single font request to preload instead of several competing for one paint.
  axes: [],
});

/**
 * Fraunces carries the personality. Its optical-size axis means the display
 * cuts sharpen and open up at hero scale instead of being a body face blown up,
 * and a touch of WONK keeps it from feeling like a default serif.
 *
 * Only the display face is preloaded — it paints the largest text on the page.
 * The mono is for measured numbers, which arrive after.
 */
const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  // Optical sizing only. Carrying SOFT and WONK as well made the file 120KB —
  // and it is the LCP element on every page, so the character they added was
  // not worth what they cost the person waiting for the headline.
  axes: ['opsz'],
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono-face',
  preload: false,
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
  themeColor: '#0a0908',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${fraunces.variable} ${mono.variable}`}>
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
