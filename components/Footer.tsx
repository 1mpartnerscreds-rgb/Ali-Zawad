import Link from 'next/link';
import { FOOTER, SITE, TIERS, TIER_ORDER } from '@/content/site';

/**
 * The wordmark set enormous, cropped by the bottom of the page.
 *
 * A footer is the last thing anybody sees and is usually the least considered
 * part of a site. Setting the name at display scale and letting the viewport
 * clip it turns the most ignorable region into the one that fixes the name in
 * memory — and it costs nothing but type.
 */
export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-line bg-canvas">
      <div className="mx-auto max-w-full px-6 pt-20 pb-10 lg:px-10">
        <div className="flex flex-col gap-12 sm:flex-row sm:justify-between">
          <div className="max-w-[30ch]">
            <p className="font-display text-title text-ink">{SITE.name}</p>
            <p className="mt-2 text-small text-muted">{FOOTER.tagline}</p>
          </div>

          <nav className="flex gap-16" aria-label="Footer">
            <div>
              <h2 className="eyebrow">{FOOTER.servicesLabel}</h2>
              <ul className="mt-4 space-y-2.5">
                {TIER_ORDER.map((slug) => (
                  <li key={slug}>
                    <Link href={`/services/${slug}`} className="t text-small text-muted no-underline hover:text-ink">
                      {TIERS[slug].name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="eyebrow">{FOOTER.moreLabel}</h2>
              <ul className="mt-4 space-y-2.5">
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
                  <a href={SITE.whatsapp} rel="noreferrer" className="t text-small text-muted no-underline hover:text-ink">
                    {FOOTER.links.whatsapp}
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <p className="mt-20 text-small text-muted">{FOOTER.rights(new Date().getFullYear())}</p>
      </div>

      {/* Cropped by the page edge on purpose.
          Not text as far as assistive tech is concerned, and not text as far as
          contrast checking is concerned either: an outline rather than a fill.
          A filled ghost at 1.3:1 is unreadable text that a low-vision reader
          can still perceive, which is a real complaint and not a false
          positive — an outline is a drawn mark instead. */}
      <p
        aria-hidden="true"
        className="az-ghostmark pointer-events-none -mb-[0.24em] px-6 font-display text-[clamp(4rem,17vw,16rem)] leading-[0.8] select-none lg:px-10"
      >
        AZ Studio
      </p>
    </footer>
  );
}
