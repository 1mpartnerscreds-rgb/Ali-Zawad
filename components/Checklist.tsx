import { CHECKLIST, GROUP_LABELS, GROUP_ORDER, type CheckGroup } from '@/content/checks';
import type { Check } from '@/lib/audit/checks';
import { countChecks } from '@/lib/audit/checks';

/**
 * The full list, under the findings.
 *
 * The findings above answer "what should I do?". This answers "what did you
 * actually look at?" — and being able to answer that is most of why a report
 * gets believed. Failures carry their consequence inline; passes stay quiet, so
 * the eye lands on the short list of things that are wrong.
 */

const MARK: Record<Check['status'], string> = { pass: '✓', fail: '✕', unknown: '–' };
const TONE: Record<Check['status'], string> = {
  pass: 'text-band-good',
  fail: 'text-band-poor',
  unknown: 'text-muted',
};

export function Checklist({ checks }: { checks: Check[] }) {
  if (checks.length === 0) return null;
  const { passed, failed, unknown } = countChecks(checks);

  const grouped = GROUP_ORDER.map((group) => ({
    group,
    items: checks.filter((c) => c.group === group),
  })).filter((g) => g.items.length > 0);

  return (
    <section aria-labelledby="checklist-heading" className="border-t border-line pt-14">
      <h2 id="checklist-heading" className="eyebrow">
        {CHECKLIST.title}
      </h2>

      <p className="mt-4 text-small text-muted">
        {CHECKLIST.intro}{' '}
        <span className="text-ink">
          {passed} passed, {failed} need work
          {unknown > 0 ? `, ${unknown} we couldn't check` : ''}.
        </span>
      </p>

      {grouped.map(({ group, items }) => (
        <Group key={group} group={group} items={items} />
      ))}

      {unknown > 0 ? <p className="mt-10 text-small text-muted">{CHECKLIST.unknownNote}</p> : null}
    </section>
  );
}

function Group({ group, items }: { group: CheckGroup; items: Check[] }) {
  // Failures first inside each group: the reader should not have to hunt.
  const order = { fail: 0, unknown: 1, pass: 2 } as const;
  const sorted = [...items].sort((a, b) => order[a.status] - order[b.status]);

  return (
    <div className="mt-10">
      <h3 className="font-display text-title text-ink">{GROUP_LABELS[group]}</h3>
      <ul className="mt-3">
        {sorted.map((check) => (
          <li key={check.id} className="flex gap-3 py-2">
            <span className={`${TONE[check.status]} font-data shrink-0 pt-[0.2em] text-small select-none`} aria-hidden="true">
              {MARK[check.status]}
            </span>
            <span className="min-w-0">
              <span className="text-body">
                {check.label}
                <span className="sr-only">
                  {' — '}
                  {check.status === 'pass'
                    ? CHECKLIST.passLabel
                    : check.status === 'fail'
                      ? CHECKLIST.failLabel
                      : CHECKLIST.unknownLabel}
                </span>
              </span>
              {check.detail ? <span className="font-data text-small text-dim"> — {check.detail}</span> : null}
              {check.status === 'fail' ? <span className="mt-1 block text-small text-muted">{check.failed}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
