import { Reveal } from '@/components/reveal';
import { TRUST } from '@/content/site';

export function Trust() {
  return (
    <section aria-labelledby="trust-mark" className="px-5 pt-hold pb-rest lg:px-8">
      <h2 id="trust-mark" className="mark">
        {TRUST.marker}
      </h2>

      <Reveal stagger={0.1} className="mt-beat">
        <div className="display display-wide text-say max-w-[24ch] text-bone">
          {TRUST.lines.map((line) => (
            <p key={line} className="wipe">
              <span>{line}</span>
            </p>
          ))}
        </div>
      </Reveal>

      <div className="mt-hold grid gap-14 lg:grid-cols-2 lg:gap-24">
        {TRUST.quotes.map((q) => (
          <figure key={q.who} className="border-l border-rule pl-6">
            <blockquote className="text-[1.05rem] leading-relaxed text-bone/85">{q.text}</blockquote>
            <figcaption className="mark mt-4">{q.who}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
