const ENTRIES = ['Parsley Seed', 'Resurrection', 'Geranium Leaf', 'Marrakech', 'Tacit', 'Hwyl'];

/**
 * Rebuild 01 — the catalogue.
 *
 * The width axis of the display face is animated as the panel crosses, so the
 * list re-sets rather than sliding. The active entry is picked out by a rule
 * that extends, not by a colour change — there is no colour to change to.
 *
 * `--w` is written by the scrub; the font reads it. Animating a variable-font
 * axis is a transform-free change, but it is confined to one column of six
 * lines, so the paint cost stays bounded.
 */
export function Aesop() {
  return (
    <div className="flex h-full w-full flex-col justify-center" data-piece="aesop">
      <ol className="w-full" style={{ ['--w' as string]: 62 }} data-axis>
        {ENTRIES.map((entry, index) => (
          <li key={entry} className="flex items-baseline gap-6 border-b border-rule py-[1.1vh]" data-entry>
            <span className="tech w-8 shrink-0 text-[0.625rem] text-grey">{String(index + 1).padStart(2, '0')}</span>
            <span
              className="display block text-[clamp(1.5rem,3.4vw,3.4rem)] whitespace-nowrap text-bone"
              style={{ fontVariationSettings: "'wdth' var(--w)" }}
            >
              {entry}
            </span>
            <span className="ml-auto h-px flex-1 origin-right scale-x-0 bg-grey" data-rule />
          </li>
        ))}
      </ol>
    </div>
  );
}
