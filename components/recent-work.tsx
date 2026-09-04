'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { armGsap, prefersStill } from '@/components/motion';
import { WORK } from '@/content/site';

/**
 * The evidence section.
 *
 * On About it sat as a static grid, which was fine for browsing but did no
 * work for a first-time visitor. Placed higher on Home it has to earn its
 * place, so each card carries an ambient hover: the screenshot inside
 * counter-scales while the caption slides. On the phone none of that runs
 * — the ambient motion is a desktop reward and takes the tap area with it
 * if you try to apply it to a touch.
 */
export function RecentWork({ compact = false }: { compact?: boolean }) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || prefersStill()) return;
    if (!window.matchMedia('(hover: hover)').matches) return;

    const gsap = armGsap();
    const cards = Array.from(el.querySelectorAll<HTMLElement>('[data-card]'));

    const cleanup: Array<() => void> = [];
    cards.forEach((card) => {
      const shot = card.querySelector<HTMLElement>('[data-shot]');
      if (!shot) return;
      const enter = () => gsap.to(shot, { scale: 1.06, duration: 0.9, ease: 'power2.out' });
      const leave = () => gsap.to(shot, { scale: 1, duration: 1.1, ease: 'power2.out' });
      card.addEventListener('mouseenter', enter);
      card.addEventListener('mouseleave', leave);
      cleanup.push(() => {
        card.removeEventListener('mouseenter', enter);
        card.removeEventListener('mouseleave', leave);
      });
    });
    return () => cleanup.forEach((fn) => fn());
  }, []);

  return (
    <div
      ref={host}
      className={`grid gap-x-6 gap-y-10 sm:grid-cols-2 ${compact ? 'lg:grid-cols-4 lg:gap-x-5' : ''}`}
    >
      {WORK.pieces.map((p) => (
        <article key={p.id} data-card className="group">
          <a href={p.href} rel="noreferrer" className="block no-underline">
            {/* The image is oversized inside a clipped frame, so the hover
                scale reads as parallax rather than as the picture growing. */}
            <div className="relative overflow-hidden border border-rule">
              <img
                data-shot
                src={p.image}
                srcSet={`${p.imageSmall} 400w, ${p.imageMedium} 600w, ${p.image} 800w`}
                sizes={compact ? '(min-width: 1024px) 22vw, (min-width: 640px) 44vw, 100vw' : '(min-width: 640px) 44vw, 100vw'}
                alt={`The ${p.client} website`}
                width={800}
                height={600}
                loading="lazy"
                decoding="async"
                className="w-full will-change-transform"
              />
              {/* A subtle veil, so type on top of the image edge stays legible
                  no matter what the screenshot happens to contain. */}
              <span aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/40 to-transparent" />
            </div>
            <div className="mt-4 flex items-baseline justify-between gap-4">
              <h3 className="display text-[1.05rem] text-ink">{p.client}</h3>
              <span className="label text-grey">{p.host}</span>
            </div>
            {!compact ? <p className="mt-2 max-w-measure text-[0.93rem] leading-relaxed text-grey">{p.note}</p> : null}
          </a>
        </article>
      ))}
    </div>
  );
}
