import { RATES } from '@/content/site';

/** Published, in monospace, with no "from" and no fourth tier that says talk to me. */
export function Rates() {
  return (
    <section aria-labelledby="rates-mark" className="px-5 pt-rest pb-hold lg:px-8">
      <h2 id="rates-mark" className="mark">
        {RATES.marker}
      </h2>

      <dl className="mt-beat max-w-frame border-t border-rule">
        {RATES.rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-8 border-b border-rule py-6">
            <dt className="tech text-[0.8125rem] tracking-[0.1em] text-bone uppercase">{row.label}</dt>
            <dd className="tech shrink-0 text-[0.8125rem] tracking-[0.1em] text-grey">
              {row.value}
              <span className="ml-3 text-grey">{RATES.unit}</span>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
