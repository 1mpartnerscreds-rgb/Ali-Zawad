import { Logo } from '@/components/logo';
import { Reveal } from '@/components/reveal';
import { OPENING } from '@/content/site';

export function Opening() {
  return (
    <header className="relative flex min-h-[100svh] flex-col justify-between overflow-hidden px-5 pt-6 pb-24 lg:px-8 lg:pt-8">
      {/* The mark sits centred in the top bar. The badge is decorative; the
          wordmark under it is the accessible name, set in the site's own mono
          rather than the artwork's baked-in lettering so it stays crisp and
          matches every other label on the page. */}
      <p className="flex flex-col items-center gap-2.5 text-bone">
        <Logo className="h-9 w-9 lg:h-10 lg:w-10" />
        <span className="mark">{OPENING.wordmark}</span>
      </p>

      <Reveal mode="load" delay={0.15} stagger={0.09}>
        <h1
          className="display text-statement -ml-[0.055em] max-w-none whitespace-nowrap text-bone"
          aria-label={OPENING.statement.join(' ')}
        >
          {OPENING.statement.map((line) => (
            <span key={line} aria-hidden="true" className="wipe">
              <span>{line}</span>
            </span>
          ))}
        </h1>

        <p className="wipe mt-10 max-w-measure">
          <span className="block text-[1.05rem] leading-relaxed text-grey sm:text-[1.2rem]">{OPENING.sub}</span>
        </p>
      </Reveal>

      <span aria-hidden="true" />
    </header>
  );
}
