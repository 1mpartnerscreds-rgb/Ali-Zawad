import { Reveal } from '@/components/reveal';
import { PARTNERSHIP } from '@/content/site';

/** Three statements as type. No cards, no icons, no columns. */
export function Partnership() {
  return (
    <section aria-labelledby="terms-mark" className="px-5 pt-hold pb-rest lg:px-8">
      <h2 id="terms-mark" className="mark">
        {PARTNERSHIP.marker}
      </h2>

      <Reveal stagger={0.12} className="mt-beat border-t border-rule">
        {PARTNERSHIP.statements.map((statement, index) => (
          <p
            key={statement}
            className="display display-wide border-b border-rule py-beat text-say max-w-[26ch] text-bone"
          >
            <span className="mark mr-6 align-super">{String(index + 1).padStart(2, '0')}</span>
            <span className="wipe inline-block align-top">
              <span>{statement}</span>
            </span>
          </p>
        ))}
      </Reveal>
    </section>
  );
}
