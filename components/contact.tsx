import { Reveal } from '@/components/reveal';
import { CONTACT, SITE } from '@/content/site';

/** One screen. Two ways to reach a person. No form. */
export function Contact() {
  return (
    <section aria-labelledby="contact-mark" className="px-5 pt-hold pb-hold lg:px-8">
      <h2 id="contact-mark" className="mark">
        {CONTACT.marker}
      </h2>

      <Reveal stagger={0.1} className="mt-beat">
        <p className="display text-piece max-w-[16ch] text-bone">
          <span className="wipe">
            <span>{CONTACT.line}</span>
          </span>
        </p>

        <p className="mt-8 max-w-measure text-grey">{CONTACT.body}</p>

        <div className="mt-rest flex flex-col gap-5 sm:flex-row sm:items-baseline sm:gap-12">
          <a
            href={SITE.whatsapp}
            rel="noreferrer"
            className="display display-wide text-say text-bone no-underline transition-opacity duration-500 hover:opacity-55"
          >
            {CONTACT.whatsappLabel}
          </a>
          <a
            href={`mailto:${SITE.email}`}
            className="tech text-[0.95rem] text-grey no-underline transition-colors duration-300 hover:text-bone"
          >
            {SITE.email}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
