import type { Metadata } from 'next';
import { Cta, Lede, Section } from '@/components/bits';
import { Stagger } from '@/components/stagger';
import { CTA, PAGES_DETAIL } from '@/content/site';

export const metadata: Metadata = {
  title: 'What you get — AIMS Studio',
  description: 'The five pages, everything included on every build, and what we do not do.',
};

export default function Page() {
  const d = PAGES_DETAIL;
  return (
    <main>
      <Section className="!pt-beat">
        <Lede>{d.head}</Lede>
        <p className="mt-8 max-w-measure text-[1.05rem] leading-relaxed text-grey">{d.lead}</p>
      </Section>

      <Section mark="The five pages">
        <Stagger className="grid gap-x-12 gap-y-9 md:grid-cols-2">
          {d.five.map((p) => (
            <div key={p.n} className="rise border-t border-rule pt-5">
              <h2 className="display display-wide text-[1.25rem] text-bone">{p.n}</h2>
              <p className="mt-2 max-w-measure text-[0.95rem] leading-relaxed text-grey">{p.b}</p>
            </div>
          ))}
        </Stagger>
      </Section>

      <Section mark="Included on every build">
        <Stagger className="overflow-x-auto" selector="tbody tr" stagger={0.05}>
          <table className="w-full min-w-[34rem] border-collapse text-left">
            <tbody>
              {d.included.map(([k, v]) => (
                <tr key={k} className="border-b border-rule">
                  <th scope="row" className="w-[15rem] py-4 pr-6 align-top font-medium text-bone">
                    <span className="display display-wide text-[1.02rem]">{k}</span>
                  </th>
                  <td className="py-4 align-top text-[0.95rem] text-grey">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Stagger>
      </Section>

      <Section mark="Build tier only · £799">
        <Stagger className="grid gap-8 md:grid-cols-3">
          {d.buildOnly.map((b) => (
            <div key={b.t} className="rise border-t border-rule pt-5">
              <h2 className="display display-wide text-[1.15rem] text-bone">{b.t}</h2>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-grey">{b.b}</p>
            </div>
          ))}
        </Stagger>
      </Section>

      <Section mark={d.wont.head}>
        <p className="max-w-measure text-[1.05rem] text-grey">{d.wont.lead}</p>
        <Stagger><ul className="mt-8 max-w-measure">
          {d.wont.items.map((i) => (
            <li key={i} className="rise border-b border-rule py-4 text-[0.98rem] leading-relaxed text-bone/85">
              {i}
            </li>
          ))}
        </ul></Stagger>
        <p className="mt-8 max-w-measure text-[0.95rem] text-grey">{d.wont.close}</p>
        <div className="mt-10"><Cta href="/pricing">{CTA.cost}</Cta></div>
      </Section>
    </main>
  );
}
