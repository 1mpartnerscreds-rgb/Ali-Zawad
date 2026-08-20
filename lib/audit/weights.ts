/**
 * THE SCORING CONFIG. Everything tunable about the AZ Studio score lives here.
 *
 * We do not surface Google's performance number as "the score". Google grades a
 * page as an engineer sees it. A business owner is asking four questions:
 *
 *   1. Does it load before people give up?      -> loads
 *   2. Does it work on a phone?                 -> phone
 *   3. Can a customer actually reach me?        -> reach
 *   4. Can Google find me?                      -> found
 *
 * ...plus two that they only notice when broken: does it look trustworthy
 * (trust), and can everyone use it (usable).
 *
 * PILLAR WEIGHTS SUM TO 100. Each pillar's own parts sum to 1.
 * Tune these numbers; nothing else needs to change.
 */

export const PILLAR_WEIGHTS = {
  loads: 28,
  phone: 18,
  reach: 20,
  found: 16,
  trust: 12,
  usable: 6,
} as const;

export type Pillar = keyof typeof PILLAR_WEIGHTS;

export const PART_WEIGHTS = {
  loads: { lcp: 0.55, tbt: 0.25, cls: 0.2 },
  // Both parts are read straight from the page's own markup, so this pillar
  // never depends on an audit that a given Lighthouse version may not ship.
  phone: { viewport: 0.75, zoom: 0.25 },
  reach: { contactMethod: 1 },
  found: { seoScore: 0.5, title: 0.25, description: 0.25 },
  trust: { https: 0.6, bestPractices: 0.3, favicon: 0.1 },
  usable: { accessibility: 1 },
} as const;

/**
 * Metric thresholds, as [full credit at or below, half credit at, zero credit at
 * or above]. Anchored to Google's own good/needs-improvement/poor boundaries so
 * the numbers we quote can be checked against PageSpeed Insights directly.
 */
export const THRESHOLDS = {
  lcpMs: [2500, 4000, 6500],
  tbtMs: [200, 600, 1500],
  /** Interaction to Next Paint, from real visits. Google's own boundaries. */
  inpMs: [200, 500, 1000],
  cls: [0.1, 0.25, 0.6],
  /** Above this, page weight gets called out as a finding. ~2.5MB. */
  heavyPageBytes: 2_500_000,
} as const;

/** Score bands. The verdict copy for each lives in content/site.ts. */
export const BANDS = {
  poor: [0, 49],
  fair: [50, 79],
  good: [80, 100],
} as const;

export type Band = keyof typeof BANDS;

export function bandFor(score: number): Band {
  if (score <= BANDS.poor[1]) return 'poor';
  if (score <= BANDS.fair[1]) return 'fair';
  return 'good';
}

/**
 * Tier routing.
 *
 * Launch — the basics are broken: it's slow, it fails on a phone, or a customer
 *          can't find a way to contact you. Fix the foundation first.
 * Build  — technically fine, but it's a brochure. Nothing on it can take a
 *          booking, a payment, or a login. The next gain is a transaction.
 * Scale  — either already in good shape, or already an application. The
 *          conversation is about what to build next, not what to repair.
 */
export const ROUTING = {
  /** At or below this composite, the foundation is the problem. */
  launchCeiling: 60,
  /** At or above this composite, nothing is broken enough to lead with. */
  scaleFloor: 80,
  /** Hygiene pillars — a deficit here means Launch even at a decent composite. */
  hygienePillars: ['loads', 'phone', 'reach', 'trust'] as Pillar[],
  /** A hygiene pillar scoring below this is a foundation problem on its own. */
  hygieneFloor: 0.5,
} as const;

/** Linear interpolation across the [good, mid, poor] threshold triple. */
export function curve(value: number, [good, mid, poor]: readonly number[]): number {
  const g = good as number;
  const m = mid as number;
  const p = poor as number;
  if (!Number.isFinite(value)) return 0;
  if (value <= g) return 1;
  if (value >= p) return 0;
  if (value <= m) return 1 - (0.5 * (value - g)) / (m - g);
  return 0.5 - (0.5 * (value - m)) / (p - m);
}
