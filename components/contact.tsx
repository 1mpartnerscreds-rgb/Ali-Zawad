import { Reveal } from '@/components/reveal';
import { CONTACT, SITE } from '@/content/site';

/** One screen, one route in. No form, no phone tree. */
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

        {/* The address itself is the button. A label like "Send an email"
            hides the one thing a buyer wants to see before they commit. */}
        <div className="mt-rest flex flex-col gap-4">
          <a
            href={`mailto:${SITE.email}`}
            className="display display-wide text-say text-bone no-underline transition-opacity duration-500 hover:opacity-55 break-words"
          >
            {SITE.email}
          </a>
          <p className="mark">{CONTACT.replyNote}</p>
        </div>
      </Reveal>
    </section>
  );
}
