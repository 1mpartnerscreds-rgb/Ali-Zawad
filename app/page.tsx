import Link from 'next/link';
import { Cta, Section } from '@/components/bits';
import { RecentWork } from '@/components/recent-work';
import { Stagger } from '@/components/stagger';
import { Reveal } from '@/components/reveal';
import { CTA, HOME, TIERS, WHAT_YOU_GET } from '@/content/site';

export default function Page() {
  return (
    <main>
      <section className="mx-auto max-w-frame px-5 pt-rest pb-beat lg:px-8">
        <Reveal mode="load" delay={0.1} stagger={0.08}>
          <h1
            className="display text-[clamp(2.6rem,9vw,7rem)] -ml-[0.04em] text-bone"
            aria-label={HOME.hero.statement.join(' ')}
          >
            {HOME.hero.statement.map((l) => (
              <span key={l} aria-hidden="true" className="wipe">
                <span>{l}</span>
              </span>
            ))}
          </h1>

          <p className="wipe mt-10 max-w-measure">
            <span className="block text-[1.05rem] leading-relaxed text-grey">{HOME.hero.body}</span>
          </p>
          <p className="wipe mt-5 max-w-measure">
            <span className="block text-[1.05rem] text-bone">{HOME.hero.kicker}</span>
          </p>
          <p className="wipe mt-10 max-w-[40ch]">
            <span className="display display-wide block text-say text-bone">{HOME.hero.offer}</span>
          </p>
        </Reveal>

        <div className="mt-12 flex flex-wrap gap-4">
          <Cta href="/pricing">{CTA.cost}</Cta>
          <Cta href={CTA.callHref} tone="line">{CTA.call}</Cta>
        </div>
      </section>

      {/* Four things that are true today, each one protecting the buyer. */}
      <Stagger className="mx-auto max-w-frame px-5 lg:px-8" stagger={0.09}>
        <dl className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {HOME.strip.map((s) => (
            <div key={s.k} className="rise bg-ink p-6">
              <dt className="display display-wide text-[1.05rem] text-bone">{s.k}</dt>
              <dd className="mt-2 text-[0.92rem] leading-relaxed text-grey">{s.v}</dd>
            </div>
          ))}
        </dl>
      </Stagger>

      {/* Signature: what £399 actually buys. On a site whose one job is to
          convince a sceptical mechanic the offer is real, itemising the
          deliverable comes before any argument for it. */}
      <Section mark={WHAT_YOU_GET.marker}>
        <p className="max-w-measure text-[1.05rem] leading-relaxed text-grey">{WHAT_YOU_GET.intro}</p>

        <ol className="mt-beat">
          {WHAT_YOU_GET.pages.map((p, i) => (
            <li key={p.n} className="grid gap-x-8 gap-y-1 border-t border-rule py-5 md:grid-cols-[3rem_10rem_1fr]">
              <span className="mark pt-1">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="display display-wide text-[1.15rem] text-bone">{p.n}</h3>
              <p className="text-[0.98rem] leading-relaxed text-grey">{p.b}</p>
            </li>
          ))}
        </ol>

        <div className="mt-hold border-t border-accent pt-8">
          <p className="mark">Bundled with every build</p>
          <ul className="mt-6 grid gap-y-3 gap-x-10 md:grid-cols-2">
            {WHAT_YOU_GET.bundled.map((b) => (
              <li key={b} className="text-[0.98rem] text-bone/90 leading-relaxed">
                <span className="mr-2 text-accent">·</span>
                {b}
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* Evidence, earlier than the argument. A trades buyer has to see real
          sites before the sales pitch is worth reading, and putting it above
          the problem statement means he sees it while he still has energy
          for the page. */}
      <Section mark="Recent work">
        <RecentWork compact />
        <p className="mt-8 max-w-measure text-[0.95rem] text-grey">
          Four live sites you can click and check. The Cybertech one is a training institute running since 2000 —{' '}
          <Link href="/case-studies/cybertech" className="text-bone hover:opacity-70">read how it came together</Link>.
        </p>
      </Section>

      <Section mark={HOME.problem.marker}>
        <Reveal stagger={0.08}>
          <div className="max-w-measure">
            {HOME.problem.lines.map((l) => (
              <p key={l} className="wipe mb-5">
                <span className="block text-[1.05rem] leading-relaxed text-grey">{l}</span>
              </p>
            ))}
          </div>
          {/* The pivot of the argument, so it is emphasised — but it is a
              full sentence, and at display scale it ran to ten lines and
              swallowed the page. Sized to sit above body copy, not shout. */}
          <p className="wipe mt-10 max-w-[48ch]">
            <span className="display display-wide block text-[clamp(1.3rem,2.3vw,1.85rem)] leading-[1.3] text-bone">
              {HOME.problem.turn}
            </span>
          </p>
          <p className="wipe mt-8 max-w-measure">
            <span className="block text-[1.05rem] text-bone">{HOME.problem.close}</span>
          </p>
        </Reveal>
      </Section>

      <Section mark={HOME.gets.marker}>
        <Stagger className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {HOME.gets.items.map((i) => (
            <div key={i.t} className="rise border-t border-rule pt-5">
              <h2 className="display display-wide text-[1.15rem] text-bone">{i.t}</h2>
              <p className="mt-2 max-w-measure text-[0.95rem] leading-relaxed text-grey">{i.b}</p>
            </div>
          ))}
        </Stagger>
      </Section>

      <Section mark={HOME.price.marker}>
        <p className="max-w-measure text-[1.05rem] text-grey">{HOME.price.lead}</p>
        <Stagger className="mt-beat grid gap-10 md:grid-cols-2" stagger={0.12}>
          {TIERS.map((t) => (
            <div key={t.name} className="rise border-t border-rule pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="display display-wide text-say text-bone">{t.name}</h2>
                <p className="display text-[clamp(2rem,4.5vw,3.25rem)] leading-none text-bone tabular-nums">
                  {t.price}
                </p>
              </div>
              <p className="mark mt-3">{t.note}</p>
              <p className="mt-4 max-w-measure text-[0.95rem] text-grey">{t.who}</p>
            </div>
          ))}
        </Stagger>
        <p className="mt-10 max-w-measure text-[0.95rem] text-grey">{HOME.price.foot}</p>
        <div className="mt-8"><Cta href="/pricing">{CTA.breakdown}</Cta></div>
      </Section>

      <Section>
        <p className="display display-wide max-w-[20ch] text-[clamp(1.8rem,4.5vw,3.25rem)] text-bone">
          {HOME.closing.line}
        </p>
        <p className="mt-6 max-w-measure text-[1.05rem] text-grey">{HOME.closing.body}</p>
        <div className="mt-10"><Cta href={CTA.callHref}>{CTA.call}</Cta></div>
      </Section>
    </main>
  );
}
