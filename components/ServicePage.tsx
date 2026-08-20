import { ButtonLink } from '@/components/Button';
import { SERVICE_PAGE, TIERS, type TierSlug } from '@/content/site';

/**
 * One skeleton for all three tiers, in the same order every time, so a visitor
 * comparing them is reading a table rather than relearning a layout.
 *
 * Nothing here is marked "most popular" or "recommended". The recommendation is
 * earned on the audit result page against real measurements; repeating it here
 * would turn a diagnosis back into a sales pitch.
 */
export function ServicePage({ slug }: { slug: TierSlug }) {
  const tier = TIERS[slug];

  return (
    <article className="mx-auto max-w-text px-6 pt-20 pb-8">
      <h1 className="text-display font-regular">{tier.name}</h1>

      <section className="mt-14">
        <h2 className="text-small font-medium text-muted">{SERVICE_PAGE.whatTitle}</h2>
        <p className="mt-4 text-body">{tier.what}</p>
      </section>

      <section className="mt-14">
        <h2 className="text-small font-medium text-muted">{SERVICE_PAGE.includesTitle}</h2>
        <ul className="mt-4 space-y-3">
          {tier.includes.map((item) => (
            <li key={item} className="text-body">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-14 flex flex-col gap-14 sm:flex-row sm:gap-24">
        <section>
          <h2 className="text-small font-medium text-muted">{SERVICE_PAGE.priceTitle}</h2>
          <p className="mt-4 text-body">
            {tier.price}
            <span className="text-muted"> · {tier.priceNote}</span>
          </p>
        </section>

        <section>
          <h2 className="text-small font-medium text-muted">{SERVICE_PAGE.timelineTitle}</h2>
          <p className="mt-4 text-body">{tier.timeline}</p>
        </section>
      </div>

      <section className="mt-14">
        <h2 className="text-small font-medium text-muted">{SERVICE_PAGE.caseTitle}</h2>
        <p className="mt-4 text-body text-muted">
          {tier.caseNote}{' '}
          {tier.caseHref ? (
            <a
              href={tier.caseHref}
              rel="noreferrer"
              className="t text-ink underline underline-offset-4 hover:text-muted"
            >
              {tier.caseLabel}
            </a>
          ) : null}
        </p>
      </section>

      <div className="mt-16">
        <ButtonLink href={`/book?t=${tier.slug}`}>{SERVICE_PAGE.cta}</ButtonLink>
      </div>
    </article>
  );
}
