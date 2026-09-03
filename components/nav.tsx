'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { NAV } from '@/content/site';

/**
 * The mark sits in the middle with the four pages split two either side.
 *
 * On a phone that split would stack into three rows and cost a third of the
 * screen, so the two lists collapse into one wrapping line beneath the mark:
 * the wrapper is a flex row there, and `contents` on wider screens so the two
 * lists become grid columns either side of the mark without extra markup.
 */
export function Nav() {
  const path = usePathname();
  const links = NAV.filter((n) => n.href !== '/');

  const item = (n: (typeof links)[number]) => (
    <li key={n.href}>
      <Link
        href={n.href}
        aria-current={path === n.href ? 'page' : undefined}
        className={`navlink mark ${path === n.href ? 'text-bone' : ''}`}
      >
        {n.label}
      </Link>
    </li>
  );

  return (
    <header className="border-b border-rule">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-frame flex-col items-center gap-3 px-4 py-3.5 md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-5 md:px-8 md:py-5"
      >
        <Link
          href="/"
          aria-label="AIMS Studio — home"
          className="flex text-bone no-underline transition-opacity duration-500 hover:opacity-65 md:order-2 md:mx-auto"
        >
          <Logo className="h-7 w-7 md:h-9 md:w-9" />
        </Link>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 md:contents">
          <ul className="flex gap-x-4 md:order-1 md:justify-start md:gap-x-7">{links.slice(0, 2).map(item)}</ul>
          <ul className="flex gap-x-4 md:order-3 md:justify-end md:gap-x-7">{links.slice(2).map(item)}</ul>
        </div>
      </nav>
    </header>
  );
}
