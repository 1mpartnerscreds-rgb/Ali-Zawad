import Link from 'next/link';
import { FOOTER, SITE, TIERS, TIER_ORDER } from '@/content/site';

/**
 * The soft gate.
 *
 * Every service page is one click from here and server-rendered for indexing.
 * Somebody who already knows they want Build should never have to be diagnosed
 * first — the funnel is the default path, not a toll gate.
 */
export function Footer() {
  return (
    <footer className="mt-20 border-t border-line">
      <div className="mx-auto max-w-wide px-6 py-14">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-[28ch]">
            <p className="text-body font-medium tracking-[-0.03em]">{SITE.name}</p>
            <p className="mt-1 text-small text-muted">{FOOTER.tagline}</p>
          </div>

          <nav className="flex gap-12" aria-label="Footer">
            <div>
              <h2 className="text-small font-medium">{FOOTER.servicesLabel}</h2>
              <ul className="mt-3 space-y-2">
                {TIER_ORDER.map((slug) => (
                  <li key={slug}>
                    <Link
                      href={`/services/${slug}`}
                      className="t text-small text-muted no-underline hover:text-ink"
                    >
                      {TIERS[slug].name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-small font-medium">{FOOTER.moreLabel}</h2>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link href="/how-the-audit-works" className="t text-small text-muted no-underline hover:text-ink">
                    {FOOTER.links.method}
                  </Link>
                </li>
                <li>
                  <Link href="/book" className="t text-small text-muted no-underline hover:text-ink">
                    {FOOTER.links.book}
                  </Link>
                </li>
                <li>
                  <a href="/client-portal" className="t text-small text-muted no-underline hover:text-ink">
                    {FOOTER.links.portal}
                  </a>
                </li>
                <li>
                  <a
                    href={SITE.whatsapp}
                    rel="noreferrer"
                    className="t text-small text-muted no-underline hover:text-ink"
                  >
                    {FOOTER.links.whatsapp}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <p className="mt-14 text-small text-muted">{FOOTER.rights(new Date().getFullYear())}</p>
      </div>
    </footer>
  );
}
