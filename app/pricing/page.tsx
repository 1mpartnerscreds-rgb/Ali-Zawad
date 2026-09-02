import type { Metadata } from 'next';
import { Cta, Lede, Section } from '@/components/bits';
import { Stagger } from '@/components/stagger';
import { CTA, PRICING, TIERS } from '@/content/site';

export const metadata: Metadata = {
  title: 'Pricing — AIMS Studio',
  description: 'Launch £399, Build £799. £99 to start, the balance when it is live and you have approved it.',
};

export default function Page() {
  return (
    <main>
      <Section className="!pt-beat">
        <Lede>{PRICING.head}</Lede>
      </Section>

      <Section>
        <Stagger className="grid gap-12 md:grid-cols-2" stagger={0.12}>
          {TIERS.map((t) => (
            <div key={t.name} className="rise border-t border-rule pt-6">
              <div className="flex items-baseline justify-between gap-4">
                <h2 className="display display-wide text-say text-bone">{t.name}</h2>
                <p className="display text-[clamp(2rem,5vw,3.5rem)] leading-none text-bone tabular-nums">
                  {t.price}
                </p>
              </div>
              <p className="mt-4 max-w-measure text-[0.98rem] text-grey">{t.who}</p>
              <ul className="mt-8">
                {t.includes.map((i) => (
                  <li key={i} className="border-b border-rule py-3 text-[0.95rem] text-bone/85">{i}</li>
                ))}
              </ul>
            </div>
          ))}
        </Stagger>
      </Section>

      <Section mark="Payment">
        <h2 className="display display-wide max-w-[22ch] text-say text-bone">{PRICING.payHead}</h2>
        <p className="mt-6 max-w-measure text-[1.05rem] leading-relaxed text-grey">{PRICING.payLead}</p>

        <Stagger className="mt-10 overflow-x-auto" selector="tbody tr" stagger={0.06}>
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <tbody>
              {PRICING.table.map(([k, v]) => (
                <tr key={k} className="border-b border-rule">
                  <th scope="row" className="w-[19rem] py-4 pr-6 align-top font-medium text-bone">
                    <span className="display display-wide text-[1.02rem]">{k}</span>
                  </th>
                  <td className="py-4 align-top text-[0.95rem] text-grey">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Stagger>

        <div className="mt-beat max-w-measure border-l border-bone pl-6">
          <h3 className="display display-wide text-[1.2rem] text-bone">{PRICING.domain.head}</h3>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-grey">{PRICING.domain.body}</p>
        </div>
      </Section>

      <Section mark={PRICING.safeguards.head}>
        <Stagger><ol className="max-w-measure">
          {PRICING.safeguards.items.map((s, i) => (
            <li key={s} className="rise flex gap-5 border-b border-rule py-5">
              <span className="mark shrink-0 pt-1">{String(i + 1).padStart(2, '0')}</span>
              <span className="text-[0.98rem] leading-relaxed text-bone/85">{s}</span>
            </li>
          ))}
        </ol></Stagger>
        <div className="mt-10"><Cta href="/how-it-works">{CTA.call}</Cta></div>
      </Section>
    </main>
  );
}
