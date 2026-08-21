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
    <section className="night grain relative isolate" aria-labelledby="threshold-heading">
      {/* Tall enough to hold the frame while the meter runs. */}
      <div className="relative h-[240vh]">
        <div className="scene sticky top-0 flex h-screen items-center overflow-hidden">
          {/* Drawn in CSS, not fetched: a plane laid at a steep angle so its
              lines converge at a horizon and travel toward the reader. The only
              imagery in the act, and it weighs nothing. */}
          <div className="d-floor" aria-hidden="true" />

          <div className="mx-auto w-full max-w-wide px-6">
            <p className="r-fade text-small font-medium tracking-[0.14em] text-muted uppercase">{threshold.eyebrow}</p>

            <div className="mt-8 flex items-end gap-5">
              <span className="display-xl r-hold block font-regular text-[color:var(--color-accent)] tabular-nums">
                {threshold.seconds}
              </span>
              <span className="display-lg r-fade block pb-[0.18em] font-regular text-muted">{threshold.unit}</span>
            </div>

            {/* The scale runs 0–6s; the fill stops where 2.5s falls on it. */}
            <div className="mt-10 max-w-[46rem]">
              <div className="h-px w-full bg-line">
                <div
                  className="r-meter lamp h-px w-full bg-[color:var(--color-accent)]"
                  style={{ '--fill': 2.5 / 6 } as React.CSSProperties}
                />
              </div>
              <div className="mt-3 flex justify-between text-small text-muted tabular-nums">
                <span>0s</span>
                <span>6s</span>
              </div>
            </div>

            <h2 id="threshold-heading" className="display-lg mt-14 max-w-[20ch] font-regular">
              <Words text={threshold.headline} />
            </h2>

            <p className="r-up mt-8 max-w-[52ch] text-body text-muted">{threshold.body}</p>
            <p className="r-fade mt-6 max-w-[52ch] text-small text-muted">{threshold.footnote}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
