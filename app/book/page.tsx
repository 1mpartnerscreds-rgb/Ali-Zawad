import type { Metadata } from 'next';
import { BookForm } from '@/components/BookForm';
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
      <div className="mx-auto max-w-text px-6 pt-20 pb-8">
        <h1 className="text-display font-regular">{BOOK.success.title}</h1>
        <p className="mt-6 text-body text-muted">{BOOK.success.body}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-text px-6 pt-20 pb-8">
      <h1 className="text-display font-regular">{BOOK.title}</h1>
      <p className="mt-6 max-w-[46ch] text-body text-muted">{BOOK.intro}</p>

      {/* Arriving from an audit, the call opens with the problem already understood. */}
      {d ? (
        <dl className="mt-12 border-l-2 border-line pl-6">
          <dt className="text-small font-medium text-muted">{BOOK.contextTitle}</dt>
          <dd className="mt-2 text-body">
            {d}
            {s ? <span className="text-muted"> — scored {s}/100</span> : null}
          </dd>
        </dl>
      ) : null}

      <BookForm domain={d} score={s} tier={tier} />
    </div>
  );
}
