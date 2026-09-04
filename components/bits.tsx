import Link from 'next/link';
import type { ReactNode } from 'react';

export function Section({
  mark, children, className = '', id, shade = false,
}: { mark?: string; children: ReactNode; className?: string; id?: string; shade?: boolean }) {
  return (
    <section id={id} className={shade ? 'bg-surface-2' : undefined}>
      <div className={`mx-auto max-w-frame px-4 pt-section md:px-8 ${className}`}>
        {mark ? <p className="label mb-s6">{mark}</p> : null}
        {children}
      </div>
    </section>
  );
}

export function Lede({ children }: { children: ReactNode }) {
  return <h1 className="display max-w-[18ch] text-hero">{children}</h1>;
}

/**
 * The label is doubled inside a masked band — one copy leaves upward as its
 * twin arrives, while the ground wipes in behind from the same direction. The
 * duplicate is hidden from assistive tech so the link reads once.
 */
export function Cta({ href, children, tone = 'primary' }:
  { href: string; children: ReactNode; tone?: 'primary' | 'line' }) {
  const cls = `btn ${tone === 'primary' ? 'btn--primary' : ''}`;
  const label = (
    <span className="btn-lab">
      <i>{children}</i>
      <i aria-hidden="true">{children}</i>
    </span>
  );
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

/**
 * The site's signature. A tradesman reads a supplier's quote every week and
 * can parse one in four seconds without being taught how — so the offer is
 * set as one. Labels left, figures right, tabular so the columns line up,
 * a heavier rule above the total.
 */
export function Quote({
  head, badge, lines, deposit, balance, total,
}: {
  head: string; badge: string;
  lines: readonly string[];
  deposit: [string, string]; balance: [string, string]; total: [string, string];
}) {
  return (
    <div className="quote">
      <div className="quote-head">
        <span className="h3">{head}</span>
        <span className="label">{badge}</span>
      </div>

      {lines.map((l) => (
        <div key={l} className="quote-row">
          <span className="text-[0.98rem]">{l}</span>
          <span className="label !tracking-[0.06em] shrink-0">Included</span>
        </div>
      ))}

      <div className="quote-row">
        <span className="text-[0.98rem]">{deposit[0]}</span>
        <span className="tab shrink-0 font-medium">{deposit[1]}</span>
      </div>
      <div className="quote-row">
        <span className="text-[0.98rem]">{balance[0]}</span>
        <span className="tab shrink-0 font-medium">{balance[1]}</span>
      </div>

      <div className="quote-row quote-total">
        <span className="h3">{total[0]}</span>
        <span className="h3 tab shrink-0">{total[1]}</span>
      </div>
    </div>
  );
}
