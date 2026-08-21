import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/Button';
import { Checklist } from '@/components/Checklist';
import { Findings } from '@/components/Findings';
import { Recommendation } from '@/components/Recommendation';
import { Score } from '@/components/Score';
import { AUDIT, AUDIT_ERRORS, SITE } from '@/content/site';
import { displayDomain, idToDomain } from '@/lib/audit/normalize';
import { getAudit } from '@/lib/audit/run';
import type { AuditResult, FailureReason } from '@/lib/audit/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

type Params = { params: Promise<{ id: string }>; searchParams: Promise<{ e?: string }> };

/**
 * Result pages are permanent public URLs — this is the lead magnet, and the
 * owner sends these links during outreach. They carry OG tags so the domain and
 * the score render in a WhatsApp or email preview, and `noindex` so somebody
 * else's score never turns up in a search result.
 */
export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const domain = idToDomain(id);
  if (!domain) return { title: 'Audit', robots: { index: false, follow: false } };

  const name = displayDomain(domain);
  const result = await getAudit(domain);

  const title =
    result.status === 'complete'
      ? `${name} scores ${result.score}/100`
      : `${AUDIT.metaPrefix} ${name}`;

  const description =
    result.status === 'complete'
      ? AUDIT.verdicts[result.band]
      : result.status === 'partial'
        ? AUDIT.partialNote
        : (AUDIT_ERRORS[result.reason]?.body ?? SITE.description);

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: `/audit/${encodeURIComponent(domain)}` },
    openGraph: {
      type: 'article',
      siteName: SITE.name,
      title,
      description,
      url: `${SITE.url}/audit/${encodeURIComponent(domain)}`,
    },
    twitter: { card: 'summary_large_image', title, description },
  };
}

export default async function AuditPage({ params, searchParams }: Params) {
  const { id } = await params;
  const { e } = await searchParams;
  const domain = idToDomain(id);

  if (!domain) return <Failure domain={null} reason="invalid" />;

  // A reason handed over in the query string comes from a run that already
  // failed on the API route. Show it rather than firing the same request again.
  if (e && e in AUDIT_ERRORS) return <Failure domain={domain} reason={e as FailureReason} />;

  const result = await getAudit(domain);
  return <Result result={result} />;
}

function Result({ result }: { result: AuditResult }) {
  const name = displayDomain(result.domain);

  if (result.status === 'failed') return <Failure domain={result.domain} reason={result.reason} />;

  const bookHref =
    result.status === 'complete'
      ? `/book?d=${encodeURIComponent(name)}&s=${result.score}`
      : `/book?d=${encodeURIComponent(name)}`;

  return (
    <article className="mx-auto max-w-text px-6 pt-20 pb-8">
      {/* The h1 is this line, not the score. The score is the loudest thing on the
          page but the page is *about* their domain, and one h1 per page means it
          should be the one that names it. */}
      <h1 className="text-small font-regular text-muted">
        {AUDIT.metaPrefix} <span className="text-ink">{name}</span>
      </h1>

      <div className="mt-10">
        {result.status === 'complete' ? (
          <Score score={result.score} band={result.band} />
        ) : (
          <div>
            <p className="text-display font-regular text-balance">{AUDIT.partialTitle}</p>
            <p className="mt-6 text-body text-muted">{AUDIT.partialNote}</p>
          </div>
        )}
      </div>

      <div className="mt-20">
        <Findings findings={result.findings} />
      </div>

      <div className="mt-20">
        <Recommendation tier={result.tier} reason={result.tierReason} bookHref={bookHref} />
      </div>

      <div className="mt-20">
        <Checklist checks={result.checks} />
      </div>

      {/* The page should not end on a list. Last thing read is the next step. */}
      <section aria-labelledby="closing-heading" className="mt-20 border-t border-line pt-14">
        <h2 id="closing-heading" className="text-small font-medium text-muted">
          {AUDIT.closingTitle}
        </h2>
        <p className="mt-4 text-body">{AUDIT.closingBody}</p>

        <div className="mt-10">
          <ButtonLink href={bookHref}>{AUDIT.bookCta}</ButtonLink>
        </div>

        <p className="mt-8 text-small text-muted">{AUDIT.ownership}</p>
        <p className="mt-2 text-small text-muted">
          <Link href="/how-the-audit-works" className="t underline underline-offset-4 hover:text-ink">
            {AUDIT.methodLink}
          </Link>
        </p>
        <p className="mt-2 text-small text-muted">{AUDIT.rerunNote}</p>
      </section>
    </article>
  );
}

/**
 * Every failure names what actually happened and ends on the same door out.
 * Nothing here is invented to fill the space where a score would have been.
 */
function Failure({ domain, reason }: { domain: string | null; reason: FailureReason }) {
  const copy = AUDIT_ERRORS[reason] ?? AUDIT_ERRORS.upstream!;
  const name = domain ? displayDomain(domain) : null;

  return (
    <div className="mx-auto max-w-text px-6 pt-20 pb-8">
      {name ? (
        <p className="text-small text-muted">
          {AUDIT.metaPrefix} <span className="text-ink">{name}</span>
        </p>
      ) : null}

      <h1 className="mt-10 text-display font-regular text-balance">{copy.title}</h1>
      <p className="mt-6 text-body text-muted">{copy.body}</p>

      <div className="mt-12 flex flex-wrap gap-3">
        <ButtonLink href={name ? `/book?d=${encodeURIComponent(name)}` : '/book'}>{AUDIT.bookCta}</ButtonLink>
        <ButtonLink href="/" variant="quiet">
          Try another address
        </ButtonLink>
      </div>
    </div>
  );
}
