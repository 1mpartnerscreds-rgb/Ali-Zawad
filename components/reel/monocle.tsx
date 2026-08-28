const COLUMNS = [
  ['Affairs', 'Business', 'Culture'],
  ['Design', 'Edits', 'Expo'],
  ['Radio', 'Film', 'Shop'],
];

/**
 * Rebuild 02 — the masthead.
 *
 * Rules draw, columns wipe up out of their bands, the kicker opens horizontally.
 * Because the whole thing is scrubbed rather than triggered, scrolling back up
 * takes it apart in the same order it was built — which is the point of the
 * piece and the thing a fade-in cannot do.
 */
export function Monocle() {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-[3vh]" data-piece="monocle">
      <span className="block h-px w-full origin-left scale-x-0 bg-grey" data-rule />

      <p className="wipe overflow-hidden">
        <span className="display block text-[clamp(2.5rem,7vw,7rem)] whitespace-nowrap text-bone" data-word>
          Issue 178
        </span>
      </p>

      <span className="block h-px w-full origin-left scale-x-0 bg-rule" data-rule />

      <div className="grid grid-cols-3 gap-[2vw]">
        {COLUMNS.map((column, index) => (
          <div key={index} className="overflow-hidden">
            <ul data-column>
              {column.map((item) => (
                <li key={item} className="tech border-b border-rule py-[0.9vh] text-[0.6875rem] tracking-[0.14em] text-grey uppercase">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="overflow-hidden">
        <span className="tech block text-[0.6875rem] tracking-[0.2em] text-grey uppercase" data-kicker>
          The briefing — global affairs, business, design
        </span>
      </p>
    </div>
  );
}
