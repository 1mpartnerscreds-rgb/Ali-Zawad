import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * The curve, as four numbers.
 *
 * Defined here once and used twice: gsap eases with it, and the reel draws it.
 * A site that names an easing curve and then shows a different one is exactly
 * the kind of detail the audience for this site checks.
 */
export const LEAD = [0.16, 1, 0.3, 1] as const;
export const SETTLE = [0.62, 0.05, 0.24, 1] as const;

export const bezierString = (c: readonly number[]) => `${c[0]}, ${c[1]}, ${c[2]}, ${c[3]}`;

let registered = false;

export function armGsap() {
  if (!registered) {
    gsap.registerPlugin(ScrollTrigger);
    registered = true;
  }
  return gsap;
}

export const prefersStill = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** gsap accepts a raw cubic-bezier through CustomEase-free syntax. */
export const ease = (c: readonly number[]) => `cubic-bezier(${bezierString(c)})`;
