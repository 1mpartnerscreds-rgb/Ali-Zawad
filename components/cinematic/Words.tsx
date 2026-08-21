import { Fragment } from 'react';

/**
 * Splits a line into words that assemble as it crosses the viewport.
 *
 * Word-level, not character-level: at display sizes a per-character stagger
 * reads as a glitch rather than as writing, and it multiplies the element count
 * by five for no extra meaning. Each word carries its index so the stagger lives
 * in the animation *range* rather than in a delay — which is what keeps it tied
 * to scroll position instead of to elapsed time.
 */
export function Words({ text, className = '' }: { text: string; className?: string }) {
  const words = text.split(' ');

  return (
    <span className={className}>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="r-word" style={{ '--i': index } as React.CSSProperties}>
            {word}
          </span>
          {/* The space belongs BETWEEN the spans, never inside one. Each word is
              an inline-block, and an inline-block that swallows its own trailing
              space leaves the browser no break opportunity between words — the
              line then refuses to wrap and runs straight off the side of the
              screen. Same failure as splitting on a non-breaking space. */}
          {index < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </span>
  );
}
