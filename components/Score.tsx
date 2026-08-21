import { AUDIT } from '@/content/site';
import type { Band } from '@/lib/audit/weights';

/**
 * The number, at full height.
 *
 * This is the moment the whole site exists to produce, so it gets the largest
 * type on any page and nothing else competes with it. The numeral is set in the
 * display face at its most open optical size; the label beneath is monospaced,
 * because a measured figure should look like it came off an instrument.
 *
 * Colour comes from the band, not from the accent. Rendering an 88 in the same
 * ember as a call-to-action would have the palette contradicting the verdict
 * printed directly underneath it, and the score is the one thing on this page
 * that has to be believed.
 */

const BAND_TEXT: Record<Band, string> = {
  poor: 'text-band-poor',
  fair: 'text-band-fair',
  good: 'text-band-good',
};

const BAND_GLOW: Record<Band, string> = {
  poor: 'var(--color-band-poor)',
  fair: 'var(--color-band-fair)',
  good: 'var(--color-band-good)',
};

export function Score({ score, band }: { score: number; band: Band }) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -left-16 h-[28rem] w-[28rem] rounded-full opacity-[0.10] blur-[110px]"
        style={{ background: `radial-gradient(circle, ${BAND_GLOW[band]} 0%, transparent 70%)` }}
      />

      <div className="relative flex items-baseline gap-6">
        <p
          className={`${BAND_TEXT[band]} font-display text-[clamp(6rem,22vw,15rem)] leading-[0.82] font-light`}
        >
          {score}
          <span className="sr-only"> {AUDIT.scoreLabel}</span>
        </p>
        <p aria-hidden="true" className="font-data pb-[0.9em] text-micro tracking-[0.16em] text-muted uppercase">
          / 100
        </p>
      </div>

      <p className="font-display mt-10 max-w-[20ch] text-display font-light text-balance">{AUDIT.verdicts[band]}</p>
      <p className="mt-6 max-w-[52ch] font-data text-small text-dim">{AUDIT.scoreCaption}</p>
    </div>
  );
}
