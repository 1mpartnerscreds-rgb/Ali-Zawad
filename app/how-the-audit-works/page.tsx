import type { Metadata } from 'next';
import Link from 'next/link';
import { ButtonLink } from '@/components/Button';
import { METHOD } from '@/content/method';
import { PILLAR_WEIGHTS, type Pillar } from '@/lib/audit/weights';

export const metadata: Metadata = {
  title: METHOD.title,
  description: METHOD.intro,
  alternates: { canonical: '/how-the-audit-works' },
  openGraph: { title: METHOD.title, description: METHOD.intro, url: '/how-the-audit-works' },
};

/**
 * The weights are read from the scoring config rather than retyped, so this page
 * cannot quietly start describing a scoring system we no longer use.
 */
const PILLAR_QUESTIONS: Record<Pillar, string> = {
  loads: 'Does it load before people give up?',
  reach: 'Can a customer actually reach you?',
  phone: 'Does it work on a phone?',
  found: 'Can Google find you?',
  trust: 'Does it look safe to a browser?',
  usable: 'Can everyone use it?',
};

export default function Page() {
  const pillars = (Object.keys(PILLAR_WEIGHTS) as Pillar[]).sort((a, b) => PILLAR_WEIGHTS[b] - PILLAR_WEIGHTS[a]);
  const { sections } = METHOD;

  return (
    <article className="mx-auto max-w-text px-6 pt-20 pb-8">
      <h1 className="text-display font-regular text-balance">{METHOD.title}</h1>
      <p className="mt-8 text-body text-muted">{METHOD.intro}</p>

      <Section title={sections.sources.title} body={sections.sources.body} />
      <Section title={sections.ourChecks.title} body={sections.ourChecks.body} />

      <section className="mt-16">
        <h2 className="text-small font-medium text-muted">{sections.score.title}</h2>
        {sections.score.body.map((paragraph) => (
          <p key={paragraph} className="mt-4 text-body">
            {paragraph}
          </p>
        ))}

        <dl className="mt-8">
          {pillars.map((pillar) => (
            <div key={pillar} className="flex gap-6 border-b border-line py-3 last:border-b-0">
              <dt className="w-16 shrink-0 text-body tabular-nums">{PILLAR_WEIGHTS[pillar]}%</dt>
              <dd className="text-body">{PILLAR_QUESTIONS[pillar]}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-6 text-small text-muted">{sections.score.note}</p>
      </section>

      <Section title={sections.honesty.title} body={sections.honesty.body} />
      <Section title={sections.recommendation.title} body={sections.recommendation.body} />
      <Section title={sections.limits.title} body={sections.limits.body} />

      <div className="mt-16">
        <ButtonLink href="/">{METHOD.cta}</ButtonLink>
      </div>

      <p className="mt-6 text-small text-muted">
        Still unsure?{' '}
        <Link href="/book" className="t underline underline-offset-4 hover:text-ink">
          Book a call
        </Link>{' '}
        and we will run it with you.
      </p>
    </article>
  );
}

function Section({ title, body }: { title: string; body: readonly string[] }) {
  return (
    <section className="mt-16">
      <h2 className="text-small font-medium text-muted">{title}</h2>
      {body.map((paragraph) => (
        <p key={paragraph} className="mt-4 text-body">
          {paragraph}
        </p>
      ))}
    </section>
  );
}
