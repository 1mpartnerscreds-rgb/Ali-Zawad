/**
 * Rebuild 03 — the system.
 *
 * Uprights draw downward, shelves extend from the left, and midway through the
 * scrub the configuration changes: two shelves move to different pins and one
 * changes span. The claim on the panel is that the system adapts, so the
 * drawing adapts while that sentence is on screen rather than after it.
 */

const UPRIGHTS = [16, 50, 84];
const SHELVES = [
  { y: 22, from: 16, to: 84, moveTo: { y: 22, from: 16, to: 50 } },
  { y: 42, from: 16, to: 50, moveTo: { y: 38, from: 50, to: 84 } },
  { y: 62, from: 50, to: 84, moveTo: { y: 58, from: 16, to: 84 } },
  { y: 82, from: 16, to: 84, moveTo: { y: 82, from: 16, to: 84 } },
];

export function Vitsoe() {
  return (
    <div className="flex h-full w-full items-center" data-piece="vitsoe">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet" className="h-[62vh] w-full" aria-hidden="true">
        {UPRIGHTS.map((x) => (
          <line
            key={x}
            x1={x}
            y1={8}
            x2={x}
            y2={94}
            stroke="currentColor"
            strokeWidth={0.4}
            className="text-rule"
            data-upright
          />
        ))}

        {SHELVES.map((shelf, index) => (
          <line
            key={index}
            x1={shelf.from}
            y1={shelf.y}
            x2={shelf.to}
            y2={shelf.y}
            stroke="currentColor"
            strokeWidth={0.9}
            className="text-bone"
            data-shelf
            data-to-y={shelf.moveTo.y}
            data-to-from={shelf.moveTo.from}
            data-to-to={shelf.moveTo.to}
          />
        ))}
      </svg>
    </div>
  );
}
