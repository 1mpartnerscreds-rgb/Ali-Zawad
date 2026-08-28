import { Reveal } from '@/components/reveal';
import { CONTACT, SITE } from '@/content/site';

/** One address, at display scale. No form, no embed, no widget. */
export function Contact() {
  return (
    <section aria-labelledby="contact-mark" className="inverted px-5 pt-hold pb-hold lg:px-8">
      <h2 id="contact-mark" className="mark">
        {CONTACT.marker}
      </h2>

      <Reveal stagger={0.1} className="mt-beat">
        <p className="display text-piece max-w-[18ch] text-bone">
          <span className="wipe">
            <span>{CONTACT.line}</span>
          </span>
        </p>

        <p className="mt-rest">
          <span className="wipe">
            <a
              href={`mailto:${SITE.email}`}
              className="display inline-block text-piece text-bone no-underline transition-opacity duration-500 hover:opacity-55"
            >
              {SITE.email}
            </a>
          </span>
        </p>
      </Reveal>
    </section>
  );
}
