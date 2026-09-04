'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { NAV, SITE } from '@/content/site';

/**
 * Mark and wordmark left, four pages right. No hamburger — four short links
 * fit across a 360px screen at label size, and a hamburger for four links
 * insults the reader. Below 400px they wrap to a second row rather than
 * collapse behind a button.
 */
export function Nav() {
  const path = usePathname();
  const links = NAV.filter((n) => n.href !== '/');

  return (
    <header className="border-b border-rule">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-frame flex-wrap items-center gap-x-s6 gap-y-s3 px-4 py-s4 md:px-8"
      >
        <Link href="/" className="flex items-center gap-s3 text-ink no-underline">
          <Logo className="h-7 w-7" />
          <span className="h3 !text-[1.05rem]">{SITE.name}</span>
        </Link>

        <ul className="ml-auto flex flex-wrap items-center gap-x-s6 gap-y-s2">
          {links.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={path === n.href ? 'page' : undefined}
                className="navlink"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
