/**
 * The headline, typed out.
 *
 * Three constraints shaped this:
 *
 * 1. It is the LCP element. Every millisecond the full text is not on screen is
 *    a millisecond of measured load time on the page that judges other people's
 *    load times. So the whole thing finishes inside ~1.2s and starts instantly.
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

export function Typewriter({ text, className = '' }: { text: string; className?: string }) {
  const characters = [...text];

  return (
    <h1 className={className} aria-label={text}>
      <span className="az-type" aria-hidden="true">
        {characters.map((character, index) => (
          <span
            key={`${character}-${index}`}
            className="az-type-char"
            style={{ animationDelay: `${index * STEP_MS}ms` }}
          >
            {character}
          </span>
        ))}
        <span className="az-caret" style={{ animationDelay: `${characters.length * STEP_MS}ms` }} aria-hidden="true" />
      </span>
    </h1>
  );
}

/** So callers can reserve the right amount of time before anything follows. */
export const typingDurationMs = (text: string) => [...text].length * STEP_MS;
