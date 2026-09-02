import type { Metadata } from 'next';
import { Cta, Lede, Section } from '@/components/bits';
import { EnquiryForm } from '@/components/enquiry-form';
import { Stagger } from '@/components/stagger';
import { ABOUT, CTA, SITE, TO_FILL, WORK } from '@/content/site';

export const metadata: Metadata = {
  title: 'About & contact — AIMS Studio',
  description: 'Who you are dealing with, why we only build one thing, and how to reach us.',
};

export default function Page() {
  return (
    <main>
      <Section className="!pt-beat">
        <Lede>{ABOUT.head}</Lede>
      </Section>

      <Section mark={ABOUT.who.head}>
        <p className="display display-wide max-w-[24ch] text-say text-bone">{ABOUT.who.body}</p>
        <p className="mt-8 max-w-measure text-[1.02rem] leading-relaxed text-grey">{ABOUT.who.why}</p>
      </Section>

      <Section mark={WORK.marker}>
        <Stagger className="grid gap-10 sm:grid-cols-2" stagger={0.1}>
          {WORK.pieces.map((p) => (
            <article key={p.id} className="rise">
              <a href={p.href} rel="noreferrer" className="group block no-underline">
                <div className="overflow-hidden border border-rule">
                  <img
                    src={p.image}
                    srcSet={`${p.imageSmall} 400w, ${p.imageMedium} 600w, ${p.image} 800w`}
                    sizes="(min-width: 640px) 44vw, 100vw"
                    alt={`The ${p.client} website`}
                    width={800} height={600} loading="lazy" decoding="async"
                    className="w-full"
                  />
                </div>
                <h2 className="display display-wide mt-5 text-[1.2rem] text-bone">{p.client}</h2>
                <p className="mt-2 text-[0.93rem] leading-relaxed text-grey">{p.note}</p>
                <p className="mark mt-2">{p.host}</p>
              </a>
            </article>
          ))}
        </Stagger>
      </Section>

      <Section mark={ABOUT.narrow.head}>
        <p className="display display-wide max-w-[26ch] text-say text-bone">{ABOUT.narrow.body}</p>
        <p className="mt-8 max-w-measure text-[1.02rem] leading-relaxed text-grey">{ABOUT.narrow.body2}</p>
      </Section>

      <Section mark={ABOUT.privacy.head}>
        <p className="max-w-measure text-[1.02rem] leading-relaxed text-grey">
          {ABOUT.privacy.body}
          {TO_FILL.privacyUrl ? (
            <>
              {' '}
              <a href={TO_FILL.privacyUrl} className="text-bone">
                Our privacy notice
              </a>
              .
            </>
          ) : null}
        </p>
      </Section>

      <Section id="contact" mark="Contact">
        <h2 className="display display-wide max-w-[20ch] text-say text-bone">
          Tell us what your business does.
        </h2>
        <p className="mt-5 max-w-measure text-[1.02rem] text-grey">
          A ten minute call. If a website is not what you need, we will say so.
        </p>

        <div className="mt-beat">
          <EnquiryForm />
        </div>

        <div className="mt-rest flex flex-col gap-6 border-t border-rule pt-10">
          <a
            href={`mailto:${SITE.email}`}
            className="display display-wide text-say text-bone no-underline transition-opacity duration-500 hover:opacity-60"
          >
            {SITE.email}
          </a>
          {TO_FILL.phoneHref ? (
            <a href={`tel:${TO_FILL.phoneHref}`} className="tech text-[1.05rem] text-bone no-underline hover:opacity-70">
              {TO_FILL.phone}
            </a>
          ) : (
            <p className="tech text-[1.05rem] text-grey">{TO_FILL.phone}</p>
          )}
          <p className="mark">Monday to Friday · {TO_FILL.hours} UK time</p>
        </div>
      </Section>
    </main>
  );
}
