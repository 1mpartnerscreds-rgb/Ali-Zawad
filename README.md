# AZ Studio

The marketing site for AZ Studio at [alizawad.online](https://alizawad.online).

It is not a brochure. A visitor enters their website address, gets a **real
automated audit** of that site, and is routed to exactly one recommended tier
based on what the audit found. The audit is the demo: it proves the work before
any claim is made about it.

## Running it

```bash
npm install && npm run dev
```

```bash
npm run build && npm start
```

## Environment

Copy `.env.example` to `.env.local`.

| Variable | Required | What it does |
|---|---|---|
| `PAGESPEED_API_KEY` | **In practice, yes** | Google PageSpeed Insights key. See the warning below. |
| `NEXT_PUBLIC_SITE_URL` | For deploys | Absolute origin for canonical and OG image URLs. |
| `RESEND_API_KEY` + `BOOKING_TO_EMAIL` | No | Sends booking enquiries to your inbox. |
| `BOOKING_FROM_EMAIL` | No | From address for the above. Defaults to Resend's sandbox sender. |
| `BOOKING_WEBHOOK_URL` | No | Fallback destination for enquiries (Zapier, Make, n8n). |

### The PageSpeed key is not really optional

The API works without a key, but the anonymous tier is a **single shared Google
project quota** used by everyone on the internet who calls it unauthenticated.
During this build it was already exhausted, returning HTTP 429 on every request.

Without a key the site does not break and does not lie — it degrades to a
**partial audit**: every check we run ourselves still runs, findings are still
real, and the page says plainly that there is no score because the load
measurements are missing. But nobody gets a score. Set the key.

Get one at the Google Cloud console by enabling the *PageSpeed Insights API*.

## How the audit works

1. `lib/audit/normalize.ts` — turns whatever was typed into one canonical domain.
   The audit id **is** that domain, so results live at readable, shareable URLs
   like `/audit/theirsite.com`.
2. `lib/audit/psi.ts` — PageSpeed Insights, **mobile strategy**. Mobile is the
   harsher measurement and the device the customer is holding; a desktop number
   flatters the site and misleads the owner.
3. `lib/audit/page-checks.ts` — everything PSI will not tell us, read off the
   HTML: HTTPS, viewport, a reachable contact method, title and description
   quality, favicon, and signals that the site is already an application.
4. `lib/audit/score.ts` — pillars, composite score, findings, tier routing.
5. `lib/audit/run.ts` — orchestration, the 20s budget, and the 24h cache.

### Scoring

All tunable numbers live in **one file**: `lib/audit/weights.ts`.

We do not surface Google's performance number as "the score". Google grades a
page as an engineer sees it. The composite is weighted toward what a business
owner is actually asking:

| Pillar | Weight | The question it answers |
|---|---|---|
| `loads` | 28 | Does it load before people give up? |
| `reach` | 20 | Can a customer actually reach me? |
| `phone` | 18 | Does it work on a phone? |
| `found` | 16 | Can Google find me? |
| `trust` | 12 | Does it look safe to a browser? |
| `usable` | 6 | Can everyone use it? |

Metric thresholds are anchored to Google's own good / needs-improvement / poor
boundaries, so any number quoted to a client can be checked against PageSpeed
Insights directly.

### Tier routing

Order matters here, and it was corrected against real measurements:

- **A site that is already an application never routes to Launch**, however badly
  it scores. Telling the owner of a working storefront that the answer is "up to
  5 pages, $499" is a diagnosis nobody would believe.
- Broken foundations on a brochure site → **Launch**.
- Nothing broken, but the site cannot transact and its own copy is about booking
  or selling → **Build**.
- Already an application, or nothing broken and nothing obviously missing →
  **Scale**.

### How it fails

Failure handling is a feature, not an afterthought. Every failure mode names what
actually happened and ends on the same door out — book a call. Handled: bad
input, non-existent domain, unreachable host, connect timeout, invalid
certificate, bot-blocked, non-HTML response, redirect loop, rate limit, and
upstream outage.

**Nothing is ever fabricated.** If we cannot measure it, we do not print a number
for it.

### Caching and abuse

Results are cached by normalized domain for 24 hours via the Next.js data cache,
so a repeat submission never re-runs the API. Failed audits are deliberately
*not* cached — a domain that was down for a minute should not be wrong for a day.

`lib/rate-limit.ts` limits by IP. It is in-process, so the limit is per
serverless instance rather than global — enough to stop casual abuse, not a
distributed attacker. If volume ever justifies it, swap the Map for Vercel KV;
the call signature does not change.

## Design system

Tokens live in `app/globals.css`. The default Tailwind palette and type scale are
cleared with `initial`, so a component *cannot* reference `text-slate-600` or
`text-2xl`. If a utility is not defined there, it does not exist.

- One accent (`#c2410c`), in exactly three places: the audit input, the score,
  the primary button. When it appears, it means *act*.
- Three type sizes — display, body, small. Two weights — 400 and 500. Never 700.
- Every text colour is ≥ 4.5:1 against the page background.
- The audit status lines are the only meaningful motion on the site. Everything
  else is a 150ms state transition, and `prefers-reduced-motion` is respected.

All user-facing copy lives in `content/`. English only, no translation layer —
but nothing is hardcoded in JSX, so adding one later is mechanical.

## Progressive enhancement

The audit form works with JavaScript disabled: it posts natively to
`/api/audit/run`, which runs the audit server-side and redirects to the result.
With JavaScript, the client streams real progress events from `/api/audit` and
shows a status line as each check completes.

A cached domain emits **no** progress lines and appears instantly. Faking a delay
so cached work "feels authentic" would be a lie about our own product.

## Measured

| | Result |
|---|---|
| Lighthouse mobile, homepage | **98** / 100 / 100 / 100 |
| Lighthouse mobile, all other pages | 98–99 / 100 / 100 / 100 |
| Same HTML with scripts stripped | **100 / 100 / 100 / 100** |
| Homepage JS, modern browsers | ~137 KB gzipped |
| Homepage JS, framework floor | ~135 KB gzipped |

The homepage ships **one** client component (`AuditForm`, ~3 KB). Everything else
in that number is Next.js and React themselves: a page with zero client
components measures the same. The stated 60 KB budget is not reachable on the
App Router — see the note in the handover.

## The old site

`public/client-portal.html` and `public/admin-dashboard.html` are the previous
static apps, preserved and still served at `/client-portal` and
`/admin-dashboard`. Their Supabase config is unchanged. Old URLs (`/home`,
`/pricing`, `/index.html`) redirect.
