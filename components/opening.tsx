import { Reveal } from '@/components/reveal';
import { OPENING } from '@/content/site';

/**
 * The statement overruns the right margin at the widest breakpoint. That is the
 * first of two deliberate grid breaks; everything after it holds a strict left
 * edge, which is what makes the break read as a decision.
 */
export function Opening() {
  return (
    <header className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pt-6 pb-24 lg:px-8 lg:pt-8">
      <p className="mark">{OPENING.wordmark}</p>

      <Reveal mode="load" delay={0.15} stagger={0.09}>
        <h1 className="display text-statement -ml-[0.055em] max-w-none whitespace-nowrap text-bone" aria-label={OPENING.statement.join(' ')}>
          {OPENING.statement.map((line) => (
            <span key={line} aria-hidden="true" className="wipe">
              <span>{line}</span>
            </span>
          ))}
        </h1>
      </Reveal>

      <span aria-hidden="true" />
    </header>
  );
}
