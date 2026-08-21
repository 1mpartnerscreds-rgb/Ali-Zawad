import { Words } from '@/components/cinematic/Words';
import { ACTS } from '@/content/site';

/**
 * The dark act.
 *
 * The page changes state here — off-white to near-black — because the argument
 * changes. Everything before this is about your site; this is about the
 * boundary your site is being judged against.
 *
 * The number is pinned while a meter scrubs to 2.5 seconds beneath it. The
 * meter is not decoration: it fills to exactly the fraction of a six-second
 * scale that Google's threshold sits at, so the visual is the measurement.
 */
export function ActThreshold() {
  const { threshold } = ACTS;

  return (
    <section className="grain relative isolate" aria-labelledby="threshold-heading">
      {/* Tall enough to hold the frame while the meter runs. */}
      <div className="relative h-[240vh]">
        <div className="scene sticky top-0 flex h-screen items-center overflow-hidden">
          {/* Drawn in CSS, not fetched: a plane laid at a steep angle so its
              lines converge at a horizon and travel toward the reader. The only
              imagery in the act, and it weighs nothing. */}
          <div className="d-floor" aria-hidden="true" />

          <div className="mx-auto w-full max-w-wide px-6">
            <p className="eyebrow r-fade">{threshold.eyebrow}</p>

            <div className="mt-8 flex items-end gap-5">
              <span className="font-display r-hold block text-hero font-light text-ember">
                {threshold.seconds}
              </span>
              <span className="font-display r-fade block pb-[0.22em] text-display font-light text-muted italic">{threshold.unit}</span>
            </div>

            {/* The scale runs 0–6s; the fill stops where 2.5s falls on it. */}
            <div className="mt-10 max-w-[46rem]">
              <div className="h-px w-full bg-line">
                <div
                  className="r-meter lamp h-px w-full bg-[color:var(--color-ember)]"
                  style={{ '--fill': 2.5 / 6 } as React.CSSProperties}
                />
              </div>
              <div className="mt-3 flex justify-between font-data text-micro text-muted">
                <span>0s</span>
                <span>6s</span>
              </div>
            </div>

            <h2 id="threshold-heading" className="font-display mt-14 max-w-[16ch] text-display font-light">
              <Words text={threshold.headline} />
            </h2>

            <p className="r-up mt-8 max-w-[54ch] text-lead text-muted">{threshold.body}</p>
            <p className="r-fade mt-6 max-w-[54ch] font-data text-small text-dim">{threshold.footnote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
