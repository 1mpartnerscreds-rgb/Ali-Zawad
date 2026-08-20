import { unstable_cache } from 'next/cache';
import { buildChecks } from './checks';
import { checkPage } from './page-checks';
import { runPageSpeed } from './psi';
import { buildFindings, compositeScore, decideTier, scorePillars } from './score';
import type { AuditFailed, AuditProgressEvent, AuditResult, FailureReason, Measurements } from './types';
import { bandFor } from './weights';

/** Hard ceiling on the whole audit. Past this, the visitor has stopped caring. */
const TIMEOUT_MS = 20_000;
const CACHE_SECONDS = 60 * 60 * 24;

type Emit = (event: AuditProgressEvent) => void;

/**
 * Progress plumbing.
 *
 * `unstable_cache` gives us a 24h result cache with no external service, but it
 * takes a plain function — there is nowhere to thread a callback through. So the
 * streaming route registers a listener under the domain before it calls, and the
 * runner publishes to it. Same process, same request, so this is safe: if the
 * result was cached the runner never executes and no lines are emitted, which is
 * exactly right. A cached audit must appear instantly, never on a staged delay.
 */
const channels = new Map<string, Emit>();

export function openProgressChannel(domain: string, emit: Emit): () => void {
  channels.set(domain, emit);
  return () => channels.delete(domain);
}

class AuditFailure extends Error {
  constructor(readonly reason: FailureReason) {
    super(reason);
  }
}

export async function runAuditUncached(domain: string): Promise<AuditResult> {
  const emit: Emit = (event) => channels.get(domain)?.(event);
  const url = `https://${domain}/`;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    emit({ type: 'progress', step: 'fetch', label: `Reaching ${domain}` });

    // Both calls are network-bound and independent, so they overlap. The status
    // lines report whichever finishes first — they are events, not a script.
    const pagePromise = checkPage(url, controller.signal).then((r) => {
      emit({
        type: 'progress',
        step: 'html',
        label: r.ok ? 'Reading the page markup' : 'Could not read the page',
      });
      return r;
    });

    emit({ type: 'progress', step: 'psi', label: 'Measuring load time on a mobile connection' });
    const psiPromise = runPageSpeed(url, controller.signal).then((r) => {
      emit({
        type: 'progress',
        step: 'psi-done',
        label: r.ok ? 'Load time measured' : 'Load measurement unavailable',
      });
      return r;
    });

    const [page, psi] = await Promise.all([pagePromise, psiPromise]);

    // If the page itself never answered, there is no audit to give. PSI's own
    // opinion is not a substitute for the site being reachable.
    if (!page.ok) {
      // PSI reaching a site our fetch could not usually means we were blocked,
      // not that the site is down. Say the more accurate of the two.
      if (psi.ok && page.reason !== 'not-html') throw new AuditFailure('blocked');
      throw new AuditFailure(page.reason);
    }

    emit({ type: 'progress', step: 'contact', label: 'Looking for a way to contact you' });
    emit({ type: 'progress', step: 'mobile', label: 'Checking mobile rendering' });

    const measurements: Measurements = {
      field: psi.ok ? psi.field : null,
      lcpMs: psi.ok ? psi.metrics.lcpMs : null,
      tbtMs: psi.ok ? psi.metrics.tbtMs : null,
      cls: psi.ok ? psi.metrics.cls : null,
      fcpMs: psi.ok ? psi.metrics.fcpMs : null,
      totalBytes: psi.ok ? psi.metrics.totalBytes : null,
      psiPerformance: psi.ok ? psi.categories.performance : null,
      psiAccessibility: psi.ok ? psi.categories.accessibility : null,
      psiBestPractices: psi.ok ? psi.categories.bestPractices : null,
      psiSeo: psi.ok ? psi.categories.seo : null,
      hasViewport: page.hasViewport,
      viewport: page.viewport,
      contentWidthOk: psi.ok ? psi.contentWidthOk : null,
      https: page.https,
      contact: page.contact,
      title: page.title,
      description: page.description,
      favicon: page.favicon,
      htmlBytes: page.htmlBytes,
      appSignals: page.appSignals,
      transactionalIntent: page.transactionalIntent,
      outsourcedTo: page.outsourcedTo,
    };

    const findings = buildFindings(measurements, psi.ok);
    const checks = buildChecks(measurements, psi.ok ? psi.checks : {}, psi.ok ? psi.details : {});
    const ranAt = new Date().toISOString();
    const finalUrl = page.finalUrl;

    // No load measurements means no composite score. A number built from half
    // the inputs would look like the same number, and it would not be.
    if (!psi.ok) {
      // Route on the pillars we actually measured. `loads` is dropped rather
      // than scored as zero: we did not measure it, and a missing measurement
      // must never read as a failed one.
      const measured = scorePillars(measurements).filter((p) => p.pillar !== 'loads');
      const { tier, reason } = decideTier(null, measured, measurements);
      return { status: 'partial', domain, finalUrl, findings, tier, tierReason: reason, measurements, checks, ranAt };
    }

    emit({ type: 'progress', step: 'score', label: 'Scoring' });
    const pillars = scorePillars(measurements);
    const score = compositeScore(pillars);
    const { tier, reason } = decideTier(score, pillars, measurements);

    return {
      status: 'complete',
      domain,
      finalUrl,
      score,
      band: bandFor(score),
      pillars,
      findings,
      tier,
      tierReason: reason,
      measurements,
      checks,
      ranAt,
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Throwing on failure is deliberate: `unstable_cache` does not store a rejected
 * call, so a dead domain is retried next time instead of being wrong for a day.
 */
const cachedAudit = unstable_cache(
  async (domain: string): Promise<AuditResult> => {
    const result = await runAuditUncached(domain);
    if (result.status === 'failed') throw new AuditFailure(result.reason);
    return result;
  },
  ['az-audit-v1'],
  { revalidate: CACHE_SECONDS, tags: ['audit'] },
);

export async function getAudit(domain: string): Promise<AuditResult> {
  try {
    return await cachedAudit(domain);
  } catch (error) {
    const failed: AuditFailed = {
      status: 'failed',
      domain,
      reason: error instanceof AuditFailure ? error.reason : 'unreachable',
      ranAt: new Date().toISOString(),
    };
    return failed;
  }
}
