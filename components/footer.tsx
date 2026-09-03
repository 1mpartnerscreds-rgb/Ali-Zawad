import Link from 'next/link';
import { NAV, SITE, TO_FILL } from '@/content/site';

/**
 * No company number, no registered office, no "Ltd" — none of that is true
 * yet. The block that replaces it says what is: a real address for email, a
 * real person, and where the enquiry actually goes.
 */
export function Footer() {
  return (
    <footer className="mt-hold border-t border-rule px-5 py-12 lg:px-8">
      <div className="mx-auto flex max-w-frame flex-col gap-10 md:flex-row md:justify-between">
        <div className="max-w-measure">
          <p className="mark">{SITE.name}</p>
          <p className="mt-3 text-[0.95rem] text-grey">
            Five-page websites for trades and small service businesses. £399 or $499, live in two weeks,
            and the domain is registered in your name.
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="mark">Contact</p>
          <a href={`mailto:${SITE.email}`} className="text-[0.95rem] text-bone no-underline hover:opacity-70">
            {SITE.email}
          </a>
          {TO_FILL.phoneHref ? (
            <a href={`tel:${TO_FILL.phoneHref}`} className="tech text-[0.95rem] text-bone no-underline hover:opacity-70">
              {TO_FILL.phone}
            </a>
          ) : (
            <span className="tech text-[0.95rem] text-grey">{TO_FILL.phone}</span>
          )}
          <p className="mark mt-1">Mon–Fri · {TO_FILL.hours} UK</p>
        </div>

        <div className="flex flex-col gap-2">
          <p className="mark">Pages</p>
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="text-[0.95rem] text-grey no-underline hover:text-bone">
              {n.label}
            </Link>
          ))}
        </div>
      </div>

      <p className="mx-auto mt-12 max-w-frame text-[0.8rem] text-grey">
        {SITE.name} is a trading name of {TO_FILL.founder}. Not a registered company.
      </p>
    </footer>
  );
}
