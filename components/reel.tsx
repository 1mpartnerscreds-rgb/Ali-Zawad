'use client';

import { useEffect, useRef } from 'react';
import { Bezier } from '@/components/bezier';
import { LEAD, SETTLE, armGsap, ease, prefersStill } from '@/components/motion';
import { Aesop } from '@/components/reel/aesop';
import { Monocle } from '@/components/reel/monocle';
import { Vitsoe } from '@/components/reel/vitsoe';
import { REEL } from '@/content/site';

const PIECES = [Aesop, Monocle, Vitsoe];
const CURVES = [LEAD, SETTLE, LEAD];

/**
 * The reel.
 *
 * Vertical input drives horizontal travel, and each piece's own motion hangs off
 * that same tween via `containerAnimation` — so moving sideways is what plays
 * the work. Sliding finished cards past the viewport would have been the easier
 * build and would have proved nothing.
 *
 * Under reduced motion, and on narrow screens, none of this runs: the markup is
 * already a vertical list and simply stays one.
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

      const panels = gsap.utils.toArray<HTMLElement>('[data-panel]', trackEl);

      panels.forEach((panel) => {
        const inside = (vars: gsap.TweenVars) => ({
          ...vars,
          scrollTrigger: {
            trigger: panel,
            containerAnimation: travel,
            start: 'left 78%',
            end: 'right 34%',
            scrub: 1,
          },
        });

        const kind = panel.querySelector('[data-piece]')?.getAttribute('data-piece');

        if (kind === 'aesop') {
          // The list re-sets rather than moves: only the width axis changes.
          gsap.fromTo(
            panel.querySelector('[data-axis]'),
            { '--w': 58 },
            inside({ '--w': 128, ease: ease(LEAD) }),
          );
          gsap.fromTo(
            panel.querySelectorAll('[data-rule]'),
            { scaleX: 0 },
            inside({ scaleX: 1, stagger: 0.06, ease: ease(LEAD) }),
          );
        }

        if (kind === 'monocle') {
          gsap.fromTo(
            panel.querySelectorAll('[data-rule]'),
            { scaleX: 0 },
            inside({ scaleX: 1, stagger: 0.12, ease: ease(SETTLE) }),
          );
          gsap.fromTo(panel.querySelector('[data-word]'), { yPercent: 112 }, inside({ yPercent: 0, ease: ease(LEAD) }));
          gsap.fromTo(
            panel.querySelectorAll('[data-column]'),
            { yPercent: 106 },
            inside({ yPercent: 0, stagger: 0.09, ease: ease(LEAD) }),
          );
          gsap.fromTo(
            panel.querySelector('[data-kicker]'),
            { clipPath: 'inset(0 100% 0 0)' },
            inside({ clipPath: 'inset(0 0% 0 0)', ease: ease(SETTLE) }),
          );
        }

        if (kind === 'vitsoe') {
          gsap.fromTo(
            panel.querySelectorAll('[data-upright]'),
            { scaleY: 0, transformOrigin: '50% 0%' },
            inside({ scaleY: 1, stagger: 0.08, ease: ease(SETTLE) }),
          );

          const shelves = Array.from(panel.querySelectorAll<SVGLineElement>('[data-shelf]'));
          gsap.fromTo(
            shelves,
            { scaleX: 0, transformOrigin: '0% 50%' },
            inside({ scaleX: 1, stagger: 0.07, ease: ease(LEAD) }),
          );

          // Second half of the panel's pass: the shelf configuration changes.
          shelves.forEach((shelf) => {
            const y = shelf.dataset.toY;
            const from = shelf.dataset.toFrom;
            const to = shelf.dataset.toTo;
            if (!y || !from || !to) return;

            gsap.to(shelf, {
              attr: { y1: y, y2: y, x1: from, x2: to },
              ease: ease(SETTLE),
              scrollTrigger: {
                trigger: panel,
                containerAnimation: travel,
                start: 'center 52%',
                end: 'right 20%',
                scrub: 1,
              },
            });
          });
        }
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
          className="reel-track flex flex-col gap-hold px-5 lg:h-screen lg:flex-row lg:gap-0 lg:px-0 lg:will-change-transform"
        >
          {REEL.pieces.map((piece, index) => {
            const Piece = PIECES[index]!;
            return (
              <article
                key={piece.id}
                data-panel
                className="reel-panel flex shrink-0 flex-col justify-center lg:h-screen lg:w-[78vw] lg:px-[6vw]"
              >
                <div className="flex items-baseline justify-between gap-6 border-b border-rule pb-4">
                  <h3 className="display display-wide text-[clamp(1.5rem,2.4vw,2.25rem)] text-bone">{piece.client}</h3>
                  <p className="mark shrink-0">{piece.kind}</p>
                </div>

                <div className="min-h-[52vh] py-[4vh] lg:min-h-0 lg:flex-1">
                  <Piece />
                </div>

                <div className="flex flex-col gap-6 border-t border-rule pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="max-w-measure text-[0.9375rem] leading-relaxed text-grey">{piece.note}</p>
                  <span className="shrink-0 text-grey">
                    <Bezier curve={CURVES[index]!} label={piece.technique} />
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
