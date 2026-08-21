import type { Metadata } from 'next';
import { BookForm } from '@/components/BookForm';
import { Testimonial } from '@/components/Testimonial';
import { BOOK, TIERS, type TierSlug } from '@/content/site';

export const metadata: Metadata = {
  title: BOOK.title,
  description: BOOK.intro,
  alternates: { canonical: '/book' },
  openGraph: { title: BOOK.title, description: BOOK.intro, url: '/book' },
};

type Search = Promise<{ d?: string; s?: string; t?: string; sent?: string; error?: string }>;

export default async function BookPage({ searchParams }: { searchParams: Search }) {
  const { d, s, t, sent } = await searchParams;
  const tier = t && t in TIERS ? TIERS[t as TierSlug].name : undefined;

  if (sent) {
    return (
      <div className="mx-auto max-w-text px-6 pt-24 pb-8 lg:px-10">
        <h1 className="font-display text-hero font-light">{BOOK.success.title}</h1>
        <p className="mt-6 text-body text-muted">{BOOK.success.body}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-text px-6 pt-24 pb-8 lg:px-10">
      <h1 className="font-display text-hero font-light">{BOOK.title}</h1>
      <p className="mt-7 max-w-[48ch] text-lead text-muted">{BOOK.intro}</p>

      {/* Arriving from an audit, the call opens with the problem already understood. */}
      {d ? (
        <dl className="mt-12 border-l-2 border-line pl-6">
          <dt className="eyebrow">{BOOK.contextTitle}</dt>
          <dd className="mt-3 font-data text-body">
            {d}
            {s ? <span className="text-muted"> — scored {s}/100</span> : null}
          </dd>
        </dl>
      ) : null}

      <BookForm domain={d} score={s} tier={tier} />

      {/* After the form, not before it. Someone who arrived ready to book should
          reach the fields first; this is here for the one who hesitated. */}
      <section aria-labelledby="proof-heading" className="mt-20 border-t border-line pt-14">
        <h2 id="proof-heading" className="eyebrow">
          {BOOK.testimonialsTitle}
        </h2>
        <div className="mt-6 space-y-10">
          <Testimonial name="partners" />
          <Testimonial name="cybertech" />
        </div>
      </section>
    </div>
  );
}
