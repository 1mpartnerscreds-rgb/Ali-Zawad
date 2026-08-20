/**
 * Google PageSpeed Insights, mobile strategy.
 *
 * Mobile on purpose: it is the harsher measurement and it is the device the
 * customer is actually holding. Quoting a desktop number to a business owner
 * flatters the site and misleads them.
 *
 * The API works anonymously at low volume; PAGESPEED_API_KEY raises the quota.
 */

const ENDPOINT = 'https://www.googleapis.com/pagespeedonline/v5/runPagespeed';

/**
 * Every check we report on, and the Lighthouse audits that can answer it.
 *
 * Audit ids are not stable across Lighthouse versions. Lighthouse 13 deleted
 * `content-width`, `font-size`, `tap-targets` and `viewport` outright, and
 * renamed much of the performance set to `*-insight`. PageSpeed Insights runs
 * its own version on its own schedule, which is not the one on this machine.
 *
 * So each check names every id that has ever answered it, newest first, and we
 * use the first one actually present in the response. A check whose ids are all
 * absent is reported as unchecked — never as a pass.
 */
export const REPORTED_CHECKS: Record<string, readonly string[]> = {
  // Does it work on a phone
  'viewport-insight': ['viewport-insight'],
  'content-width': ['content-width'],
  'font-size': ['font-size'],
  'tap-targets': ['tap-targets'],
  'meta-viewport': ['meta-viewport'],
  // Does it load
  'server-response-time': ['server-response-time', 'document-latency-insight'],
  'render-blocking-resources': ['render-blocking-insight', 'render-blocking-resources'],
  'uses-responsive-images': ['image-delivery-insight', 'uses-responsive-images', 'modern-image-formats'],
  'uses-text-compression': ['modern-http-insight', 'uses-text-compression'],
  'font-display': ['font-display-insight', 'font-display'],
  'dom-size': ['dom-size-insight', 'dom-size'],
  // Can Google find it
  'is-crawlable': ['is-crawlable'],
  'crawlable-anchors': ['crawlable-anchors'],
  'robots-txt': ['robots-txt'],
  'http-status-code': ['http-status-code'],
  'link-text': ['link-text'],
  // Is it trustworthy
  'is-on-https': ['is-on-https'],
  'errors-in-console': ['errors-in-console'],
  // Can everyone read it
  'color-contrast': ['color-contrast'],
  'image-alt': ['image-alt'],
  'html-has-lang': ['html-has-lang'],
  'unsized-images': ['unsized-images', 'cls-culprits-insight'],
};

/**
 * What real visitors actually experienced, from Google's Chrome UX Report.
 *
 * This is the number that belongs in a sentence beginning "your customers".
 * `scope` says whether it describes this exact page or the site as a whole —
 * a small site often only has enough traffic for an origin-level reading.
 */
export interface FieldData {
  lcpMs: number | null;
  cls: number | null;
  inpMs: number | null;
  scope: 'page' | 'origin';
}

export interface PsiResult {
  ok: true;
  finalUrl: string;
  /** Null when the site has too little traffic for Google to report on. */
  field: FieldData | null;
  categories: {
    performance: number | null;
    accessibility: number | null;
    bestPractices: number | null;
    seo: number | null;
  };
  metrics: {
    lcpMs: number | null;
    tbtMs: number | null;
    cls: number | null;
    fcpMs: number | null;
    totalBytes: number | null;
  };
  contentWidthOk: boolean | null;
  hasViewport: boolean | null;
  /** Audit id -> pass (true), fail (false), or not applicable / not run (null). */
  checks: Record<string, boolean | null>;
  /** Audit id -> Lighthouse's own short summary, e.g. "12 elements found". */
  details: Record<string, string>;
}

export type PsiFailure = { ok: false; reason: 'timeout' | 'unreachable' | 'upstream' | 'blocked' };

interface LighthouseAudit {
  score?: number | null;
  numericValue?: number;
  details?: unknown;
}

interface LoadingExperience {
  metrics?: Record<string, { percentile?: number; category?: string }>;
}

/**
 * CrUX reports the 75th percentile: the experience of the slowest quarter of
 * visits. That is the right one to quote — it is the number that describes the
 * people who are actually giving up, not the median visitor who was fine.
 */
function readField(exp: LoadingExperience | undefined, scope: 'page' | 'origin'): FieldData | null {
  const m = exp?.metrics;
  if (!m) return null;
  const p = (key: string) => {
    const value = m[key]?.percentile;
    return typeof value === 'number' ? value : null;
  };
  const lcpMs = p('LARGEST_CONTENTFUL_PAINT_MS');
  const clsRaw = p('CUMULATIVE_LAYOUT_SHIFT_SCORE');
  const inpMs = p('INTERACTION_TO_NEXT_PAINT');
  if (lcpMs == null && clsRaw == null && inpMs == null) return null;
  // CrUX reports CLS multiplied by 100 — 8 means 0.08.
  return { lcpMs, cls: clsRaw == null ? null : clsRaw / 100, inpMs, scope };
}

function num(audit: LighthouseAudit | undefined): number | null {
  if (!audit || typeof audit.numericValue !== 'number') return null;
  return audit.numericValue;
}

function binary(audit: LighthouseAudit | undefined): boolean | null {
  if (!audit || audit.score == null) return null;
  return audit.score >= 1;
}

export async function runPageSpeed(url: string, signal: AbortSignal): Promise<PsiResult | PsiFailure> {
  const params = new URLSearchParams({ url, strategy: 'mobile' });
  for (const c of ['performance', 'accessibility', 'best-practices', 'seo']) {
    params.append('category', c);
  }
  const key = process.env.PAGESPEED_API_KEY;
  if (key) params.set('key', key);

  let response: Response;
  try {
    response = await fetch(`${ENDPOINT}?${params.toString()}`, {
      signal,
      headers: { accept: 'application/json' },
      cache: 'no-store',
    });
  } catch (error) {
    if (signal.aborted || (error as Error)?.name === 'AbortError') return { ok: false, reason: 'timeout' };
    return { ok: false, reason: 'upstream' };
  }

  if (!response.ok) {
    // PSI reports the target site's own failures as 4xx/5xx on its endpoint, so
    // read the message before deciding whose fault this is.
    let message = '';
    try {
      const body = (await response.json()) as { error?: { message?: string } };
      message = body.error?.message ?? '';
    } catch {
      /* body was not JSON; fall through to a generic upstream failure */
    }
    const lowered = message.toLowerCase();
    if (lowered.includes('unable to reach') || lowered.includes('dns') || lowered.includes('failed to fetch')) {
      return { ok: false, reason: 'unreachable' };
    }
    if (lowered.includes('robots') || lowered.includes('blocked')) return { ok: false, reason: 'blocked' };
    return { ok: false, reason: 'upstream' };
  }

  let payload: {
    lighthouseResult?: {
      finalUrl?: string;
      requestedUrl?: string;
      categories?: Record<string, { score?: number | null }>;
      audits?: Record<string, LighthouseAudit>;
    };
    loadingExperience?: LoadingExperience;
    originLoadingExperience?: LoadingExperience;
  };
  try {
    payload = await response.json();
  } catch {
    return { ok: false, reason: 'upstream' };
  }

  const lh = payload.lighthouseResult;
  const audits = lh?.audits ?? {};
  if (!lh || !lh.categories) return { ok: false, reason: 'upstream' };

  const score = (name: string) => {
    const raw = lh.categories?.[name]?.score;
    return typeof raw === 'number' ? Math.round(raw * 100) : null;
  };

  // Prefer readings for this exact page; fall back to the whole origin, which is
  // often all a small business has enough traffic to produce.
  const field = readField(payload.loadingExperience, 'page') ?? readField(payload.originLoadingExperience, 'origin');

  const checks: Record<string, boolean | null> = {};
  const details: Record<string, string> = {};

  for (const [check, candidates] of Object.entries(REPORTED_CHECKS)) {
    const found = candidates
      .map((id) => audits[id] as (LighthouseAudit & { displayValue?: string }) | undefined)
      .find((audit) => audit != null && audit.score != null);

    // No id present, or present but "notApplicable": both are unchecked. A page
    // with no images has not passed an image test, and recording it as a pass
    // would inflate our own pass rate — the first thing to make a report worthless.
    checks[check] = found?.score == null ? null : found.score >= 0.9;
    if (found?.displayValue) details[check] = found.displayValue;
  }

  return {
    ok: true,
    finalUrl: lh.finalUrl ?? lh.requestedUrl ?? url,
    field,
    checks,
    details,
    categories: {
      performance: score('performance'),
      accessibility: score('accessibility'),
      bestPractices: score('best-practices'),
      seo: score('seo'),
    },
    metrics: {
      lcpMs: num(audits['largest-contentful-paint']),
      tbtMs: num(audits['total-blocking-time']),
      cls: num(audits['cumulative-layout-shift']),
      fcpMs: num(audits['first-contentful-paint']),
      totalBytes: num(audits['total-byte-weight']),
    },
    contentWidthOk: binary(audits['content-width']),
    hasViewport: binary(audits['viewport']),
  };
}
