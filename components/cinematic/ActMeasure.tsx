import { Words } from '@/components/cinematic/Words';
import { ACTS } from '@/content/site';
import { PILLAR_WEIGHTS, type Pillar } from '@/lib/audit/weights';

/**
 * The horizontal act.
 *
 * The page scrolls down; the six pillars travel sideways. Driven by a named
 * view timeline on the tall host, so the rail moves exactly while the host is
 * pinned — no measuring, no resize listener, no JavaScript at all.
 *
 * The weights come from the scoring config, so this act cannot drift away from
 * what the audit actually does. If a weight is retuned, the page retells itself.
 */

const QUESTIONS: Record<Pillar, { question: string; line: string }> = {
  loads: {
    question: 'Does it load before they give up?',
    line: 'Measured from real visits where Google has them, and a throttled test phone where it does not.',
  },
  reach: {
    question: 'Can a customer actually reach you?',
    line: 'A phone link, an email, WhatsApp, a form. Somewhere for a person who has already decided to go.',
  },
  phone: {
    question: 'Does it work on a phone?',
    line: 'Whether it lays out to the screen or gets cut off at the edge — and whether they can zoom when it does.',
  },
  found: {
    question: 'Can Google find you?',
    line: 'Your title and description are your advert in the search results. Most sites let Google write them.',
  },
  trust: {
    question: 'Does it look safe to a browser?',
    line: 'A valid certificate, nothing loading insecurely, no errors thrown while the page runs.',
  },
  usable: {
    question: 'Can everyone use it?',
    line: 'Contrast you can read in sunlight. Images a screen reader can describe. Text that scales.',
  },
};

export function ActMeasure() {
  const { measure } = ACTS;
  const pillars = (Object.keys(PILLAR_WEIGHTS) as Pillar[]).sort((a, b) => PILLAR_WEIGHTS[b] - PILLAR_WEIGHTS[a]);

  return (
    <section aria-labelledby="measure-heading">
      <div className="mx-auto max-w-wide px-6 pt-32 pb-16">
        <p className="r-fade text-small font-medium tracking-[0.14em] text-muted uppercase">{measure.eyebrow}</p>
        <h2 id="measure-heading" className="display-lg mt-6 max-w-[18ch] font-regular">
          <Words text={measure.headline} />
        </h2>
        <p className="r-up mt-8 max-w-[52ch] text-body text-muted">{measure.body}</p>
      </div>

      {/* Host height sets how long the rail takes to cross. */}
      <div className="r-rail-host relative h-[420vh]">
        <div className="r-rail-frame scene sticky top-0 flex h-screen items-center overflow-hidden">
          <ol className="r-rail d-corridor flex gap-8 pl-6 will-change-transform">
            {pillars.map((pillar) => (
              <li
                key={pillar}
                className="d-panel flex h-[54vh] w-[78vw] shrink-0 flex-col justify-between border border-line bg-bg p-8 sm:w-[42vw] lg:w-[28vw]"
              >
                <div>
                  <span className="display-lg block font-regular tabular-nums text-[color:var(--color-accent)]">
                    {PILLAR_WEIGHTS[pillar]}
                    <span className="text-muted">%</span>
                  </span>
                  {/* The share of the score, drawn. The number and the bar are
                      the same fact stated twice, which is how a weighting
                      becomes legible at a glance. */}
                  <div className="mt-6 h-px w-full bg-line">
                    <div
                      className="h-px w-full bg-[color:var(--color-accent)] opacity-70"
                      style={{ transform: `scaleX(${PILLAR_WEIGHTS[pillar] / 28})`, transformOrigin: 'left center' }}
                    />
                  </div>
                </div>
                <div>
                  <h3 className="text-body font-medium text-balance">{QUESTIONS[pillar].question}</h3>
                  <p className="mt-4 text-small text-muted">{QUESTIONS[pillar].line}</p>
                </div>
              </li>
            ))}
            {/* Trailing spacer so the last card clears the right edge. */}
            <li aria-hidden="true" className="w-[18vw] shrink-0" />
          </ol>
        </div>
      </div>
    </section>
  );
}
