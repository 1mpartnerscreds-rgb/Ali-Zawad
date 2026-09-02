'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';
import { NAV, SITE } from '@/content/site';

/** Persistent across all five pages. The mark returns home; nothing else moves. */
export function Nav() {
  const path = usePathname();
  return (
    <header className="border-b border-rule">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-frame flex-wrap items-center gap-x-6 gap-y-3 px-5 py-4 lg:px-8"
      >
        <Link href="/" className="flex items-center gap-3 text-bone no-underline">
          <Logo className="h-7 w-7" />
          <span className="mark !tracking-[0.16em] text-bone">{SITE.name}</span>
        </Link>

        <ul className="ml-auto flex flex-wrap items-center gap-x-5 gap-y-2">
          {NAV.filter((n) => n.href !== '/').map((n) => {
            const here = path === n.href;
            return (
              <li key={n.href}>
                <Link
                  href={n.href}
                  aria-current={here ? 'page' : undefined}
                  className={`mark no-underline transition-colors duration-300 hover:text-bone ${
                    here ? 'text-bone' : ''
                  }`}
                >
                  {n.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
