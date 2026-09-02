import Link from 'next/link';
import type { ReactNode } from 'react';

export function Section({
  mark, children, className = '',
}: { mark?: string; children: ReactNode; className?: string }) {
  return (
    <section className={`mx-auto max-w-frame px-5 pt-rest lg:px-8 ${className}`}>
      {mark ? <p className="mark mb-beat">{mark}</p> : null}
      {children}
    </section>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return (
    <h1 className="display display-wide max-w-[18ch] text-[clamp(2rem,5vw,4rem)] text-bone">{children}</h1>
  );
}

/** Primary action. Filled, because on a five-page site the CTA must win. */
export function Cta({ href, children, tone = 'solid' }:
  { href: string; children: ReactNode; tone?: 'solid' | 'line' }) {
  const base =
    'inline-block px-6 py-3.5 text-[0.95rem] no-underline transition-colors duration-300';
  return (
    <Link
      href={href}
      className={
        tone === 'solid'
          ? `${base} bg-bone text-ink hover:bg-bone/85`
          : `${base} border border-rule text-bone hover:border-bone`
      }
    >
      {children}
    </Link>
  );
}
