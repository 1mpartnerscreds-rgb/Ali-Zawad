'use client';

import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

/**
 * Lenis drives the scroll position; ScrollTrigger reads it.
 *
 * Both run off gsap's ticker rather than their own rAF loops. Two independent
 * loops produce a half-frame disagreement between where the page thinks it is
 * and where the pinned content thinks it is, which shows up as jitter on
 * exactly the pinned sections that are supposed to be the argument.
 *
 * Under reduced motion neither is started: native scrolling, no scrub.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 3.2),
      // Touch is left alone. Hijacking momentum scroll on a phone feels broken
      // no matter how good the easing is.
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
