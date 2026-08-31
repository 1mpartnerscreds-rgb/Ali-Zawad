import { Reveal } from '@/components/reveal';
import { WORKS } from '@/content/site';

/** Three steps as type. No cards, no icons, no timeline graphic. */
export function Works() {
  return (
    <section aria-labelledby="works-mark" className="px-5 pt-hold pb-rest lg:px-8">
      <h2 id="works-mark" className="mark">
        {WORKS.marker}
      </h2>

      <Reveal stagger={0.12} className="mt-beat border-t border-rule">
        {WORKS.steps.map((step) => (
          <div key={step.n} className="grid gap-4 border-b border-rule py-beat lg:grid-cols-12 lg:gap-8">
            <span className="mark lg:col-span-1">{step.n}</span>
            <h3 className="display display-wide text-say max-w-[16ch] text-bone lg:col-span-6">
              <span className="wipe">
                <span>{step.title}</span>
              </span>
            </h3>
            <p className="max-w-measure text-grey lg:col-span-5">{step.body}</p>
          </div>
        ))}
      </Reveal>
    </section>
  );
}
