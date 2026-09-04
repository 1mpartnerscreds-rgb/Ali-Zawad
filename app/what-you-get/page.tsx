import type { Metadata } from 'next';
import { Cta, Lede, Section } from '@/components/bits';
import { CTA, PAGES_DETAIL } from '@/content/site';

export const metadata: Metadata = {
  title: 'What you get — AIMS Studio',
  description: 'The five pages, everything included on every build, and what we do not do.',
};

export default function Page() {
  const d = PAGES_DETAIL;
  return (
    <main>
      <Section className="!pt-block">
        <Lede>{d.head}</Lede>
        <p className="mt-8 max-w-measure text-[1.05rem] leading-relaxed text-grey">{d.lead}</p>
      </Section>

      <Section mark="The five pages">
        <div className="grid gap-x-12 gap-y-9 md:grid-cols-2">
          {d.five.map((p) => (
            <div key={p.n} className="border-t border-rule pt-5">
              <h2 className="display text-[1.25rem] text-ink">{p.n}</h2>
              <p className="mt-2 max-w-measure text-[0.95rem] leading-relaxed text-grey">{p.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section mark="Included on every build">
        <div className="overflow-x-auto">
          <table className="stacktable w-full min-w-[34rem] border-collapse text-left">
            <tbody>
              {d.included.map(([k, v]) => (
                <tr key={k} className="border-b border-rule">
                  <th scope="row" className="w-[15rem] py-4 pr-6 align-top font-medium text-ink">
                    <span className="display text-[1.02rem]">{k}</span>
                  </th>
                  <td className="py-4 align-top text-[0.95rem] text-grey">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section mark="Build tier only · £799">
        <div className="grid gap-8 md:grid-cols-3">
          {d.buildOnly.map((b) => (
            <div key={b.t} className="border-t border-rule pt-5">
              <h2 className="display text-[1.15rem] text-ink">{b.t}</h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-grey">{b.b}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section mark={d.wont.head}>
        <p className="max-w-measure text-[1.05rem] text-grey">{d.wont.lead}</p>
        <div><ul className="mt-8 max-w-measure">
          {d.wont.items.map((i) => (
            <li key={i} className="border-b border-rule py-4 text-[0.98rem] leading-relaxed text-ink/85">
              {i}
            </li>
          ))}
        </ul></div>
        <p className="mt-8 max-w-measure text-[0.95rem] text-grey">{d.wont.close}</p>
        <div className="mt-10"><Cta href="/pricing">{CTA.cost}</Cta></div>
      </Section>
    </main>
  );
}
