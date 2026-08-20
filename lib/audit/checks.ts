import { CHECK_COPY, type CheckGroup } from '@/content/checks';
import { readSpeed } from './score';
import type { Measurements } from './types';
import { THRESHOLDS } from './weights';

export interface Check {
  id: string;
  group: CheckGroup;
  label: string;
  /** null when we genuinely could not test it. Never guessed. */
  status: 'pass' | 'fail' | 'unknown';
  /** Shown only on failure: what it costs. */
  failed: string;
  /** Lighthouse's own short summary, when it gives one. */
  detail?: string;
}

/**
 * The complete list of what we tested, for the section under the findings.
 *
 * Three states, not two. A check we could not run is reported as unchecked
 * rather than quietly counted as a pass — a report that pads its own pass rate
 * is worth nothing, and the first time an owner spots one they stop believing
 * the rest of the page.
 */
export function buildChecks(m: Measurements, psiChecks: Record<string, boolean | null>, details: Record<string, string>): Check[] {
  const out: Check[] = [];

  const add = (id: string, status: Check['status'], detail?: string) => {
    const copy = CHECK_COPY[id];
    if (!copy) return;
    out.push({ id, group: copy.group, label: copy.label, failed: copy.failed, status, ...(detail ? { detail } : {}) });
  };

  const fromBool = (value: boolean | null | undefined): Check['status'] =>
    value == null ? 'unknown' : value ? 'pass' : 'fail';

  // --- Things we measured ourselves, straight off the page ---------------
  add('https', fromBool(m.https));
  add('favicon', fromBool(m.favicon));
  add('contact', fromBool(m.contact.found), m.contact.found ? m.contact.kinds.join(', ') : undefined);
  add('outsourced', m.outsourcedTo.length > 0 ? 'fail' : 'pass', m.outsourcedTo.join(', ') || undefined);
  add('title', m.title.text == null || m.title.generic ? 'fail' : 'pass', m.title.text ?? undefined);
  add('description', m.description.text ? 'pass' : 'fail');

  // Viewport is the one check we have two opinions on. Ours is the direct
  // reading of the markup, so it wins; Lighthouse only fills a gap.
  add('viewport', m.viewport.present ? 'pass' : 'fail');
  add(
    'viewport-width',
    m.viewport.deviceWidth ? 'pass' : m.viewport.present || m.viewport.fixedWidth != null ? 'fail' : 'unknown',
    m.viewport.fixedWidth != null ? `pinned to ${m.viewport.fixedWidth}px` : undefined,
  );
  add('zoom', m.viewport.zoomDisabled ? 'fail' : 'pass');

  // --- Core Web Vitals, from whichever source we are entitled to quote ----
  const speed = readSpeed(m);
  const band = (value: number | null, [good]: readonly number[]): Check['status'] =>
    value == null ? 'unknown' : value <= (good as number) ? 'pass' : 'fail';

  add('lcp', band(speed.lcpMs, THRESHOLDS.lcpMs), speed.lcpMs == null ? undefined : `${(speed.lcpMs / 1000).toFixed(1)}s`);
  add(
    'response',
    band(speed.responseMs, speed.responseKind === 'inp' ? THRESHOLDS.inpMs : THRESHOLDS.tbtMs),
    speed.responseMs == null ? undefined : `${Math.round(speed.responseMs)}ms`,
  );
  add('cls', band(speed.cls, THRESHOLDS.cls), speed.cls == null ? undefined : speed.cls.toFixed(2));
  add(
    'weight',
    m.totalBytes == null ? 'unknown' : m.totalBytes <= THRESHOLDS.heavyPageBytes ? 'pass' : 'fail',
    m.totalBytes == null ? undefined : `${(m.totalBytes / 1_000_000).toFixed(1)}MB`,
  );

  // --- Everything Lighthouse checked -------------------------------------
  for (const [id, value] of Object.entries(psiChecks)) {
    if (id === 'viewport') continue; // already covered by our own reading
    add(id, fromBool(value), details[id]);
  }

  return out;
}

export function countChecks(checks: Check[]) {
  return {
    passed: checks.filter((c) => c.status === 'pass').length,
    failed: checks.filter((c) => c.status === 'fail').length,
    unknown: checks.filter((c) => c.status === 'unknown').length,
  };
}
