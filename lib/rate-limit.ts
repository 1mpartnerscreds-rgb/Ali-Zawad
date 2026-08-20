/**
 * IP rate limiting for the audit endpoint.
 *
 * This endpoint calls a third-party API on demand, so it is trivially abusable.
 *
 * Deliberately dependency-free: the counters live in the process, which means
 * the limit is per serverless instance rather than global. That is a real
 * limitation and worth naming — it slows a casual abuser down by an order of
 * magnitude but will not stop a distributed one. If audit volume ever justifies
 * it, swap the Map for Vercel KV; the call signature below does not change.
 */

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

/** Bounds memory on a long-lived instance. Evicts the oldest expired entries. */
const MAX_BUCKETS = 5000;

export interface RateLimitOptions {
  limit: number;
  windowMs: number;
}

export interface RateLimitVerdict {
  ok: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, { limit, windowMs }: RateLimitOptions): RateLimitVerdict {
  const now = Date.now();

  if (buckets.size > MAX_BUCKETS) {
    for (const [k, b] of buckets) {
      if (b.resetAt <= now) buckets.delete(k);
      if (buckets.size <= MAX_BUCKETS) break;
    }
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  return {
    ok: existing.count <= limit,
    remaining,
    retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000),
  };
}

/** Vercel and most proxies put the real client first in x-forwarded-for. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get('x-forwarded-for');
  if (forwarded) return forwarded.split(',')[0]!.trim();
  return headers.get('x-real-ip') ?? 'unknown';
}

export const AUDIT_LIMIT: RateLimitOptions = { limit: 12, windowMs: 10 * 60 * 1000 };
