import Link from 'next/link';
import { NAV } from '@/content/site';

/**
 * Sticky, and translucent over whatever is passing beneath it.
 *
 * On a page that alternates between near-black and paper, a solid bar would
 * have to pick one and be wrong for half the scroll. A blurred, near-transparent
 * strip inherits whichever surface is behind it, so the wordmark stays legible
 * across every act without a single scroll listener.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/60 bg-canvas/70 backdrop-blur-xl backdrop-saturate-150">
      <div className="mx-auto flex max-w-full items-center justify-between px-6 py-4 lg:px-10">
        <Link href="/" className="t group flex items-baseline gap-2.5 no-underline">
          <span className="font-display text-title leading-none text-ink">AZ</span>
          <span className="eyebrow t pb-[0.15em] group-hover:text-ink">Studio</span>
        </Link>

        <Link
          href="/book"
          className="t rounded-full border border-line px-5 py-2 text-small text-ink no-underline hover:border-ember hover:text-ember"
        >
          {NAV.primaryAction}
        </Link>
      </div>
    </header>
  );
}
