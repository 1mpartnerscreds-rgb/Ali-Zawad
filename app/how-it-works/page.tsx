import type { Metadata } from 'next';
import { Cta, Lede, Section } from '@/components/bits';
import { CTA, PROCESS } from '@/content/site';

export const metadata: Metadata = {
  title: 'How it works — AIMS Studio',
  description: 'Two weeks, five stages. You are needed for about ninety minutes of it.',
};

export default function Page() {
  return (
    <main>
      <Section className="!pt-beat">
        <Lede>{PROCESS.head}</Lede>
      </Section>

      <Section>
        <div><ol>
          {PROCESS.steps.map((s) => (
            <li key={s.d} className="grid gap-x-10 gap-y-2 border-t border-rule py-8 md:grid-cols-[9rem_1fr]">
              <p className="mark pt-1">{s.d}</p>
              <div>
                <h2 className="display display-wide text-[1.35rem] text-bone">{s.t}</h2>
                <p className="mt-3 max-w-measure text-[0.98rem] leading-relaxed text-grey">{s.b}</p>
              </div>
            </li>
          ))}
        </ol></div>
        <p className="mt-8 text-[0.98rem] text-bone">{PROCESS.after}</p>
      </Section>

      <Section mark={PROCESS.who.head}>
        <p className="display display-wide max-w-[24ch] text-say text-bone">{PROCESS.who.body}</p>
        <p className="mt-6 max-w-measure text-[0.98rem] text-grey">{PROCESS.who.hours}</p>
        <div className="mt-10"><Cta href={CTA.callHref}>{CTA.call}</Cta></div>
      </Section>
    </main>
  );
}
