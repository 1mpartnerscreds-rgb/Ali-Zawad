'use client';

import { useEffect, useRef } from 'react';

/** Total frames the page is "long". 24fps × ~77s of scroll. */
const DURATION = 1840;

/**
 * The scrub head.
 *
 * Scroll position read as a frame count against a fixed duration. It updates by
 * writing textContent directly rather than through state — a React render per
 * scroll frame is exactly the kind of cost that turns a motion site into a
 * stuttering one, and stutter here would undercut the whole pitch.
 *
 * Tabular figures and a reserved character count mean the readout never changes
 * width, so nothing around it reflows as the number climbs.
 */
export function Playhead() {
  const frameRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    let queued = false;
    let last = -1;

    const paint = () => {
      queued = false;
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0;
      const current = Math.round(progress * DURATION);
      if (current === last) return;
      last = current;
      frame.textContent = String(current).padStart(4, '0');
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    /* Difference blending rather than a scroll listener watching which movement
       is under it: the readout inverts itself over Ink and over Bone, and keeps
       working if a section is reordered. */
    <div
      aria-hidden="true"
      className="pointer-events-none fixed bottom-5 left-5 z-40 select-none mix-blend-difference lg:bottom-8 lg:left-8"
      style={{ color: '#8f9aa6' }}
    >
      <span className="tech block text-[0.6875rem] tracking-[0.18em]">
        <span ref={frameRef}>0000</span>
        <span className="opacity-45"> / </span>
        {DURATION}
      </span>
    </div>
  );
}
