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

export interface PsiResult {
  ok: true;
  finalUrl: string;
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
}

export type PsiFailure = { ok: false; reason: 'timeout' | 'unreachable' | 'upstream' | 'blocked' };

interface LighthouseAudit {
  score?: number | null;
  numericValue?: number;
  details?: unknown;
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

  return {
    ok: true,
    finalUrl: lh.finalUrl ?? lh.requestedUrl ?? url,
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
