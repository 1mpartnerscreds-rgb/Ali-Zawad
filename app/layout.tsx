import type { Metadata, Viewport } from 'next';
import { Inter, Inter_Tight } from 'next/font/google';
import { Footer } from '@/components/footer';
import { Nav } from '@/components/nav';
import { SITE } from '@/content/site';
import './globals.css';

/**
 * Two faces, one family skeleton.
 *
 * Inter Tight for display: the narrower cut reads as signage rather than
 * editorial, which is the difference between looking like a supplier and
 * looking like a magazine. Inter for body — same designer, same skeleton,
 * so they compose without discord.
 *
 * Dropped in the Trade Van redesign: Bricolage Grotesque (a width axis this
 * reader is not shopping for), Newsreader (a news face on a trades site),
 * IBM Plex Mono (mono micro-labels read as "designer"). Labels are now
 * uppercase Inter with tracking, which costs no extra download.
 */
const interTight = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter-tight',
  weight: ['500', '600'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500'],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
  },
};

export const viewport: Viewport = {
  themeColor: '#F7F5F0',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-GB" className={`${interTight.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="sr-only">Skip to content</a>
        <Nav />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
