import type { Metadata } from 'next';
import Link from 'next/link';
import { Cta, Section } from '@/components/bits';
import { Reveal } from '@/components/reveal';
import { CTA, WORK } from '@/content/site';

/* The strongest client story on the site, told at length. The buyer needs
   at least one project he can inspect end to end — the four cards on Home
   prove they exist, and this proves what building one is actually like. */

export const metadata: Metadata = {
  title: 'Cybertech — case study · AIMS Studio',
  description:
    'A training institute running since 2000. Five pages, course listings, admissions and a student login — shipped in nine days.',
};

const piece = WORK.pieces.find((p) => p.id === 'cybertech')!;

export default function Page() {
  return (
    <main>
      <Section className="!pt-beat">
        <p className="mark mb-6">Case study · 01</p>
        <Reveal mode="load" stagger={0.08}>
          <h1 className="display text-[clamp(2.2rem,7vw,5.5rem)] max-w-[16ch] -ml-[0.04em] text-bone">
            <span className="wipe"><span>A training institute,</span></span>
            <span className="wipe"><span>online for the</span></span>
            <span className="wipe"><span>first time.</span></span>
          </h1>
          <p className="wipe mt-8 max-w-measure">
            <span className="block text-[1.1rem] leading-relaxed text-grey">
              Cybertech has been teaching IT and software courses out of Bogura since 2000.
              Twenty-five years of a real business, and no website that showed it.
            </span>
          </p>
        </Reveal>
      </Section>

      <Section>
        <a href={piece.href} rel="noreferrer" className="block no-underline">
          <div className="overflow-hidden border border-rule">
            <img
              src={piece.image}
              srcSet={`${piece.imageSmall} 400w, ${piece.imageMedium} 600w, ${piece.image} 800w`}
              sizes="(min-width: 1024px) 62vw, 100vw"
              alt="The Cybertech website"
              width={1200}
              height={800}
              className="w-full"
            />
          </div>
          <p className="mark mt-4 text-grey">cybertechedu.com</p>
        </a>
      </Section>

      <Section mark="What we built">
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2 max-w-frame">
          <div>
            <h2 className="display display-wide text-[1.2rem] text-bone">The pages</h2>
            <p className="mt-3 max-w-measure text-[0.98rem] leading-relaxed text-grey">
              Home, courses, admissions, contact, and a page for each course. Everything
              a parent looking up a training institute at 10pm needs to find in one tap.
            </p>
          </div>
          <div>
            <h2 className="display display-wide text-[1.2rem] text-bone">Course listings</h2>
            <p className="mt-3 max-w-measure text-[0.98rem] leading-relaxed text-grey">
              Written so a beginner knows what the course is, what it costs and how long
              it takes without having to ring in. The admissions page is the enquiry form.
            </p>
          </div>
          <div>
            <h2 className="display display-wide text-[1.2rem] text-bone">Student login</h2>
            <p className="mt-3 max-w-measure text-[0.98rem] leading-relaxed text-grey">
              Existing students see their course materials, timetable and updates from one
              screen. The institute uses it as a message channel to their whole class.
            </p>
          </div>
          <div>
            <h2 className="display display-wide text-[1.2rem] text-bone">Delivered in nine days</h2>
            <p className="mt-3 max-w-measure text-[0.98rem] leading-relaxed text-grey">
              Not the two-week Launch tier — this was a Build with the extras — but the same
              pattern: one call, half up front, the rest on go-live.
            </p>
          </div>
        </div>
      </Section>

      <Section>
        <figure className="max-w-measure border-l border-accent pl-6">
          <blockquote className="display display-wide text-[clamp(1.35rem,2.4vw,1.85rem)] leading-[1.35] text-bone">
            The sophistication of the design and the sheer quality of execution set a
            new standard for our brand.
          </blockquote>
          <figcaption className="mark mt-5">Managing Director, Cybertech</figcaption>
        </figure>
      </Section>

      <Section mark="Next">
        <p className="display display-wide max-w-[22ch] text-say text-bone">
          If a working site could shift your phone from silent to ringing, we should talk.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Cta href={CTA.callHref}>{CTA.call}</Cta>
          <Cta href="/pricing" tone="line">See what it costs</Cta>
        </div>
        <p className="mt-10 text-[0.95rem] text-grey">
          <Link href="/" className="hover:text-bone">← back to home</Link>
        </p>
      </Section>
    </main>
  );
}
