'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { NAV } from '@/content/site';

/**
 * The mark sits in the middle, with the four pages split two either side of
 * it. Four links divide evenly, so the split is the content's own shape rather
 * than a layout imposed on it — and centring the mark only works because of
 * that. On narrow screens the row stacks: mark first, links beneath.
 */
export function Nav() {
  const path = usePathname();
  const links = NAV.filter((n) => n.href !== '/');
  const left = links.slice(0, 2);
  const right = links.slice(2);

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
        className="mx-auto grid max-w-frame grid-cols-1 items-center gap-y-5 px-5 py-5 lg:grid-cols-[1fr_auto_1fr] lg:px-8"
      >
        <ul className="order-2 flex flex-wrap justify-center gap-x-7 gap-y-2 lg:order-1 lg:justify-start">
          {left.map(item)}
        </ul>

        <Link
          href="/"
          aria-label="AIMS Studio — home"
          className="order-1 mx-auto flex text-bone no-underline transition-opacity duration-500 hover:opacity-65 lg:order-2"
        >
          <Logo className="h-9 w-9" />
        </Link>

        <ul className="order-3 flex flex-wrap justify-center gap-x-7 gap-y-2 lg:justify-end">
          {right.map(item)}
        </ul>
      </nav>
    </header>
  );
}
