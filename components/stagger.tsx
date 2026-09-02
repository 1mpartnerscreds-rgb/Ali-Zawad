'use client';

import { useEffect, useRef } from 'react';
import { LEAD, armGsap, ease, prefersStill } from '@/components/motion';

/**
 * Block reveal, for things that are not single lines of type — cards, rows,
 * table lines.
 *
 * A line of text can sit in an overflow band and travel out of it. A card
 * cannot, so the mask is a clip-path inset instead: the block is uncovered
 * from the bottom edge upward. Same idea as the type wipes — an edge moving in
 * a real direction — rather than the fade-and-nudge this site avoids.
 *
 * Triggered rather than scrubbed. Scrub suits a sentence you are reading
 * through; a grid of six cards wants to land.
 */
export function Stagger({
  children,
  selector = '.rise',
  stagger = 0.07,
  className,
}: {
  children: React.ReactNode;
  selector?: string;
  stagger?: number;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || prefersStill()) return;

    const items = Array.from(el.querySelectorAll<HTMLElement>(selector));
    if (items.length === 0) return;

    const gsap = armGsap();
    items.forEach((i) => i.setAttribute('data-rise-armed', ''));

    const ctx = gsap.context(() => {
      gsap.fromTo(
        items,
        { clipPath: 'inset(0% 0% 100% 0%)', y: 22 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          y: 0,
          duration: 1.05,
          ease: ease(LEAD),
          stagger,
          scrollTrigger: { trigger: el, start: 'top 84%', once: true },
          onComplete: () => items.forEach((i) => i.removeAttribute('data-rise-armed')),
        },
      );
    }, el);

    return () => ctx.revert();
  }, [selector, stagger]);

  return (
    <div ref={host} className={className}>
      {children}
    </div>
  );
}
