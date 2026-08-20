import { FINDING_COPY } from '@/content/findings';
import type { Finding, Measurements, PillarScore, Tier } from './types';
import { PART_WEIGHTS, PILLAR_WEIGHTS, ROUTING, THRESHOLDS, bandFor, curve, type Pillar } from './weights';

/** PSI category scores arrive 0..100; pillars work in 0..1. */
const pct = (value: number | null, fallback = 0.5) => (value == null ? fallback : value / 100);

/**
 * Which speed numbers we are entitled to quote.
 *
 * Lighthouse's lab run simulates a mid-range phone on throttled 4G. It is a
 * stress test, and on a big site it can read 28 seconds where real visitors wait
 * three. Quoting that to a business owner as "what your visitors experience"
 * is the fastest way to have the whole audit dismissed — they will open their
 * own site, see it load, and stop believing everything else on the page.
 *
 * So: when Google has real-visit data for the site, that is what we score and
 * what we quote. Otherwise we fall back to the lab run and every sentence built
 * on it says plainly that it was a simulation.
 */
export interface SpeedReading {
  lcpMs: number | null;
  cls: number | null;
  responseMs: number | null;
  /** INP is measured from real taps; TBT is inferred in the lab. */
  responseKind: 'inp' | 'tbt';
  source: 'field' | 'lab';
  scope: 'page' | 'origin' | null;
}

export function readSpeed(m: Measurements): SpeedReading {
  const f = m.field;
  if (f && f.lcpMs != null) {
    return {
      lcpMs: f.lcpMs,
      cls: f.cls ?? m.cls,
      responseMs: f.inpMs,
      responseKind: 'inp',
      source: 'field',
      scope: f.scope,
    };
  }
  return { lcpMs: m.lcpMs, cls: m.cls, responseMs: m.tbtMs, responseKind: 'tbt', source: 'lab', scope: null };
}

export function scorePillars(m: Measurements): PillarScore[] {
  const p = PART_WEIGHTS;

  const speed = readSpeed(m);
  const responseThreshold = speed.responseKind === 'inp' ? THRESHOLDS.inpMs : THRESHOLDS.tbtMs;
  const loads =
    curve(speed.lcpMs ?? Infinity, THRESHOLDS.lcpMs) * p.loads.lcp +
    curve(speed.responseMs ?? Infinity, responseThreshold) * p.loads.tbt +
    curve(speed.cls ?? Infinity, THRESHOLDS.cls) * p.loads.cls;

  // A viewport pinned to a fixed pixel width is worse than none at all: the page
  // is explicitly told to lay out at desktop size, so it is certainly cut off on
  // a phone. Scored from the markup, so there is no "unknown" to paper over.
  const viewportQuality = m.viewport.deviceWidth ? 1 : m.viewport.fixedWidth != null ? 0 : m.viewport.present ? 0.4 : 0;
  const phone = viewportQuality * p.phone.viewport + (m.viewport.zoomDisabled ? 0 : 1) * p.phone.zoom;

  const reach = (m.contact.found ? 1 : 0) * p.reach.contactMethod;

  const titleScore = m.title.text == null ? 0 : m.title.generic ? 0.35 : 1;
  const found =
    pct(m.psiSeo) * p.found.seoScore + titleScore * p.found.title + (m.description.text ? 1 : 0) * p.found.description;

  const trust =
    (m.https ? 1 : 0) * p.trust.https + pct(m.psiBestPractices) * p.trust.bestPractices + (m.favicon ? 1 : 0) * p.trust.favicon;

  const usable = pct(m.psiAccessibility) * p.usable.accessibility;

  const raw: Record<Pillar, number> = { loads, phone, reach, found, trust, usable };

  return (Object.keys(PILLAR_WEIGHTS) as Pillar[]).map((pillar) => {
    const value = Math.max(0, Math.min(1, raw[pillar]));
    const weight = PILLAR_WEIGHTS[pillar];
    return { pillar, value, weight, points: value * weight };
  });
}

export function compositeScore(pillars: PillarScore[]): number {
  const total = pillars.reduce((sum, p) => sum + p.points, 0);
  return Math.max(0, Math.min(100, Math.round(total)));
}

/**
 * Candidate findings, worst first. We surface three to five: enough to be
 * specific, few enough to act on. If a site has almost nothing wrong we say so
 * rather than padding the list with things that do not matter.
 */
export function buildFindings(m: Measurements, hasPsi: boolean): Finding[] {
  const problems: Finding[] = [];
  const good: Finding[] = [];
  const speed = readSpeed(m);

  const push = (
    list: Finding[],
    id: string,
    pillar: Pillar,
    severity: Finding['severity'],
    copy: { headline: string; metric: string },
  ) => list.push({ id, pillar, severity, ...copy });

  if (!m.https) push(problems, 'https', 'trust', 'high', FINDING_COPY.noHttps());
  // Three distinct ways to be broken on a phone, and they need different fixes,
  // so they are never collapsed into one vague "not mobile friendly" line.
  if (!m.viewport.present) {
    push(problems, 'viewport', 'phone', 'high', FINDING_COPY.noViewport());
  } else if (m.viewport.fixedWidth != null) {
    push(problems, 'viewport-width', 'phone', 'high', FINDING_COPY.viewportFixedWidth(m.viewport.fixedWidth));
  } else if (!m.viewport.deviceWidth) {
    push(problems, 'viewport', 'phone', 'high', FINDING_COPY.noViewport());
  }
  if (m.viewport.zoomDisabled) push(problems, 'zoom', 'phone', 'medium', FINDING_COPY.zoomDisabled());
  if (!m.contact.found) push(problems, 'contact', 'reach', 'high', FINDING_COPY.noContact());

  if (hasPsi && speed.lcpMs != null && speed.lcpMs > THRESHOLDS.lcpMs[0]) {
    push(
      problems,
      'lcp',
      'loads',
      speed.lcpMs > THRESHOLDS.lcpMs[1] ? 'high' : 'medium',
      FINDING_COPY.lcpSlow(speed.lcpMs, speed.source, speed.scope),
    );
  }
  if (m.contentWidthOk === false) push(problems, 'content-width', 'phone', 'high', FINDING_COPY.contentTooWide());
  if (m.title.text == null || m.title.generic) {
    push(problems, 'title', 'found', 'medium', FINDING_COPY.genericTitle(m.title.text));
  }
  // Responsiveness has two possible sources and they are not interchangeable:
  // INP is measured from real taps, TBT is inferred from a lab trace.
  if (hasPsi && speed.responseMs != null) {
    if (speed.responseKind === 'inp' && speed.responseMs > THRESHOLDS.inpMs[0]) {
      push(
        problems,
        'inp',
        'loads',
        speed.responseMs > THRESHOLDS.inpMs[1] ? 'high' : 'medium',
        FINDING_COPY.inpSlow(speed.responseMs, speed.scope),
      );
    } else if (speed.responseKind === 'tbt' && speed.responseMs > THRESHOLDS.tbtMs[0]) {
      push(
        problems,
        'tbt',
        'loads',
        speed.responseMs > THRESHOLDS.tbtMs[1] ? 'high' : 'medium',
        FINDING_COPY.tbtHigh(speed.responseMs),
      );
    }
  }
  if (hasPsi && speed.cls != null && speed.cls > THRESHOLDS.cls[0]) {
    push(problems, 'cls', 'loads', 'medium', FINDING_COPY.clsHigh(speed.cls, speed.source, speed.scope));
  }
  if (!m.description.text) push(problems, 'description', 'found', 'medium', FINDING_COPY.noDescription());
  if (hasPsi && m.totalBytes != null && m.totalBytes > THRESHOLDS.heavyPageBytes) {
    push(problems, 'weight', 'loads', 'medium', FINDING_COPY.heavyPage(m.totalBytes));
  }
  if (hasPsi && m.psiSeo != null && m.psiSeo < 85) push(problems, 'seo', 'found', 'medium', FINDING_COPY.seoWeak(m.psiSeo));
  if (hasPsi && m.psiAccessibility != null && m.psiAccessibility < 80) {
    push(problems, 'a11y', 'usable', 'low', FINDING_COPY.accessibilityWeak(m.psiAccessibility));
  }
  if (m.outsourcedTo.length > 0) {
    push(problems, 'outsourced', 'reach', 'medium', FINDING_COPY.outsourcedPortal(m.outsourcedTo));
  }
  if (!m.favicon) push(problems, 'favicon', 'trust', 'low', FINDING_COPY.noFavicon());

  // Things worth saying out loud when they are right. Used to reach three
  // findings on a healthy site — never to soften a bad one.
  if (hasPsi && speed.lcpMs != null && speed.lcpMs <= THRESHOLDS.lcpMs[0]) {
    push(good, 'lcp-ok', 'loads', 'good', FINDING_COPY.lcpFast(speed.lcpMs, speed.source, speed.scope));
  }
  if (m.contact.found) push(good, 'contact-ok', 'reach', 'good', FINDING_COPY.contactOk(m.contact.kinds));
  if (m.hasViewport && !m.viewport.zoomDisabled && m.contentWidthOk !== false) {
    push(good, 'phone-ok', 'phone', 'good', FINDING_COPY.mobileOk());
  }
  if (m.https && (m.psiBestPractices == null || m.psiBestPractices >= 90)) {
    push(good, 'trust-ok', 'trust', 'good', FINDING_COPY.secureOk());
  }

  const rank = { high: 0, medium: 1, low: 2, good: 3 } as const;
  problems.sort((a, b) => rank[a.severity] - rank[b.severity]);

  const findings = problems.slice(0, 5);
  for (const g of good) {
    if (findings.length >= 3) break;
    findings.push(g);
  }
  return findings.slice(0, 5);
}

export interface TierDecision {
  tier: Tier;
  reason: string;
}

/**
 * One tier, framed as a diagnosis. The reason string has to name the evidence —
 * "because these findings", not "because it is popular".
 */
export function decideTier(score: number | null, pillars: PillarScore[], m: Measurements): TierDecision {
  const byPillar = new Map(pillars.map((p) => [p.pillar, p.value]));
  const brokenHygiene = ROUTING.hygienePillars.filter((p) => (byPillar.get(p) ?? 1) < ROUTING.hygieneFloor);
  const isApp = m.appSignals.length > 0;

  // Order matters, and it took real data to get right. A site that is already
  // an application never routes to Launch, however badly it scores: telling the
  // owner of a working storefront that the answer is "up to 5 pages, $499" is
  // a diagnosis nobody would believe, and rightly.
  if (isApp) {
    if (brokenHygiene.length > 0) {
      return {
        tier: 'scale',
        reason: `This is already an application — we found ${m.appSignals.join(' and ')} — and it is failing on the basics: ${describePillars(brokenHygiene)}. Nothing here wants rebuilding from scratch. What it wants is someone working on it continuously and answerable when it breaks, which is what Scale is.`,
      };
    }
    return {
      tier: 'scale',
      reason: `This is already an application, not a brochure — we found ${m.appSignals.join(' and ')}. Nothing here needs rebuilding from scratch, so the useful conversation is what it should do next and who keeps it running.`,
    };
  }

  if (score != null && score <= ROUTING.launchCeiling) {
    const named = brokenHygiene.length > 0 ? brokenHygiene : (['loads'] as Pillar[]);
    return {
      tier: 'launch',
      reason: `The problems above are foundation problems — ${describePillars(named)}. Adding features on top of this would not help, because visitors are leaving before they reach any feature. Launch rebuilds the foundation properly.`,
    };
  }

  if (brokenHygiene.length > 0) {
    return {
      tier: 'launch',
      reason: `Most of your site is in reasonable shape, but ${describePillars(brokenHygiene)} — and that alone is enough to lose customers who were otherwise ready. Launch fixes exactly this, without touching what already works.`,
    };
  }

  // Nothing broken, and not an application. Their own copy decides it: if the
  // site is already asking people to book or buy, the gap is that it cannot,
  // and that is Build. Scale is reserved for the case where nothing is broken
  // and nothing is obviously missing either — an open conversation rather than
  // a specific job.
  const wants = m.transactionalIntent;
  if (wants.length > 0) {
    return {
      tier: 'build',
      reason: `Your site works, so there is nothing to repair. But it is a brochure: every visitor who wants to act has to leave it and message you. Your own pages are already about ${wants.join(' and ')} — the site just cannot do it yet, and that is the whole gap.`,
    };
  }

  if (score != null && score >= ROUTING.scaleFloor) {
    return {
      tier: 'scale',
      reason:
        'Nothing on your site is broken, so there is no repair job here, and nothing obvious is missing either. The remaining gains are not in fixing pages — they are in what the site could do: systems that run without you, and someone accountable for keeping them up.',
    };
  }

  return {
    tier: 'build',
    reason:
      'Your site works, but it cannot take a booking, a payment or a login. Every customer who is ready has to leave the site and contact you, and most of them will not. The next gain is a site that transacts.',
  };
}

const PILLAR_PHRASE: Record<Pillar, string> = {
  loads: 'it is too slow on a phone',
  phone: 'it does not fit a phone screen',
  reach: 'a customer cannot find a way to contact you',
  found: 'search engines cannot read it properly',
  trust: 'it fails the trust checks browsers run',
  usable: 'parts of it are hard to use',
};

function describePillars(pillars: Pillar[]): string {
  const phrases = pillars.map((p) => PILLAR_PHRASE[p]);
  if (phrases.length === 1) return phrases[0]!;
  return `${phrases.slice(0, -1).join(', ')} and ${phrases[phrases.length - 1]}`;
}

export { bandFor };
