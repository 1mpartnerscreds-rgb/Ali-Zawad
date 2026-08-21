import { ButtonLink } from '@/components/Button';
import { Testimonial } from '@/components/Testimonial';
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
    <article className="mx-auto max-w-text px-6 pt-24 pb-8 lg:px-10">
      <h1 className="font-display text-hero font-light">{tier.name}</h1>

      <section className="mt-14">
        <h2 className="eyebrow">{SERVICE_PAGE.whatTitle}</h2>
        <p className="mt-5 text-lead">{tier.what}</p>
      </section>

      <section className="mt-14">
        <h2 className="eyebrow">{SERVICE_PAGE.includesTitle}</h2>
        <ul className="mt-4 space-y-3">
          {tier.includes.map((item) => (
            <li key={item} className="border-b border-line pb-3 text-body">
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-14 flex flex-col gap-14 sm:flex-row sm:gap-24">
        <section>
          <h2 className="eyebrow">{SERVICE_PAGE.priceTitle}</h2>
          <p className="font-display mt-4 text-display font-light text-ember">
            {tier.price}
            <span className="text-muted"> · {tier.priceNote}</span>
          </p>
        </section>

        <section>
          <h2 className="eyebrow">{SERVICE_PAGE.timelineTitle}</h2>
          <p className="font-display mt-4 text-display font-light">{tier.timeline}</p>
        </section>
      </div>

      <section className="mt-14">
        <h2 className="eyebrow">{SERVICE_PAGE.caseTitle}</h2>
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

      {tier.testimonial ? (
        <section className="mt-14">
          <h2 className="eyebrow">{SERVICE_PAGE.testimonialTitle}</h2>
          <div className="mt-4">
            <Testimonial name={tier.testimonial} />
          </div>
        </section>
      ) : null}

      <div className="mt-16">
        <ButtonLink href={`/book?t=${tier.slug}`}>{SERVICE_PAGE.cta}</ButtonLink>
      </div>
    </article>
  );
}
