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
  viewport: ViewportSetup;
  contact: { found: boolean; kinds: string[] };
  title: { text: string | null; generic: boolean };
  description: { text: string | null };
  favicon: boolean;
  appSignals: string[];
  transactionalIntent: string[];
  /** Hosts this site sends customers to for things it cannot do itself. */
  outsourcedTo: string[];
}

/**
 * How the page is configured for phone screens.
 *
 * Lighthouse 13 removed content-width, font-size and tap-targets, so the
 * "is this cut off on a phone?" question no longer has an answer from Google.
 * It does have one here. A viewport tag pinned to a fixed pixel width is a
 * guarantee that the site is chopped on a phone — the browser is being told to
 * lay out at desktop size and let the screen crop it.
 */
export interface ViewportSetup {
  present: boolean;
  /** Scales to the device. The one correct setting. */
  deviceWidth: boolean;
  /** A hardcoded width, e.g. `width=1024`. Guarantees sideways scrolling. */
  fixedWidth: number | null;
  /** Pinch-zoom blocked, so a visitor cannot rescue a cramped layout. */
  zoomDisabled: boolean;
}

function readViewport(head: string): ViewportSetup {
  const tag = metaTags(head).find((t) => (attr(t, 'name') ?? '').toLowerCase() === 'viewport');
  if (!tag) return { present: false, deviceWidth: false, fixedWidth: null, zoomDisabled: false };

  const content = (attr(tag, 'content') ?? '').toLowerCase();
  const directive = (key: string) => content.match(new RegExp(`${key}\\s*=\\s*([^,;\\s]+)`))?.[1] ?? null;

  const width = directive('width');
  const maximumScale = Number(directive('maximum-scale') ?? NaN);
  const userScalable = directive('user-scalable');

  return {
    present: true,
    deviceWidth: width === 'device-width',
    fixedWidth: width && /^\d+$/.test(width) ? Number(width) : null,
    zoomDisabled: userScalable === 'no' || userScalable === '0' || (Number.isFinite(maximumScale) && maximumScale < 5),
  };
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

/**
 * Strip everything a visitor never reads before doing any text matching.
 *
 * Searching raw markup for words like "login" or "pricing" means matching them
 * inside a JavaScript bundle, a CSS rule (`order: 1`), or an HTML comment. Every
 * text-level check below runs on this cleaned copy; checks that legitimately
 * need markup (href targets, input types) run on the original.
 */
function visibleText(html: string): string {
  return html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ');
}

interface Link {
  href: string;
  text: string;
  /** Same *company*, not merely the same host. See registrableDomain. */
  sameSite: boolean;
}

/**
 * Multi-part public suffixes we care about, so "example.com.bd" is not read as
 * the site "com.bd". This is a pragmatic subset of the public suffix list —
 * enough to cover the markets this actually serves, without a dependency that
 * ships a megabyte of TLD data to answer one question.
 */
const MULTI_PART_SUFFIXES = new Set([
  'com.bd', 'net.bd', 'org.bd', 'edu.bd', 'gov.bd', 'ac.bd',
  'co.uk', 'org.uk', 'ac.uk', 'gov.uk', 'me.uk',
  'com.au', 'net.au', 'org.au', 'edu.au',
  'co.in', 'net.in', 'org.in', 'com.br', 'com.mx', 'com.ar',
  'co.jp', 'or.jp', 'ne.jp', 'co.kr', 'co.za', 'co.nz', 'com.sg', 'com.my', 'com.pk',
]);

/**
 * The company that owns a host. `accounts.nike.com` and `www.nike.com` are the
 * same business; `cuttingedgelawncare.manageandpaymyaccount.com` and the lawn
 * care site are not. That difference decides whether an account link counts as
 * this site's own application or as a handoff to somebody else's, so getting it
 * wrong changes the recommendation.
 */
function registrableDomain(host: string): string {
  const labels = host.toLowerCase().replace(/^www\./, '').split('.');
  if (labels.length <= 2) return labels.join('.');
  const lastTwo = labels.slice(-2).join('.');
  return MULTI_PART_SUFFIXES.has(lastTwo) ? labels.slice(-3).join('.') : lastTwo;
}

/** Every <a> with its visible label and whether it stays on this site. */
function extractLinks(html: string, baseUrl: string): Link[] {
  const site = (() => {
    try {
      return registrableDomain(new URL(baseUrl).host);
    } catch {
      return '';
    }
  })();

  // Match the opening tag, then take the text up to the closing tag separately.
  // A single combined pattern has to bound how much markup may sit inside a
  // link, and any bound is wrong: GitHub nests well over a kilobyte inside its
  // sign-in anchor, and capping at a couple of hundred characters silently threw
  // away almost every link on the page.
  const links: Link[] = [];
  const openTag = /<a\b([^>]*)>/gi;
  let match: RegExpExecArray | null;

  while ((match = openTag.exec(html)) !== null) {
    const href = attr(match[0], 'href');
    if (!href) continue;

    const close = html.indexOf('</a', openTag.lastIndex);
    const inner = close === -1 ? '' : html.slice(openTag.lastIndex, close);

    const resolved = decodeEntities(href);
    let sameSite = true;
    try {
      sameSite = registrableDomain(new URL(resolved, baseUrl).host) === site;
    } catch {
      sameSite = true; // relative or malformed — treat as on-site
    }
    links.push({ href: resolved, text: visibleText(inner).trim(), sameSite });
  }

  return links;
}

/** Link and button labels only — the things a visitor can actually act on. */
function actionLabels(html: string, links: Link[]): string {
  const buttons = [...html.matchAll(/<button\b[^>]*>([\s\S]{0,200}?)<\/button>/gi)].map((m) => visibleText(m[1] ?? ''));
  const inputs = [...html.matchAll(/<input\b[^>]*type\s*=\s*["']?(?:submit|button)["']?[^>]*>/gi)].map(
    (m) => attr(m[0], 'value') ?? '',
  );
  const headings = [...html.matchAll(/<h[1-3]\b[^>]*>([\s\S]{0,200}?)<\/h[1-3]>/gi)].map((m) => visibleText(m[1] ?? ''));
  return [...links.map((l) => l.text), ...buttons, ...inputs, ...headings].join(' | ').toLowerCase();
}

function findContact(html: string, text: string, links: Link[]): { found: boolean; kinds: string[] } {
  const kinds: string[] = [];
  if (/href\s*=\s*["']?tel:/i.test(html)) kinds.push('phone link');
  if (/href\s*=\s*["']?mailto:/i.test(html)) kinds.push('email link');
  if (links.some((l) => /(wa\.me\/|api\.whatsapp\.com|whatsapp:\/\/)/i.test(l.href))) kinds.push('WhatsApp link');
  // A one-page site links to "#contact"; a larger one to "/en/contact-us".
  // Both are a way through to a human, so both count.
  const contactish = /(^|[/#_-])(contact|contact-us|get-in-touch|getintouch|enquiry|inquiry|reach-us)\b/i;
  if (links.some((l) => contactish.test(l.href) || /^contact( us)?$/i.test(l.text.trim()))) {
    kinds.push('contact page');
  }
  if (/<form\b[^>]*>[\s\S]{0,4000}?type\s*=\s*["']?email/i.test(html)) kinds.push('contact form');
  // A phone number printed in the copy still counts — plenty of small sites just
  // put it in the header without linking it. Matched on visible text only, so a
  // long number inside a script cannot masquerade as a way to reach anyone.
  if (kinds.length === 0 && /(?:^|[^\d])(\+\d[\d\s().-]{8,17}\d)(?:[^\d]|$)/.test(text)) {
    kinds.push('phone number in the page text');
  }
  return { found: kinds.length > 0, kinds };
}

const ACCOUNT_WORDS = /\b(sign ?in|log ?in|my account|client portal|customer portal|member login|dashboard)\b/i;

/**
 * Is this already an application, or does it just contain the word "login"?
 *
 * This distinction decides whether somebody is told they need a $499 rebuild or
 * a custom retainer, so it is not allowed to hinge on vocabulary. It hinges on
 * evidence: a password field, a payment or booking provider, a shop platform, a
 * cart, or an account area *on this site*.
 *
 * An account link pointing at another domain is explicitly NOT app evidence. It
 * is the opposite — the site hands the customer to somebody else's software. A
 * lawn care company linking out to a billing portal was being classified as an
 * application and quoted for a custom build; it is a brochure with a handoff.
 */
function findAppSignals(html: string, links: Link[]): { signals: string[]; outsourced: string[] } {
  const signals: string[] = [];
  const outsourced: string[] = [];

  if (/<input\b[^>]*type\s*=\s*["']?password/i.test(html)) signals.push('a login form');
  if (/(js\.stripe\.com|paypal\.com\/sdk|checkout\.razorpay|paddle\.com\/|squareup\.com|sslcommerz)/i.test(html)) {
    signals.push('a payment system');
  }
  if (/(calendly\.com|cal\.com\/|acuityscheduling|squarespace-scheduling|setmore|simplybook)/i.test(html)) {
    signals.push('an online booking tool');
  }
  // Matched against loaded asset URLs only. Stripe and GitHub both name Shopify
  // in their marketing copy; neither of them runs on it, and a word in a
  // paragraph is not evidence of what a site is built with.
  const assetUrls = [...html.matchAll(/\b(?:src|href)\s*=\s*["']([^"']+)["']/gi)].map((m) => m[1]!).join(' ');
  if (/(cdn\.shopify\.com|\/wp-content\/plugins\/woocommerce|bigcommerce\.com|snipcart\.com|magento)/i.test(assetUrls)) {
    signals.push('a shop platform');
  }

  const path = (l: Link) => l.href.replace(/^https?:\/\/[^/]+/i, '');
  if (links.some((l) => l.sameSite && /^\/?(cart|checkout|basket)\b/i.test(path(l)))) {
    signals.push('a shopping cart');
  }
  if (links.some((l) => l.sameSite && ACCOUNT_WORDS.test(l.text))) {
    signals.push('an account area');
  }

  for (const l of links) {
    if (!l.sameSite && ACCOUNT_WORDS.test(l.text)) {
      try {
        outsourced.push(new URL(l.href).host);
      } catch {
        /* unparseable href — nothing useful to name */
      }
    }
  }

  return { signals: [...new Set(signals)], outsourced: [...new Set(outsourced)] };
}

/**
 * What the site is asking visitors to do — read from things they can click, not
 * from nouns anywhere in the copy. The word "packages" in a paragraph is not
 * evidence that a business wants to sell online; a button saying "Order now" is.
 */
function findTransactionalIntent(labels: string): string[] {
  const wants: string[] = [];
  const has = (re: RegExp) => re.test(labels);

  if (has(/\b(book (a|an|your|now)|make (a|an) (booking|appointment)|reserve|schedule (a|an|your))\b/)) {
    wants.push('taking bookings');
  }
  if (has(/\b(get (a|an|your) (free )?(quote|estimate)|request (a|an) (quote|estimate)|free estimate)\b/)) {
    wants.push('quote requests');
  }
  if (has(/\b(buy now|order now|shop now|add to cart|order online|place (an )?order)\b/)) {
    wants.push('selling online');
  }
  if (has(/\b(apply now|apply (for|online)|admission|enrol|enroll|register now)\b/)) {
    wants.push('taking applications');
  }
  if (has(/\b(pay (my |your )?(bill|invoice|online)|make a payment)\b/)) {
    wants.push('taking payments');
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
  const options: RequestInit = {
    signal,
    redirect: 'follow',
    cache: 'no-store',
    headers: { 'user-agent': UA, accept: 'text/html,application/xhtml+xml' },
  };
  try {
    return await fetch(url, options);
  } catch (error) {
    if (signal.aborted || classify(error, signal) !== 'unreachable') throw error;
    return await fetch(url, options);
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
  const finalUrl = response.url || url;
  const head = html.split(/<\/head>/i)[0] ?? html;
  const text = visibleText(html);
  const links = extractLinks(html, finalUrl);
  const labels = actionLabels(html, links);

  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titleText = titleMatch ? decodeEntities(titleMatch[1]!.replace(/\s+/g, ' ').trim()) : null;
  const generic =
    !titleText ||
    titleText.length < 5 ||
    GENERIC_TITLES.includes(titleText.toLowerCase().replace(/[.\-–—|]+$/, '').trim());

  const metas = metaTags(head);
  const descriptionTag = metas.find((t) => (attr(t, 'name') ?? '').toLowerCase() === 'description');
  const descriptionText = descriptionTag ? decodeEntities((attr(descriptionTag, 'content') ?? '').trim()) : null;
  const viewport = readViewport(head);

  const favicon =
    /<link\b[^>]*rel\s*=\s*["']?[^"'>]*\bicon\b/i.test(head) ||
    /<link\b[^>]*rel\s*=\s*["']?apple-touch-icon/i.test(head);

  const { signals, outsourced } = findAppSignals(html, links);
  const intent = findTransactionalIntent(labels);

  // Handing customers to an external portal is itself a statement of intent:
  // the business needs the transaction, and the site cannot do it.
  if (outsourced.length > 0 && !intent.includes('taking payments')) intent.push('taking payments');

  return {
    ok: true,
    finalUrl,
    https: finalUrl.startsWith('https://'),
    htmlBytes: Buffer.byteLength(raw, 'utf8'),
    hasViewport: viewport.present && viewport.deviceWidth,
    viewport,
    contact: findContact(html, text, links),
    title: { text: titleText, generic },
    description: { text: descriptionText && descriptionText.length > 0 ? descriptionText : null },
    favicon,
    appSignals: signals,
    transactionalIntent: intent,
    outsourcedTo: outsourced,
  };
}
