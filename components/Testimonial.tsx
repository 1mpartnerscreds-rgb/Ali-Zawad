import { TESTIMONIALS, type TestimonialKey } from '@/content/site';

/**
 * A quote, plainly set. No card, no avatar, no oversized quotation marks, no
 * carousel. The words are the evidence; decorating them makes them read as
 * marketing rather than as something a person actually said.
 */
export function Testimonial({ name }: { name: TestimonialKey }) {
  const { quote, role, company, href } = TESTIMONIALS[name];

  return (
    <figure className="border-l-2 border-line pl-6">
      <blockquote className="font-display text-title font-light text-balance text-ink">{quote}</blockquote>
      <figcaption className="mt-4 font-data text-small text-muted">
        {role},{' '}
        {href ? (
          <a href={href} rel="noreferrer" className="t text-ink underline underline-offset-4 hover:text-muted">
            {company}
          </a>
        ) : (
          <span className="text-ink">{company}</span>
        )}
      </figcaption>
    </figure>
  );
}
