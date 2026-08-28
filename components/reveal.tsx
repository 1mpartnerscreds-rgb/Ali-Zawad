'use client';

import { useEffect, useRef } from 'react';
import { LEAD, armGsap, ease, prefersStill } from '@/components/motion';

interface RevealProps {
  children: React.ReactNode;
  /** `load` runs once on arrival; `scrub` ties progress to scroll position. */
  mode?: 'load' | 'scrub';
  delay?: number;
  stagger?: number;
  className?: string;
}

/**
 * Masked reveals. Every line sits inside an overflow-hidden band and travels up
 * out of it — there is no opacity fade and no twenty-pixel nudge anywhere.
 *
 * The type is in place by default and only pushed down once JavaScript has
 * confirmed it can bring it back. If the script never runs, the page reads.
 */
export function Reveal({ children, mode = 'scrub', delay = 0, stagger = 0.08, className }: RevealProps) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || prefersStill()) return;

    const gsap = armGsap();
    const lines = Array.from(el.querySelectorAll<HTMLElement>('.wipe > *'));
    if (lines.length === 0) return;

    lines.forEach((line) => line.setAttribute('data-wipe-armed', ''));

    const ctx = gsap.context(() => {
      gsap.set(lines, { yPercent: 112 });

      if (mode === 'load') {
        gsap.to(lines, { yPercent: 0, duration: 1.25, ease: ease(LEAD), stagger, delay });
      } else {
        gsap.to(lines, {
          yPercent: 0,
          duration: 1,
          ease: ease(LEAD),
          stagger,
          scrollTrigger: { trigger: el, start: 'top 82%', end: 'top 42%', scrub: 1 },
        });
      }
    }, el);

    return () => ctx.revert();
  }, [mode, delay, stagger]);

  return (
    <div ref={host} className={className}>
      {children}
    </div>
  );
}
