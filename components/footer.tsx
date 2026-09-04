import Link from 'next/link';
import { Logo } from '@/components/logo';
import { NAV, SITE, TO_FILL } from '@/content/site';

/**
 * No company number, no registered office, no "Ltd" — none of it is true
 * yet. What replaces it is what IS true: a real address for email, a named
 * person, and where an enquiry actually goes.
 */
export function Footer() {
  return (
    <footer className="mt-section border-t border-rule bg-surface-2">
      <div className="mx-auto grid max-w-frame gap-s8 px-4 py-s12 md:grid-cols-3 md:px-8">
        <div>
          <span className="flex items-center gap-s3 text-ink">
            <Logo className="h-6 w-6" />
            <span className="h3 !text-[1rem]">{SITE.name}</span>
          </span>
          <p className="mt-s4 max-w-measure text-small text-grey">
            Five-page websites for trades and small service businesses. £399 or $499,
            live in two weeks, and the domain is registered in your name.
          </p>
        </div>

        <div className="flex flex-col gap-s2">
          <p className="label">Contact</p>
          <a href={`mailto:${SITE.email}`} className="text-small text-ink no-underline hover:underline">
            {SITE.email}
          </a>
          {TO_FILL.phone ? (
            TO_FILL.phoneHref ? (
              <a href={`tel:${TO_FILL.phoneHref}`} className="tab text-small text-ink no-underline hover:underline">
                {TO_FILL.phone}
              </a>
            ) : (
              <span className="tab text-small text-ink">{TO_FILL.phone}</span>
            )
          ) : null}
          <p className="label mt-s1">Mon–Fri · same working day</p>
        </div>

        <div className="flex flex-col gap-s2">
          <p className="label">Pages</p>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-small text-grey no-underline hover:text-ink">
              {n.label}
            </Link>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-frame px-4 pb-s12 md:px-8">
        <p className="text-small text-grey">
          {SITE.name} is a trading name of {TO_FILL.founder}. Not a registered company.
        </p>
      </div>
    </footer>
  );
}
