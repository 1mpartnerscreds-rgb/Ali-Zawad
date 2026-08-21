import Link from 'next/link';
import { AuditForm } from '@/components/AuditForm';
import { ActClose } from '@/components/cinematic/ActClose';
import { ActMeasure } from '@/components/cinematic/ActMeasure';
import { ActThreshold } from '@/components/cinematic/ActThreshold';
import { ActWork } from '@/components/cinematic/ActWork';
import { Typewriter } from '@/components/Typewriter';
import { ACTS, HOME } from '@/content/site';

/**
 * The homepage as a scroll sequence.
 *
 * Above the fold there is a headline, an input, and one way out — everything
 * cinematic happens after the visitor has had the chance to do the only thing
 * this page is for. A sequence that makes somebody scroll past the product to
 * admire the product is a showreel, not a funnel.
 *
 * All choreography is native CSS scroll-driven animation, so it runs on the
 * compositor and adds no JavaScript. On a site that tells people their site is
 * too slow, buying motion with an animation library would be a bluff.
 */
export default function HomePage() {
  return (
    <>
      <section className="scene relative overflow-hidden">
        {/* A single ember bloom behind the headline. The only light source on
            the page, placed where the eye lands first. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 left-1/2 h-[42rem] w-[42rem] -translate-x-1/2 rounded-full opacity-[0.13] blur-[120px]"
          style={{ background: 'radial-gradient(circle, var(--color-ember) 0%, transparent 68%)' }}
        />

        <div className="relative mx-auto flex min-h-[90vh] max-w-full flex-col justify-center px-6 pt-16 pb-24 lg:px-10">
          <div className="d-recede max-w-[24ch]">
            <p className="eyebrow r-fade">{ACTS.hero.eyebrow}</p>

            <Typewriter text={HOME.heroLine} emphasis="leave" className="font-display mt-7 text-hero font-light" />

            <p className="mt-7 max-w-[34ch] text-lead text-muted">{HOME.heroRest}</p>
          </div>

          <div className="d-recede mt-12 max-w-form">
            <AuditForm />

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
              <p className="font-data text-small text-muted">{HOME.reassurance}</p>
              <Link
                href="/services/launch"
                className="t text-small text-muted underline decoration-line underline-offset-[5px] hover:text-ink hover:decoration-ember"
              >
                {HOME.noSiteLink}
              </Link>
            </div>
          </div>

          <p aria-hidden="true" className="d-recede eyebrow absolute bottom-8 left-6 lg:left-10">
            {ACTS.scrollCue}
          </p>
        </div>
      </section>

      <ActThreshold />
      <ActMeasure />
      <ActWork />
      <ActClose />
    </>
  );
}
