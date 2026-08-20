/**
 * Everything PageSpeed Insights won't tell us, read straight off the HTML.
 *
 * These are the checks a business owner would make if they knew what to look
 * for: can a customer contact me, does the tab say something real, does it work
 * over HTTPS, is there anything here besides a leaflet.
 *
 * We parse with targeted regexes rather than a DOM library. The checks are all
 * presence/absence on a handful of tags, and shipping a parser for that would
 * cost more than it returns.
 */

export interface PageCheckResult {
  ok: true;
  finalUrl: string;
  https: boolean;
  htmlBytes: number;
  hasViewport: boolean;
  contact: { found: boolean; kinds: string[] };
  title: { text: string | null; generic: boolean };
  description: { text: string | null };
  favicon: boolean;
  appSignals: string[];
  transactionalIntent: string[];
}

export type PageCheckFailure = {
  ok: false;
  reason: 'dns' | 'unreachable' | 'timeout' | 'tls' | 'not-html' | 'redirect-loop' | 'blocked';
};

/** Titles that tell a customer nothing. Real examples from real small sites. */
const GENERIC_TITLES = [
  'home',
  'home page',
  'homepage',
  'index',
  'untitled',
  'new page',
  'my site',
  'my website',
  'website',
  'document',
  'welcome',
  'coming soon',
  'site',
  'landing page',
  'react app',
  'next.js app',
  'create next app',
  'vite + react',
  'webflow site',
  'wordpress site',
  'just another wordpress site',
];

const UA =
  'Mozilla/5.0 (compatible; AZStudioAudit/1.0; +https://alizawad.online/audit) Chrome/120 Safari/537.36';

function attr(tag: string, name: string): string | null {
  const m = tag.match(new RegExp(`${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'));
  if (!m) return null;
  return (m[2] ?? m[3] ?? m[4] ?? '').trim();
}

function metaTags(html: string): string[] {
  return html.match(/<meta\b[^>]*>/gi) ?? [];
}

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'")
    .replace(/&nbsp;/g, ' ');
}

function findContact(html: string, lowered: string): { found: boolean; kinds: string[] } {
  const kinds: string[] = [];
  if (/href\s*=\s*["']?tel:/i.test(html)) kinds.push('phone link');
  if (/href\s*=\s*["']?mailto:/i.test(html)) kinds.push('email link');
  if (/(wa\.me\/|api\.whatsapp\.com|whatsapp:\/\/)/i.test(html)) kinds.push('WhatsApp link');
  if (/href\s*=\s*["'][^"']*\/?(contact|get-in-touch|enquiry|inquiry|book)[^"']*["']/i.test(html)) {
    kinds.push('contact page');
  }
  if (/<form\b[^>]*>[\s\S]{0,4000}?type\s*=\s*["']?email/i.test(html)) kinds.push('contact form');
  // A bare phone number in the markup still counts — plenty of small sites just
  // print it in the header without linking it.
  if (kinds.length === 0 && /(\+\d[\d\s().-]{8,17}\d)/.test(lowered.replace(/<[^>]+>/g, ' '))) {
    kinds.push('phone number in the page text');
  }
  return { found: kinds.length > 0, kinds };
}

function findAppSignals(html: string, lowered: string): string[] {
  const signals: string[] = [];
  if (/<input\b[^>]*type\s*=\s*["']?password/i.test(html)) signals.push('a login form');
  if (/\b(sign in|log in|login|my account|dashboard|client portal)\b/.test(lowered)) {
    signals.push('an account area');
  }
  if (/\b(add to cart|checkout|shopping cart|basket|buy now)\b/.test(lowered)) {
    signals.push('a shopping cart');
  }
  if (/(stripe\.com|js\.stripe|paypal\.com\/sdk|razorpay|paddle\.com)/i.test(html)) {
    signals.push('a payment provider');
  }
  if (/(calendly\.com|cal\.com\/|acuityscheduling|squarespace-scheduling)/i.test(html)) {
    signals.push('an online booking tool');
  }
  return signals;
}

function findTransactionalIntent(lowered: string): string[] {
  const wants: string[] = [];
  if (/\b(book (a|an|your)|make (a|an) (booking|appointment)|request a quote|get a quote)\b/.test(lowered)) {
    wants.push('taking bookings');
  }
  if (/\b(order|shop|our products|price list|pricing|packages)\b/.test(lowered)) {
    wants.push('selling online');
  }
  if (/\b(apply now|admission|enrol|enroll|register now|sign up)\b/.test(lowered)) {
    wants.push('taking applications');
  }
  return wants;
}

function classify(error: unknown, signal: AbortSignal): PageCheckFailure['reason'] {
  if (signal.aborted || (error as Error)?.name === 'AbortError') return 'timeout';
  const message = String((error as Error)?.cause ?? (error as Error)?.message ?? '').toLowerCase();
  if (message.includes('enotfound') || message.includes('eai_again') || message.includes('getaddrinfo')) return 'dns';
  if (message.includes('cert') || message.includes('ssl') || message.includes('tls') || message.includes('altname')) {
    return 'tls';
  }
  if (message.includes('redirect')) return 'redirect-loop';
  return 'unreachable';
}

/**
 * Node's fetch gives up on a TCP connect after 10s, inside our own 20s budget,
 * and on dual-stack networks it will burn that whole allowance on an IPv6
 * address that never answers before it ever tries IPv4. A single retry turns a
 * class of false "your site is down" verdicts into correct ones — and telling a
 * business owner their site is down when it is not would be the worst thing this
 * tool could do.
 */
async function fetchPage(url: string, signal: AbortSignal): Promise<Response> {
  try {
    return await fetch(url, {
      signal,
      redirect: 'follow',
      cache: 'no-store',
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' },
    });
  } catch (error) {
    if (signal.aborted || classify(error, signal) !== 'unreachable') throw error;
    return await fetch(url, {
      signal,
      redirect: 'follow',
      cache: 'no-store',
      headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' },
    });
  }
}

export async function checkPage(url: string, signal: AbortSignal): Promise<PageCheckResult | PageCheckFailure> {
  let response: Response;
  try {
    response = await fetchPage(url, signal);
  } catch (error) {
    return { ok: false, reason: classify(error, signal) };
  }

  if (response.status === 403 || response.status === 401 || response.status === 429) {
    return { ok: false, reason: 'blocked' };
  }
  if (response.status >= 500) return { ok: false, reason: 'unreachable' };

  const contentType = response.headers.get('content-type') ?? '';
  if (contentType && !/text\/html|application\/xhtml/i.test(contentType)) {
    return { ok: false, reason: 'not-html' };
  }

  const raw = await response.text();
  if (!/<html|<!doctype html/i.test(raw)) return { ok: false, reason: 'not-html' };

  const html = raw.slice(0, 600_000);
  const lowered = html.toLowerCase();
  const head = html.split(/<\/head>/i)[0] ?? html;

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titleText = titleMatch ? decodeEntities(titleMatch[1]!.replace(/\s+/g, ' ').trim()) : null;
  const generic =
    !titleText ||
    titleText.length < 5 ||
    GENERIC_TITLES.includes(titleText.toLowerCase().replace(/[.\-–—|]+$/, '').trim());

  const metas = metaTags(head);
  const descriptionTag = metas.find((t) => (attr(t, 'name') ?? '').toLowerCase() === 'description');
  const descriptionText = descriptionTag ? decodeEntities((attr(descriptionTag, 'content') ?? '').trim()) : null;
  const hasViewport = metas.some((t) => (attr(t, 'name') ?? '').toLowerCase() === 'viewport');

  const favicon =
    /<link\b[^>]*rel\s*=\s*["']?[^"'>]*\bicon\b/i.test(head) ||
    /<link\b[^>]*rel\s*=\s*["']?apple-touch-icon/i.test(head);

  return {
    ok: true,
    finalUrl: response.url || url,
    https: (response.url || url).startsWith('https://'),
    htmlBytes: Buffer.byteLength(raw, 'utf8'),
    hasViewport,
    contact: findContact(html, lowered),
    title: { text: titleText, generic },
    description: { text: descriptionText && descriptionText.length > 0 ? descriptionText : null },
    favicon,
    appSignals: findAppSignals(html, lowered),
    transactionalIntent: findTransactionalIntent(lowered),
  };
}
