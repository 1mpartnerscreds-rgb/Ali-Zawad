import { ButtonLink } from '@/components/Button';
import { AUDIT, SERVICE_PAGE, TIERS } from '@/content/site';
import type { Tier } from '@/lib/audit/types';

/**
 * One tier, framed as a diagnosis rather than an offer. The visitor is never
 * shown the other two here — comparing is what the footer links are for, and
 * putting a menu back on this page would undo the whole funnel.
 */
export function Recommendation({
  tier,
  reason,
  bookHref,
}: {
  tier: Tier;
  reason: string;
  bookHref: string;
}) {
  const t = TIERS[tier];

  return (
    <section aria-labelledby="recommendation-heading" className="border-t border-line pt-14">
      <h2 id="recommendation-heading" className="text-small font-medium text-muted">
        {AUDIT.recommendationTitle}
      </h2>

      <p className="mt-6 text-display font-regular">{t.name}</p>
      <p className="mt-2 text-small text-muted">
        {t.price} · {t.priceNote} · {t.timeline}
      </p>

      <p className="mt-8 text-body">{reason}</p>
      <p className="mt-6 text-body text-muted">{t.what}</p>

      <div className="mt-10">
        <ButtonLink href={bookHref}>{AUDIT.bookCta}</ButtonLink>
      </div>

      <p className="mt-6 text-small text-muted">
        <a href={`/services/${t.slug}`} className="t underline underline-offset-4 hover:text-ink">
          {SERVICE_PAGE.includesTitle} in {t.name}
        </a>
      </p>
    </section>
  );
}
