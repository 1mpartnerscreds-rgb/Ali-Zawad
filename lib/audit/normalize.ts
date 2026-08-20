/**
 * Turning whatever a business owner types into something we can actually fetch.
 *
 * People type "yourwebsite.com", "www.YourWebsite.com/", "https://yourwebsite.com",
 * and "  YOURWEBSITE.COM  ". All four are the same site and must produce the same
 * cache entry and the same shareable audit URL.
 */

export type NormalizeResult =
  | { ok: true; domain: string; url: string }
  | { ok: false; reason: 'empty' | 'shape' | 'local' };

const LABEL = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/** Hosts that are never a customer-facing website and would waste a PSI call. */
const NON_PUBLIC = new Set(['localhost', '127.0.0.1', '0.0.0.0', '::1']);

export function normalizeInput(raw: string): NormalizeResult {
  let value = (raw ?? '').trim().toLowerCase();
  if (!value) return { ok: false, reason: 'empty' };

  // Strip a protocol if they pasted one, plus anything after the host.
  value = value.replace(/^[a-z][a-z0-9+.-]*:\/\//, '');
  value = value.replace(/^\/+/, '');
  // Drop credentials, path, query and hash — we always audit the site root.
  value = value.split('@').pop() ?? value;
  value = value.split(/[/?#]/)[0] ?? value;
  // Drop an explicit port.
  value = value.replace(/:\d+$/, '');
  // Trailing dot on a fully-qualified name.
  value = value.replace(/\.$/, '');

  if (!value) return { ok: false, reason: 'empty' };
  if (NON_PUBLIC.has(value) || value.endsWith('.local')) {
    return { ok: false, reason: 'local' };
  }

  const labels = value.split('.');
  if (labels.length < 2) return { ok: false, reason: 'shape' };
  if (!labels.every((l) => LABEL.test(l))) return { ok: false, reason: 'shape' };

  // A public suffix needs to look like one: at least two characters, no digits.
  const tld = labels[labels.length - 1]!;
  if (tld.length < 2 || !/^[a-z]+$/.test(tld)) return { ok: false, reason: 'shape' };

  return { ok: true, domain: value, url: `https://${value}/` };
}

/**
 * The audit id *is* the normalized domain. That makes the result URL readable,
 * reversible without a lookup table, and worth pasting into an email —
 * alizawad.online/audit/theirsite.com. This is the lead magnet, so the URL
 * itself is part of the pitch.
 */
export function domainToId(domain: string): string {
  return domain;
}

export function idToDomain(id: string): string | null {
  const parsed = normalizeInput(decodeURIComponent(id));
  return parsed.ok ? parsed.domain : null;
}

/** "www.foo.com" and "foo.com" are one business. Used for display only. */
export function displayDomain(domain: string): string {
  return domain.replace(/^www\./, '');
}
