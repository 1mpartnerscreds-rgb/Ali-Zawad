/**
 * The headline, typed out.
 *
 * Three constraints shaped this:
 *
 * 1. It is the LCP element. Every millisecond the full text is not on screen is
 *    a millisecond of measured load time on the page that judges other people's
 *    load times. So the whole thing finishes inside ~0.7s and starts instantly.
 * 2. It has to be real text in the DOM for search engines, so nothing is
 *    injected by script — this is server-rendered characters plus CSS delays,
 *    and it works with JavaScript switched off.
 * 3. Per-character spans make some screen readers spell words out letter by
 *    letter. So the h1 carries the full sentence as its accessible name and the
 *    animated characters are hidden from assistive tech.
 *
 * Under prefers-reduced-motion the text is simply there, at once.
 */

/** Milliseconds between characters. Fast enough to read as typing, not waiting. */
const STEP_MS = 9;

interface TypewriterProps {
  text: string;
  className?: string;
  /**
   * A substring set in the display italic and lit in ember. The whole argument
   * of the sentence usually sits in one or two words; letting those carry a
   * different voice is most of what makes a headline look composed rather than
   * merely large.
   */
  emphasis?: string;
}

export function Typewriter({ text, className = '', emphasis }: TypewriterProps) {
  const characters = [...text];
  const start = emphasis ? text.indexOf(emphasis) : -1;
  const end = start >= 0 ? start + emphasis!.length : -1;

  return (
    <h1 className={className} aria-label={text}>
      <span className="az-type" aria-hidden="true">
        {characters.map((character, index) => {
          const lit = start >= 0 && index >= start && index < end;
          return (
            <span
              key={`${character}-${index}`}
              className={`az-type-char${lit ? ' az-lit' : ''}`}
              style={{ animationDelay: `${index * STEP_MS}ms` }}
            >
              {character}
            </span>
          );
        })}
        <span className="az-caret" style={{ animationDelay: `${characters.length * STEP_MS}ms` }} aria-hidden="true" />
      </span>
    </h1>
  );
}
