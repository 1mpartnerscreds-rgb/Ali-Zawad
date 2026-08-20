import { AUDIT } from '@/content/site';
import type { Band } from '@/lib/audit/weights';

/**
 * The emotional centre of the site: one number, then one sentence.
 *
 * A note on colour. The brief reserves the accent for three places — the input,
 * the score, and the primary button — and separately allows muted semantic
 * colours for score bands. Those two rules collide on exactly this element, so
 * the numeral takes its band colour. Rendering an 88 in warning-orange would be
 * the palette contradicting the verdict printed underneath it, and the score is
 * the one thing on this page that has to be believable.
 */

const BAND_TEXT: Record<Band, string> = {
  poor: 'text-band-poor',
  fair: 'text-band-fair',
  good: 'text-band-good',
};

export function Score({ score, band }: { score: number; band: Band }) {
  return (
    <div>
      <p className={`${BAND_TEXT[band]} font-regular leading-none tracking-[-0.04em] text-[clamp(5rem,18vw,9rem)]`}>
        {score}
        <span className="sr-only"> {AUDIT.scoreLabel}</span>
      </p>
      <p className="mt-2 text-small text-muted" aria-hidden="true">
        {AUDIT.scoreLabel}
      </p>
      <p className="mt-8 max-w-[26ch] text-display font-regular text-balance">{AUDIT.verdicts[band]}</p>
      <p className="mt-6 text-small text-muted">{AUDIT.scoreCaption}</p>
    </div>
  );
}
