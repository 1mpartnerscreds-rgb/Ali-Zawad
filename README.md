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

### Real visits beat the lab

Lighthouse's lab run simulates a mid-range phone on throttled 4G. It is a stress
test. On a large site it can read 28 seconds where real visitors wait three.

So when Google has Chrome UX Report data for a site — real measurements from real
visits — that is what we score and what we quote, and the finding says so. When
it doesn't, we fall back to the lab run and **every sentence built on it says
plainly that it was a simulation**. Quoting a lab number as "what your visitors
experience" is the fastest possible way to have the whole audit dismissed: the
owner opens their own site, watches it load, and stops believing the rest.

### Checking the phone layout ourselves

Lighthouse 13 deleted `content-width`, `font-size`, `tap-targets` and `viewport`.
Anything still asking for them silently receives `null` — which is how "does this
get cut off on a phone?" quietly stopped being checked at all.

The `phone` pillar is now read directly from the page's own markup, so it cannot
depend on which Lighthouse version PageSpeed happens to run:

- a viewport pinned to a fixed pixel width (`width=1024`) is a **guarantee** the
  page is cropped on a phone, and scores worse than having no viewport tag at all
- `user-scalable=no` or a low `maximum-scale` means nobody can rescue a cramped
  layout by zooming

Everywhere else, audit ids are looked up through a candidate list (newest first)
in `REPORTED_CHECKS`, so both old and new Lighthouse versions are understood.

### Everything we checked

Findings stay short — three to five things worth acting on. Underneath them is
the full list of every test run, grouped and marked passed / needs work /
couldn't check.

That third state matters. A check we could not run is never counted as a pass.
A report that pads its own pass rate is worthless, and the first time an owner
notices one they stop trusting the rest of the page.

### Tier routing

Order matters here, and it was corrected against real measurements:

- **A site that is already an application never routes to Launch**, however badly
  it scores. Telling the owner of a working storefront that the answer is "up to
  5 pages, $499" is a diagnosis nobody would believe.
- **"Already an application" is decided on evidence, not vocabulary.** A password
  field, a payment or booking provider, a shop platform, a cart, or an account
  area *on this domain*. An account link pointing at another company — a lawn
  care firm's billing portal, say — is the opposite of app evidence: the site
  hands the customer to somebody else's software, which is a Build case. Getting
  this wrong once routed a small local business to a custom retainer.
- Subdomains are compared by registrable domain, so `accounts.nike.com` is Nike
  and not a third party.
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
| Lighthouse mobile, homepage | **97** / 100 / 100 / 100 |
| Lighthouse mobile, all other pages | 98–99 / 100 / 100 / 100 |
| Same HTML with scripts stripped | **100 / 100 / 100 / 100** |
| Homepage JS, modern browsers | ~137 KB gzipped |
| Homepage JS, framework floor | ~135 KB gzipped |

The homepage ships **one** client component (`AuditForm`, ~3 KB). Everything else
in that number is Next.js and React themselves: a page with zero client
components measures the same. The stated 60 KB budget is not reachable on the
App Router — see the note in the handover.

## Testimonials

Two real client quotes, in `content/site.ts`, verbatim apart from a closing full
stop. They appear on `/book` — after the form, so somebody who arrived ready to
book reaches the fields first — and the Cybertech one on `/services/build`,
whose work it describes.

They are deliberately **not** on the homepage. That page has one job: get one URL
into one box. A testimonial there competes with the input for attention, which
is the failure this site exists to fix, and §5.1 rules it out for that reason.

`href` is null where a company's own site no longer resolves. We do not link a
prospect to a dead domain to prove we are reliable.

## The scroll sequence

The homepage is a four-act scroll piece: the hero recedes into depth, a dark act
pins the 2.5-second threshold over a perspective floor, the six scoring pillars
travel past as a corridor of angled panels, and the work settles out of depth
plate by plate before the input returns full-screen.

**It adds no JavaScript.** All of it is native CSS scroll-driven animation —
`animation-timeline: view()`, named view timelines, and 3D transforms — which
runs on the compositor rather than the main thread. That was the whole reason
not to reach for GSAP: this site tells people their site is too slow, and buying
the motion with a 70KB animation library would have made the argument a bluff.
Homepage measures 98 / 100 / 100 / 100 with the sequence in place.

Three rules hold the layer together:

- **Nothing readable is left rotated.** Every element resolves flat and face-on
  by the time it is in front of the reader.
- **Motion may be missing; content may not.** The horizontal act only works
  because the track moves — under reduced motion, or on an engine without
  scroll-driven timelines, the rail stops being a rail and becomes a plain grid.
  Left as-is, four of the six panels would sit outside an `overflow: hidden` box
  with no way to reach them.
- **Every number in the sequence is real.** The 2.5 seconds is Google's own LCP
  boundary and the pillar weights are read from the scoring config, so the act
  cannot drift from what the audit does.

Two traps worth knowing about, both hit during the build:

- `overflow: hidden` on a section makes it a scroll container, which **breaks
  `position: sticky` inside it**. The pinned dark act silently scrolled away and
  rendered as a black screen. Clipping belongs on the pinned frame, never on the
  section that contains it.
- A word wrapped in an `inline-block` that swallows its own trailing space
  leaves the browser no break opportunity, so the line refuses to wrap at all.
  Same failure mode as splitting on a non-breaking space.

## Motion

Two deliberate exceptions to the "no animation" rule, both requested and both
measured.

**The typed headline** (`components/Typewriter.tsx`). CSS only — no JavaScript,
so it costs nothing against the bundle and works with scripting off. The
characters are server-rendered real text, so search engines read the sentence
normally, and the `h1` carries the full sentence as its accessible name because
per-character spans make some screen readers spell words out. Under
`prefers-reduced-motion` the text is simply there.

It animates the LCP element, which is the one thing on this site we cannot be
careless with. Measured cost: **one Lighthouse point** (98 → 97) and about 150ms
of LCP. Two implementation details mattered more than the type speed:

- `steps(1, start)` over 200ms, not `steps(1, end)` over 1ms. A one-millisecond
  animation puts the only visible state inside a sub-frame window the browser is
  free never to sample — which silently ate the "o" in "Most" and left a
  character-shaped hole in the headline.
- Real spaces plus `white-space: pre-wrap`, never non-breaking spaces. NBSP
  stops the headline wrapping at all, which produced 897px of horizontal
  overflow on a 375px phone: the exact defect this site audits other people for.

**Web-strand buttons** (`.az-web`). On hover, fine threads draw across the
button left to right on a taut easing. Monochrome — it inherits `currentColor`,
so the one-accent rule survives and there is no red or blue anywhere.

## The old site

`public/client-portal.html` and `public/admin-dashboard.html` are the previous
static apps, preserved and still served at `/client-portal` and
`/admin-dashboard`. Their Supabase config is unchanged. Old URLs (`/home`,
`/pricing`, `/index.html`) redirect.
