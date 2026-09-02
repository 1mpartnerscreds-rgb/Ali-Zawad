import Link from 'next/link';
import type { ReactNode } from 'react';

export function Section({
  mark, children, className = '', id,
}: { mark?: string; children: ReactNode; className?: string; id?: string }) {
  return (
    <section id={id} className={`mx-auto max-w-frame px-5 pt-rest lg:px-8 ${className}`}>
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

/**
 * Primary action. The label is doubled on purpose — one copy leaves upward as
 * the other arrives, inside a masked band, while the ground wipes in behind
 * it. The duplicate is hidden from assistive tech so the link reads once.
 */
export function Cta({ href, children, tone = 'solid' }:
  { href: string; children: ReactNode; tone?: 'solid' | 'line' }) {
  const cls = `btn ${tone === 'solid' ? 'btn--solid' : ''}`;
  const label = (
    <span className="btn-lab">
      <i>{children}</i>
      <i aria-hidden="true">{children}</i>
    </span>
  );

  // A booking tool lives on someone else's domain, so it cannot go through
  // the router. Anything starting with a scheme leaves the site.
  if (/^(https?:|mailto:|tel:)/.test(href)) {
    return (
      <a href={href} target={href.startsWith('http') ? '_blank' : undefined}
         rel={href.startsWith('http') ? 'noreferrer' : undefined} className={cls}>
        {label}
      </a>
    );
  }
  return <Link href={href} className={cls}>{label}</Link>;
}
