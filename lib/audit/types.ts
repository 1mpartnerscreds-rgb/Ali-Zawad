import type { Band, Pillar } from './weights';

export type Tier = 'launch' | 'build' | 'scale';

export type FailureReason =
  | 'invalid'
  | 'dns'
  | 'unreachable'
  | 'timeout'
  | 'tls'
  | 'blocked'
  | 'not-html'
  | 'redirect-loop'
  | 'rate-limited'
  | 'upstream';

export interface Finding {
  id: string;
  /** The consequence, in plain language. Always leads. */
  headline: string;
  /** The raw measurement, small and secondary. Never the headline. */
  metric: string;
  severity: 'high' | 'medium' | 'low' | 'good';
  pillar: Pillar;
}

export interface PillarScore {
  pillar: Pillar;
  /** 0..1 */
  value: number;
  /** Points contributed to the composite, out of that pillar's weight. */
  points: number;
  weight: number;
}

export interface Measurements {
  lcpMs: number | null;
  tbtMs: number | null;
  cls: number | null;
  fcpMs: number | null;
  totalBytes: number | null;
  psiPerformance: number | null;
  psiAccessibility: number | null;
  psiBestPractices: number | null;
  psiSeo: number | null;
  hasViewport: boolean;
  contentWidthOk: boolean | null;
  https: boolean;
  contact: { found: boolean; kinds: string[] };
  title: { text: string | null; generic: boolean };
  description: { text: string | null };
  favicon: boolean;
  htmlBytes: number | null;
  /** Signals that this is already an application, not a brochure. */
  appSignals: string[];
  /** Signals that transactions are wanted but absent (booking, buy, pay copy). */
  transactionalIntent: string[];
}

export interface AuditComplete {
  status: 'complete';
  domain: string;
  finalUrl: string;
  score: number;
  band: Band;
  pillars: PillarScore[];
  findings: Finding[];
  tier: Tier;
  tierReason: string;
  measurements: Measurements;
  ranAt: string;
}

/**
 * PageSpeed Insights failed but the page itself answered. We show what we
 * actually measured and withhold the score. A partial audit is honest; a score
 * built from half the inputs is not.
 */
export interface AuditPartial {
  status: 'partial';
  domain: string;
  finalUrl: string;
  findings: Finding[];
  tier: Tier;
  tierReason: string;
  measurements: Measurements;
  ranAt: string;
}

export interface AuditFailed {
  status: 'failed';
  domain: string;
  reason: FailureReason;
  ranAt: string;
}

export type AuditResult = AuditComplete | AuditPartial | AuditFailed;

/** Emitted over the wire while the audit runs. Every line is a real event. */
export interface AuditProgressEvent {
  type: 'progress';
  step: string;
  label: string;
}

export interface AuditDoneEvent {
  type: 'done';
  id: string;
  status: AuditResult['status'];
}

export interface AuditErrorEvent {
  type: 'error';
  reason: FailureReason;
}

export type AuditStreamEvent = AuditProgressEvent | AuditDoneEvent | AuditErrorEvent;
