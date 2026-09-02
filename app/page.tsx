import { Cta, Section } from '@/components/bits';
import { Reveal } from '@/components/reveal';
import { CTA, HOME, TIERS } from '@/content/site';

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
          <Cta href="/about" tone="line">{CTA.call}</Cta>
        </div>
      </section>

      {/* Four things that are true today, each one protecting the buyer. */}
      <div className="mx-auto max-w-frame px-5 lg:px-8">
        <dl className="grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
          {HOME.strip.map((s) => (
            <div key={s.k} className="bg-ink p-6">
              <dt className="display display-wide text-[1.05rem] text-bone">{s.k}</dt>
              <dd className="mt-2 text-[0.92rem] leading-relaxed text-grey">{s.v}</dd>
            </div>
          ))}
        </dl>
      </div>

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
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {HOME.gets.items.map((i) => (
            <div key={i.t} className="border-t border-rule pt-5">
              <h2 className="display display-wide text-[1.15rem] text-bone">{i.t}</h2>
              <p className="mt-2 max-w-measure text-[0.95rem] leading-relaxed text-grey">{i.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section mark={HOME.price.marker}>
        <p className="max-w-measure text-[1.05rem] text-grey">{HOME.price.lead}</p>
        <div className="mt-beat grid gap-10 md:grid-cols-2">
          {TIERS.map((t) => (
            <div key={t.name} className="border-t border-rule pt-6">
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
        </div>
        <p className="mt-10 max-w-measure text-[0.95rem] text-grey">{HOME.price.foot}</p>
        <div className="mt-8"><Cta href="/pricing">{CTA.breakdown}</Cta></div>
      </Section>

      <Section>
        <p className="display display-wide max-w-[20ch] text-[clamp(1.8rem,4.5vw,3.25rem)] text-bone">
          {HOME.closing.line}
        </p>
        <p className="mt-6 max-w-measure text-[1.05rem] text-grey">{HOME.closing.body}</p>
        <div className="mt-10"><Cta href="/about">{CTA.call}</Cta></div>
      </Section>
    </main>
  );
}
