import { bezierString } from '@/components/motion';

/**
 * The named curve, drawn to scale from the same four numbers gsap is using.
 */
export function Bezier({ curve, label }: { curve: readonly number[]; label: string }) {
  const [x1, y1, x2, y2] = curve as [number, number, number, number];
  const S = 44;
  const px = (x: number) => x * S;
  const py = (y: number) => S - y * S;

  return (
    <span className="inline-flex items-center gap-3 align-middle">
      <svg width={S} height={S} viewBox={`0 0 ${S} ${S}`} aria-hidden="true" className="shrink-0 overflow-visible">
        <line x1={0} y1={S} x2={S} y2={0} stroke="currentColor" strokeWidth={0.5} opacity={0.25} />
        <path
          d={`M0,${S} C${px(x1)},${py(y1)} ${px(x2)},${py(y2)} ${S},0`}
          fill="none"
          stroke="currentColor"
          strokeWidth={1}
        />
      </svg>
      <span className="tech text-[0.625rem] tracking-[0.14em] text-grey uppercase">
        {label}
        <span className="block normal-case">cubic-bezier({bezierString(curve)})</span>
      </span>
    </span>
  );
}
