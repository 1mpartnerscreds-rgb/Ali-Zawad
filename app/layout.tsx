import type { Metadata, Viewport } from 'next';
import { IBM_Plex_Mono, Newsreader } from 'next/font/google';
import localFont from 'next/font/local';
import { Playhead } from '@/components/playhead';
import { SmoothScroll } from '@/components/smooth-scroll';
import { SITE } from '@/content/site';
import './globals.css';

/**
 * Bricolage, subset to the 92 characters this site actually sets in it.
 *
 * The full latin cut is 78KB and the hero text waits on it, which is most of
 * the LCP. Both variable axes survive the subset — the design needs wdth 88 for
 * the statement and wdth 100 elsewhere — and next/font/local still generates
 * the metric-matched fallback that keeps CLS at zero.
 *
 * Regenerate with pyftsubset if the display copy gains characters:
 *   pyftsubset <src>.woff2 --output-file=app/fonts/bricolage-subset.woff2 \
 *     --flavor=woff2 --text-file=<chars> --layout-features='kern,liga,calt'
 */
const bricolage = localFont({
  src: './fonts/bricolage-subset.woff2',
  variable: '--font-bricolage',
  display: 'swap',
  weight: '200 800',
  adjustFontFallback: 'Arial',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-newsreader',
  // A single static cut. The variable file with its optical-size axis was
  // 132KB and sat in the critical chain behind the display face; body copy at
  // one size gains nothing from opsz that is worth that.
  weight: ['400'],
  style: ['normal'],
  preload: false,
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plex-mono',
  weight: ['400'],
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    title: SITE.title,
    description: SITE.description,
    url: SITE.url,
  },
};

export const viewport: Viewport = {
  themeColor: '#14161A',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${bricolage.variable} ${newsreader.variable} ${plexMono.variable}`}>
      <body>
        <SmoothScroll />
        {children}
        <Playhead />
      </body>
    </html>
  );
}
