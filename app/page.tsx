import Link from 'next/link';
import { Cta, Quote, Section } from '@/components/bits';
import { RecentWork } from '@/components/recent-work';
import { CTA, HOME, WHAT_YOU_GET } from '@/content/site';

/**
 * Home.
 *
 * The hero is a quote, not a hero. Every other agency at this price opens
 * with a headline over a gradient and hides the number behind a form; a
 * tradesman receives real quotes from real suppliers every week and can read
 * one in four seconds. Setting the offer in the shape he already trusts does
 * more for belief than any amount of styling, and it answers all three
 * questions of the eight-second test — what is this, what does it cost, what
 * do I do next — inside the first screen.
 *
 * Order after that follows the reader, not the seller: evidence he can click
 * before the argument for buying, and the argument before the detail.
 */
export default function Page() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="mx-auto max-w-frame px-4 pt-section md:px-8">
        <div className="grid gap-block lg:grid-cols-[minmax(0,1fr)_minmax(0,26rem)] lg:items-start lg:gap-s16">
          <div>
            <p className="label">A five-page website</p>
            <h1 className="display mt-s4 max-w-[15ch] text-hero">{HOME.hero.statement}</h1>
            <p className="mt-s6 max-w-measure text-grey">{HOME.hero.body}</p>
            <p className="mt-s4 max-w-measure font-medium">{HOME.hero.kicker}</p>

            <div className="mt-s8 flex flex-wrap gap-s3">
              <Cta href={CTA.callHref}>{CTA.call}</Cta>
              <Cta href="/pricing" tone="line">{CTA.cost}</Cta>
            </div>
          </div>

          <Quote
            head="Launch"
            badge="Quote · no obligation"
            lines={HOME.quote.lines}
            deposit={['To start', '£99 · $99']}
            balance={['On go-live, once you have approved it', '£300 · $400']}
            total={['Total', '£399 · $499']}
          />
        </div>
      </div>

      {/* ── Evidence, before the argument ────────────────────────────── */}
      <Section mark="Recent work">
        <RecentWork compact />
        <p className="mt-s8 max-w-measure text-small text-grey">
          Four live sites you can open and check. The Cybertech one is a training institute
          running since 2000 —{' '}
          <Link href="/case-studies/cybertech" className="text-ink underline underline-offset-4">
            read how it came together
          </Link>
          .
        </p>
      </Section>

      {/* ── Four things that are true today, each protecting the buyer ── */}
      <Section mark="What you are protected by">
        <dl className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {HOME.strip.map((s) => (
            <div key={s.k} className="bg-surface p-s6">
              <dt className="h3 !text-[1.02rem]">{s.k}</dt>
              <dd className="mt-s2 text-small leading-relaxed text-grey">{s.v}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ── The problem ──────────────────────────────────────────────── */}
      <Section mark={HOME.problem.marker}>
        <div className="max-w-measure">
          {HOME.problem.lines.map((l) => (
            <p key={l} className="mb-s4 text-grey">{l}</p>
          ))}
        </div>
        <p className="mt-s8 max-w-[46ch] text-h3 font-medium leading-snug">{HOME.problem.turn}</p>
        <p className="mt-s6 max-w-measure">{HOME.problem.close}</p>
      </Section>

      {/* ── The deliverable, itemised ────────────────────────────────── */}
      <Section mark={WHAT_YOU_GET.marker}>
        <p className="max-w-measure text-grey">{WHAT_YOU_GET.intro}</p>

        <ol className="mt-block border-t border-rule">
          {WHAT_YOU_GET.pages.map((p, i) => (
            <li
              key={p.n}
              className="grid gap-x-s8 gap-y-s1 border-b border-rule py-s6 md:grid-cols-[3rem_9rem_minmax(0,1fr)]"
            >
              <span className="label pt-s1 tab">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="h3 !text-[1.05rem]">{p.n}</h3>
              <p className="max-w-measure text-small leading-relaxed text-grey">{p.b}</p>
            </li>
          ))}
        </ol>

        <div className="mt-block">
          <p className="label">Bundled with every build</p>
          <ul className="mt-s6 grid gap-x-s8 gap-y-s3 md:grid-cols-2">
            {WHAT_YOU_GET.bundled.map((b) => (
              <li key={b} className="grid grid-cols-[1.25rem_minmax(0,1fr)] items-baseline text-[0.98rem]">
                <span aria-hidden="true" className="text-red">—</span>
                <span>{b}</span>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── Close ────────────────────────────────────────────────────── */}
      <Section shade className="pb-section">
        <h2 className="display max-w-[20ch] text-h1">{HOME.closing.line}</h2>
        <p className="mt-s6 max-w-measure text-grey">{HOME.closing.body}</p>
        <div className="mt-s8 flex flex-wrap gap-s3">
          <Cta href={CTA.callHref}>{CTA.call}</Cta>
          <Cta href="/pricing" tone="line">{CTA.breakdown}</Cta>
        </div>
      </Section>
    </>
  );
}
