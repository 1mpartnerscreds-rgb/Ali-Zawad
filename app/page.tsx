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
 * The rule the original brief set still holds even here: above the fold there
 * is a headline, an input, and one way out. Everything cinematic happens after
 * the visitor has had the chance to do the only thing this page is for. A
 * sequence that makes somebody scroll past the product to admire the product is
 * a showreel, not a funnel.
 *
 * All choreography is native CSS scroll-driven animation — `view()` and named
 * view timelines — so it runs on the compositor and adds no JavaScript. On a
 * site that tells people their site is too slow, buying motion with a 70KB
 * animation library would have made the argument a bluff.
 */
export default function HomePage() {
  return (
    <>
      <section className="scene relative mx-auto flex min-h-[92vh] max-w-text flex-col justify-center px-6 pt-20 pb-24">
        <div className="d-recede">
          <Typewriter text={HOME.headline} className="display-lg font-regular text-balance" />

          <AuditForm />

          <p className="mt-5 text-small text-muted">{HOME.reassurance}</p>

          <p className="mt-6">
            <Link
              href="/services/launch"
              className="t text-small text-muted underline underline-offset-4 hover:text-ink"
            >
              {HOME.noSiteLink}
            </Link>
          </p>
        </div>

        <p
          aria-hidden="true"
          className="d-recede absolute bottom-8 left-6 text-small tracking-[0.14em] text-muted uppercase"
        >
          {ACTS.scrollCue}
        </p>
      </section>

      <ActThreshold />
      <ActMeasure />
      <ActWork />
      <ActClose />
    </>
  );
}
