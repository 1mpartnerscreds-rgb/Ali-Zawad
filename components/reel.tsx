'use client';

import { useEffect, useRef } from 'react';
import { LEAD, armGsap, ease, prefersStill } from '@/components/motion';
import { REEL } from '@/content/site';

/**
 * The work, travelling sideways under vertical scroll.
 *
 * Each panel's screenshot drifts against its own frame on the same tween that
 * moves the track, so the images have depth rather than sliding flat. Real
 * sites, real screenshots — a small business owner is buying evidence that this
 * has been done before, not a demonstration of technique.
 *
 * Under reduced motion, and below 900px, none of it runs: the markup is already
 * a vertical list and stays one.
 */
export function Reel() {
  const host = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const hostEl = host.current;
    const trackEl = track.current;
    if (!hostEl || !trackEl) return;
    if (prefersStill() || !window.matchMedia('(min-width: 900px)').matches) return;

    const gsap = armGsap();

    const ctx = gsap.context(() => {
      const distance = () => trackEl.scrollWidth - window.innerWidth;

      const travel = gsap.to(trackEl, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: hostEl,
          start: 'top top',
          end: () => `+=${distance()}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      gsap.utils.toArray<HTMLElement>('[data-panel]', trackEl).forEach((panel) => {
        const shot = panel.querySelector('[data-shot]');
        if (!shot) return;

        // The image is oversized inside a clipped frame, so counter-drift reads
        // as parallax rather than as the picture sliding about.
        gsap.fromTo(
          shot,
          { xPercent: -6, scale: 1.12 },
          {
            xPercent: 6,
            scale: 1,
            ease: ease(LEAD),
            scrollTrigger: {
              trigger: panel,
              containerAnimation: travel,
              start: 'left right',
              end: 'right left',
              scrub: 1,
            },
          },
        );
      });
    }, hostEl);

    return () => ctx.revert();
  }, []);

  return (
    <section aria-labelledby="reel-mark" className="pt-rest">
      <h2 id="reel-mark" className="mark px-5 lg:px-8">
        {REEL.marker}
      </h2>

      <div ref={host} className="reel-frame mt-beat lg:h-screen lg:overflow-hidden">
        <div
          ref={track}
          className="reel-track flex flex-col gap-rest px-5 lg:h-screen lg:flex-row lg:gap-0 lg:px-0 lg:will-change-transform"
        >
          {REEL.pieces.map((piece) => (
            <article
              key={piece.id}
              data-panel
              className="reel-panel flex shrink-0 flex-col justify-center lg:h-screen lg:w-[72vw] lg:px-[5vw]"
            >
              <a href={piece.href} rel="noreferrer" className="group block no-underline">
                <div className="overflow-hidden border border-rule">
                  <img
                    data-shot
                    src={piece.image}
                    srcSet={`${piece.imageSmall} 400w, ${piece.imageMedium} 600w, ${piece.image} 800w`}
                    sizes="(min-width: 900px) 62vw, 100vw"
                    alt={`The ${piece.client} website`}
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="w-full will-change-transform"
                  />
                </div>

                <div className="mt-6 flex flex-col gap-4 border-t border-rule pt-5 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="display display-wide text-[clamp(1.5rem,2.4vw,2.25rem)] text-bone">
                      {piece.client}
                    </h3>
                    <p className="mt-2 max-w-measure text-[0.95rem] text-grey">{piece.note}</p>
                  </div>
                  <p className="mark shrink-0">{piece.host}</p>
                </div>
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
