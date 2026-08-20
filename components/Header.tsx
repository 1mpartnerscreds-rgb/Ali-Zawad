import Link from 'next/link';
import { NAV } from '@/content/site';

/**
 * Wordmark and one link. No nav menu — a menu on a five-page site is a list of
 * ways to not do the thing the page is asking for.
 *
 * The wordmark is type, not a logo: the site typeface, medium weight, tightened
 * tracking. That is the whole brand mark.
 */
export function Header() {
  return (
    <header className="border-b border-line">
      <div className="mx-auto flex max-w-wide items-center justify-between px-6 py-5">
        <Link
          href="/"
          className="t text-body font-medium tracking-[-0.03em] text-ink no-underline hover:opacity-70"
        >
          {NAV.wordmark}
        </Link>
        <Link href="/book" className="t text-small text-muted no-underline hover:text-ink">
          {NAV.primaryAction}
        </Link>
      </div>
    </header>
  );
}
