import { Reveal } from '@/components/reveal';
import { GAP } from '@/content/site';

/**
 * The shortest movement on the site, set small and pushed right into a column
 * that nothing else uses. Second grid break. The restraint is the argument —
 * setting the most important sentence large would be arguing the opposite.
 */
export function Gap() {
  return (
    <section aria-labelledby="gap-mark" className="px-5 pt-hold pb-hold lg:px-8">
      <div className="ml-auto w-full max-w-measure lg:mr-[8%] lg:w-[42%]">
        <h2 id="gap-mark" className="mark mb-beat">
          {GAP.marker}
        </h2>

        <Reveal>
          <p className="text-say display display-wide text-bone">
            {GAP.lines.map((line) => (
              <span key={line} className="wipe">
                <span>{line}</span>
              </span>
            ))}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
