'use client';

import { useEffect, useRef } from 'react';
import { LEAD, SETTLE, armGsap, ease, prefersStill } from '@/components/motion';
import { PRICES } from '@/content/site';

/**
 * The price, assembling.
 *
 * This is the moment the whole page is walking toward, so it is the one section
 * that is built rather than revealed: the figure sets itself digit by digit, and
 * each line of what you get draws its own rule before the words arrive behind
 * it. A scan line runs down the column as it goes, which is what makes it read
 * as being counted out rather than merely appearing.
 *
 * Scrubbed, not triggered — the buyer drives the assembly, so it happens at
 * exactly the speed they are reading. Nothing is pinned: a pin spacer here would
 * break the paper surface the section is printed on.
 */
export function Prices() {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = host.current;
    if (!el || prefersStill()) return;

    const gsap = armGsap();

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>('[data-tier]', el).forEach((tier, index) => {
        const scrubbed = (extra: gsap.TweenVars = {}) => ({
          scrollTrigger: {
            trigger: tier,
            start: 'top 88%',
            end: 'top 30%',
            scrub: 1,
            ...(extra.scrollTrigger as object),
          },
        });

        gsap.fromTo(
          tier.querySelectorAll('[data-digit]'),
          { yPercent: 115 },
          { yPercent: 0, ease: ease(LEAD), stagger: 0.07, ...scrubbed() },
        );

        gsap.fromTo(
          tier.querySelector('[data-tier-name]'),
          { yPercent: 112 },
          { yPercent: 0, ease: ease(LEAD), ...scrubbed() },
        );

        // Each row: the rule draws, then the words come up out of it.
        gsap.fromTo(
          tier.querySelectorAll('[data-row-rule]'),
          { scaleX: 0 },
          { scaleX: 1, ease: ease(SETTLE), stagger: 0.055, ...scrubbed() },
        );
        gsap.fromTo(
          tier.querySelectorAll('[data-row-text]'),
          { yPercent: 108, opacity: 0 },
          { yPercent: 0, opacity: 1, ease: ease(LEAD), stagger: 0.055, ...scrubbed() },
        );

        // The scan line travels the column while it assembles.
        gsap.fromTo(
          tier.querySelector('[data-scan]'),
          { top: '0%', opacity: 0 },
          {
            top: '100%',
            opacity: 1,
            ease: 'none',
            scrollTrigger: { trigger: tier, start: 'top 88%', end: 'bottom 45%', scrub: 1 },
          },
        );

        // The second tier trails the first, so they read in order.
        if (index === 1) gsap.set(tier, { transformOrigin: '0% 50%' });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section aria-labelledby="price-mark" className="inverted px-5 pt-hold pb-hold lg:px-8" ref={host}>
      <h2 id="price-mark" className="mark">
        {PRICES.marker}
      </h2>

      <div className="mt-beat grid gap-20 lg:grid-cols-2 lg:gap-24">
        {PRICES.tiers.map((tier) => (
          <div key={tier.name} data-tier className="relative border-t border-rule pt-8">
            {/* The scan line. Decorative, and the only moving thing that is not type. */}
            <span
              aria-hidden="true"
              data-scan
              className="pointer-events-none absolute right-0 left-0 h-px bg-bone/25"
              style={{ top: 0 }}
            />

            <div className="flex items-baseline justify-between gap-6">
              <h3 className="display display-wide text-say overflow-hidden text-bone">
                <span data-tier-name className="block">
                  {tier.name}
                </span>
              </h3>

              <p className="display flex text-[clamp(2.75rem,6.5vw,5rem)] leading-none text-bone tabular-nums">
                {/* aria-label is prohibited on a generic <p>. The price is read
                    from a visually-hidden span instead, and the split digits are
                    hidden from assistive tech. */}
                <span className="sr-only">{tier.price}</span>
                {[...tier.price].map((character, i) => (
                  <span key={`${character}-${i}`} aria-hidden="true" className="block overflow-hidden">
                    <span data-digit className="block">
                      {character}
                    </span>
                  </span>
                ))}
              </p>
            </div>

            <p className="mark mt-3">{tier.note}</p>

            <ul className="mt-10">
              {tier.includes.map((item) => (
                <li key={item} className="relative pt-3.5 pb-3.5">
                  <span
                    aria-hidden="true"
                    data-row-rule
                    className="absolute inset-x-0 bottom-0 block h-px origin-left bg-rule"
                  />
                  <span className="block overflow-hidden">
                    <span data-row-text className="block text-[0.95rem] text-bone/85">
                      {item}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <p className="mark mt-rest">{PRICES.foot}</p>
    </section>
  );
}
