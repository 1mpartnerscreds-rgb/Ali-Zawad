# AIMS STUDIO — DESIGN GUIDE
### Direction: Trade Van · v1 · September 2026

This guide is what a developer builds every AIMS Studio site
from. The redesign of aimsstudio.online is the first application;
the barber, the garage and the plumber sites are the second,
third and fourth. Rules are stated as rules — a section that
just describes a feeling has failed.

If you disagree with a rule, argue it here first. Don't ignore
it in the code.

---

## 1 — The reader

Dave. 50. Runs a two-mechanic garage in Longsight, Manchester,
that his father opened in 1988. 6-day week. iPhone in a pocket
that's been washed twice by accident. Reads the site in a bay,
one-handed, phone at arm's length, in the ten seconds while a
customer is on hold.

**What he fears.** Getting charged monthly for something he
doesn't understand. Paying somebody who then goes quiet. Being
sold something he doesn't need. Being made to feel stupid. A
website that ends up owned by the guy who built it.

**What closes him.** A price he can hear over the phone and
see with his eyes. A person's name he can ring back. A domain
that he owns. Being spoken to in his own words. Photography
that looks like his own street.

**What insults him.** Words like *elevate, seamless, unlock,
solutions, journey, transform, empower*. Stock photographs
of handshakes. Testimonials from businesses he's never heard
of. Any suggestion that his phone or his van are less than
adequate.

**Rule.** If a sentence, image, or claim would not survive
Dave reading it aloud in the presence of his father, cut it.

---

## 2 — Voice

Plain, second person, active. No marketing register. Sentences
short enough to say without a breath. If you can't hear the
sentence in a Manchester accent, rewrite it.

### 10 before / after rewrites

| Before | After |
|---|---|
| We craft bespoke digital experiences | We build websites |
| Elevate your online presence | Get you findable |
| Unlock the power of digital | People can look you up |
| A tailored solution designed to grow your business | Five pages, done in two weeks |
| Streamlined workflow | We ring you once, then we build it |
| Empower your business online | Your phone rings more |
| Book a discovery call | Have a ten-minute chat |
| Our team of experts | Ali, our developer |
| Cutting-edge technology | It works on a phone |
| Get in touch to learn more | Ring us. Or drop an email. |

### Rules

- Never say *solution*, *elevate*, *unlock*, *transform*,
  *seamless*, *journey*, *empower*, *experience*, *bespoke*,
  *leverage*, *robust*, *scalable*.
- Prices are named as numbers, not as ranges: `£399`, not
  `from £399`.
- Currency is dual: `£399 · $499`. Always in that order,
  always with the middle-dot separator.
- The word *you* appears twice as often as the word *we*.
  Count them per page.
- Every heading is a sentence a real person would say. Ends
  with a full stop unless it's a fragment.

---

## 3 — Type

Two typefaces. Both free. Both ship over Google Fonts.

### Family

- **Inter Tight** — display, headings, tabular numbers on
  prices. Semibold (600) for headings, medium (500) for
  sub-heads, regular (400) for body-within-display contexts.
  Chosen because its wider cut reads as signage, not editorial.
- **Inter** — body text, form labels, footer. Regular (400) for
  body, medium (500) for emphasis. Same designer, same skeleton,
  different width — they compose without discord.

No serif face. No mono. IBM Plex Mono is dropped from the
current site — mono for micro-labels reads as "designer" here.
Labels become uppercase Inter with tracking instead.

Where a mono is genuinely required (a code sample, a legal
disclosure, a receipt-style figure), fall back to the system
`ui-monospace, SFMono-Regular, Menlo, monospace`.

### Scale

Ratio: **1.25** (major third) — narrower than "editorial" scales
because the reader is on a phone and needs less range than a
magazine.

| Token | Mobile | Desktop | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| `type-hero` | 44px | 60px | 600 | 1.05 | -0.02em |
| `type-h1` | 32px | 40px | 600 | 1.10 | -0.015em |
| `type-h2` | 24px | 28px | 600 | 1.20 | -0.01em |
| `type-h3` | 20px | 22px | 500 | 1.30 | -0.005em |
| `type-body` | 17px | 18px | 400 | 1.50 | 0 |
| `type-small` | 14px | 14px | 400 | 1.45 | 0 |
| `type-label` | 12px | 12px | 500 | 1.30 | 0.08em, uppercase |

### Rules

- Body is 17px minimum on any device. Not 16px. Dave is 50 and
  in bad light.
- No font weight below 400. Thin type + backlit phone = illegible.
- Tabular numerals on every price. `font-variant-numeric: tabular-nums`.
- Headings use `text-wrap: balance` in browsers that support it.
- Line-height on headings 1.05–1.30; on body 1.5. Never
  `line-height: 1`.
- Maximum line length on body copy: **62 characters**. Use a
  `max-inline-size: 62ch` container, not word count.

---

## 4 — Colour

Five values. One accent. Derived in OKLCH from a single warm
anchor so nothing clashes.

### Palette

| Token | OKLCH | Hex | Role |
|---|---|---|---|
| `paper` | `oklch(96.3% 0.010 82)` | `#F7F5F0` | Page ground |
| `paper-2` | `oklch(93.0% 0.013 82)` | `#EEEAE0` | Section shade |
| `rule` | `oklch(85.0% 0.014 82)` | `#D8D0C0` | Hairlines, dividers |
| `ink` | `oklch(20.5% 0.017 250)` | `#141821` | All type |
| `grey` | `oklch(48.0% 0.014 246)` | `#63697A` | Secondary type |
| `red` | `oklch(52.0% 0.185 27)` | `#B93124` | CTA, ONE thing only |

### Contrast (WCAG 2.1)

- `ink` on `paper` — **14.8 : 1** — passes AAA body
- `grey` on `paper` — **5.4 : 1** — passes AA body
- `red` on `paper` — **5.2 : 1** — passes AA large; use only
  for CTA and one word of emphasis per page maximum
- `paper` on `red` — **5.2 : 1** — passes AA large; button text
- `ink` on `paper-2` — **13.1 : 1** — passes AAA
- `rule` on `paper` — decorative only, never carries text

### Rules

- Red appears in **one place per page** — the primary CTA — plus
  the AIMS mark's optional stripe. Everywhere else red is
  forbidden. Not for links, not for underlines, not for emphasis.
- Secondary CTAs use ink-on-paper with a rule border, not red.
- Links inside body copy use `ink` with an underline. Not red,
  not blue.
- No gradient anywhere. Not on backgrounds, not on type, not on
  buttons.
- No shadow anywhere except a 1px `rule` border. The system
  achieves separation with hairlines and paper-2, not depth.

---

## 5 — Space & grid

One 8-based scale. Everything sits on it.

### Space scale

`4, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192` px.

Named for downstream use: `s1 s2 s3 s4 s6 s8 s12 s16 s24 s32
s48`. A component that reaches for `20px` has broken the
system — ask why.

### Grid

- **Mobile (390–767px)**: single column. `16px` inline padding.
- **Tablet (768–1023px)**: single column. `32px` inline padding.
  Max content width `62ch` for body copy blocks.
- **Desktop (1024px+)**: 12 columns. `32px` inline padding on
  the frame, `24px` gutter between columns. Content max width
  `1200px`.

### Vertical rhythm

- Between sections: `96px` (mobile) / `128px` (desktop)
- Between blocks within a section: `48px` (mobile) / `64px`
- Between rows within a block: `24px`
- Within a row (label above value): `8px`

### Rules

- No arbitrary padding. Reach for the scale. If nothing on it
  fits, add a value to the scale — do not one-off it.
- Sections separated by whitespace and a hairline, not by
  background colour. Colour changes are used **once** per page
  maximum, and only to signal a real change of purpose (e.g. a
  Contact block).
- On mobile the grid collapses to one column. Nothing tries to
  be clever with columns under 768px.
- Anything horizontally scrollable (tables, code blocks) is
  wrapped in a container with `overflow-x: auto`. The page body
  itself never scrolls sideways.

---

## 6 — Photography

The single biggest lever on this kind of site. Every rule below
is followable by a developer without me in the room.

### 6.1 Image specifications

| Role | Aspect | Long edge | Format | Fallback |
|---|---|---|---|---|
| Hero | 4:5 (portrait) | 1600px | AVIF + WebP | WebP alone if AVIF too heavy |
| Case-study lead | 3:2 (landscape) | 1800px | AVIF + WebP | WebP alone |
| Project thumbnail | 4:3 | 1200px | WebP | JPEG for older browsers |
| About / team | 4:5 | 1200px | WebP | JPEG |

All images: `<img srcset="…" sizes="…" loading="lazy" decoding="async">`.
`loading="eager"` only on the LCP image (usually the hero).
Every image ships an explicit `width` and `height` attribute
matching the actual file, to prevent CLS.

Compression targets, before ship:
- Hero: ≤ 90KB
- Case-study lead: ≤ 120KB
- Project thumbnail: ≤ 50KB

Fail the build (or refuse the commit) if any image is over.

### 6.2 Alt text

One sentence, plain, describes what a person would see if the
image loaded. Not keyword-optimised.

- Good: `alt="Ali, a smiling man in his thirties, holding a
  phone showing the Cybertech homepage."`
- Bad: `alt="AIMS Studio developer web design Cybertech
  Bangladesh training institute"`
- Empty `alt=""` only for images that are pure decoration
  (already rare — we don't do pure decoration).

### 6.3 What to shoot for AIMS's own site

Get one photo of each, the day before the site publishes:

1. **Ali** — head-and-shoulders, phone camera, real light.
   Plain wall behind. Wearing what he'd wear on the call.
   File: `public/photos/ali.avif` (+ `.webp` fallback).
2. **A phone with one of our client sites open**, held in a
   hand, in a real place — car dashboard, workbench, kitchen.
   Not a designer's desk. File: `public/photos/proof-phone.avif`.
3. **A text-message thread with an actual client**, screenshot,
   redacted to the moment they thanked us. Closest thing to
   a testimonial without inventing one. File: `public/photos/message.avif`.

### 6.4 What to shoot for a client site

For every client build:

- One **outside** photo of their premises, van, or workshop.
- One **inside** photo of them at work — hands, tools, a real
  moment. Not a portrait.
- One photo of their sign or logo on their door.

### 6.5 How to brief a client (send verbatim on WhatsApp)

> *Send me six photos of your work. Just from your phone,
> nothing fancy. Best photos to send: the outside of the shop
> or the van, you at work with your hands on something, a
> before-and-after if you've got one, your sign or logo.
> Don't worry about angle or filter. Landscape (sideways) if
> you can. Send them all in one message.*

### 6.6 What to reject

- Any stock photograph. Any image of a handshake, a lightbulb,
  a rocket ship, gears, or an "office team." Zero exceptions.
- Photos with visible timestamps, filters, or Instagram crops.
- Photos taken with flash in dim light. A phone in daylight
  is always better than a phone with flash indoors.
- The client's logo pasted onto a stock photo. This is the
  second-worst option after stock alone.
- Screenshots of Google Maps street-view — reads as evasive.

### 6.7 The zero-photo path

The client cannot or will not send photos. In order:

1. Ask again: *"Send me one photo of the front of your shop
   from across the road. Just your phone."* Wait 24 hours.
2. Ask: *"Send me a photo of your tools laid out, or one thing
   you've fixed recently."* Wait 24 hours.
3. Use the AIMS badge SVG as a placeholder at the hero image
   slot, set on `paper-2` background at the specified aspect
   ratio. Mark the client build as `[photo pending]` in the
   commit and repo README. Do not launch.
4. If the client insists on launching without photos: launch,
   but leave the hero photo slot as the paper-2 placeholder
   (not a stock image). The empty slot reads as honest.
   Never buy stock as a stand-in.

### 6.8 Placement rules

- Hero photo: full-bleed on mobile (edge to edge), contained
  within the frame on desktop (max-width matches text column).
- Case-study lead: contained on all breakpoints, sits below
  the H1.
- Never crop portraits at the neck or the top of the head.
- No drop shadow. No border-radius greater than 4px.
- Caption, if any, uses `type-small` and sits directly below
  the image, left-aligned, in `grey`.

### 6.9 Rule

Every site has a **minimum of one real photograph** of the
business it's built for. Zero is a launch blocker. Placeholders
are the paper-2 rectangle at the correct aspect ratio, never
stock.

## 7 — Components

Anatomy, all states, mobile behaviour. Full renderings in
`specimen.html`.

### 7.1 Nav

Left: AIMS mark + wordmark (returns to home). Right: four page
links, spaced 24px. Height 64px on desktop, 56px on mobile.
Below-nav: a 1px `rule` hairline separating from the page.

**States:** default (`grey` link, `ink` on hover, `ink` +
underline on current). No mobile menu — with four short links
they fit horizontally down to 340px if we set them tight enough.
If they don't, they wrap to a second row rather than collapse
into a hamburger. A hamburger for four links insults the reader.

### 7.2 Hero

Two-column on desktop, stacked on mobile.
Left (or top): H1 headline, two body sentences, price + duration
line, primary + secondary CTA.
Right (or below): one photograph (a phone showing one of our
sites, held in a real hand).

No animated background. No parallax. The hero photograph is
a static image and loads with the page.

### 7.3 Price block

Composed as an invoice. Three columns on desktop, stacked on
mobile:
- Column 1: label (e.g. "Launch")
- Column 2: what it includes (five short lines)
- Column 3: the price (`£399 · $499`), right-aligned,
  tabular-nums, `type-h1`

Below each row: `£99 · $99` deposit + "balance on go-live" as
a `type-small` note.

### 7.4 Proof block

A horizontal strip of four thumbnails on desktop, two-per-row
on mobile. Each is a real client site opened on a real phone,
photographed. Below each: client name + one-line description.
No hover animation — you tap it and it opens the site in a new tab.

### 7.5 Service card (for client sites)

Used on plumber / garage / barber sites, not on AIMS's own.
Anatomy: label ("Boiler service"), one-sentence description,
optional price. Set on `paper-2` with a `rule` border.
No icon, no illustration.

### 7.6 Contact block

Split panel: on the left, phone number + email + hours as a
list. On the right, a form (name, phone, email, message).
Submit button is the ONE red CTA on the page.

### 7.7 Footer

Two lines. Line 1: the mark, the address, the phone number.
Line 2: legal (empty until we register), copyright, sitemap
links.
Set on `paper-2` to signal end-of-document.

### Rules

- Every interactive component has a `:focus-visible` state
  that shows a `2px solid ink` outline offset by 2px. Never
  remove focus rings.
- Tap targets on mobile are **48×48 minimum**.
- Buttons are `padding: 16px 24px` at minimum. No smaller.
- Forms never require both phone and email — one is enough.
  (Already enforced on the current site.)

---

## 8 — The five pages

Wireframe-level intent. Detailed layout follows the components.

### Home

1. Nav
2. Hero — headline / body / price / two CTAs / one photo
3. Credibility strip — four rows: deposit / domain / contract / person
4. What you get for £399 — five ruled rows, invoice-formatted
5. Recent work — 4 thumbnails
6. One case study excerpt with link
7. Contact block (compact)
8. Footer

### Work

1. Nav
2. Page title
3. Grid of live client sites — screenshot + label + one line
4. Link to case studies
5. Footer

### Pricing

1. Nav
2. Page title
3. Launch + Build tiers as invoice tables
4. "How you pay" table
5. "What happens if you're not happy" numbered list
6. Contact block
7. Footer

### About

1. Nav
2. Page title
3. One paragraph — who we are, where we are
4. Photo of Ali
5. Three lines — years, how we work, what we don't do
6. Contact block
7. Footer

### Contact

1. Nav
2. Page title
3. Two columns: contact list + form
4. Footer

### Rules

- No page has more than 8 content blocks between nav and footer.
- Every page has the contact block or a contact CTA above the
  footer. The reader never has to travel to a "contact" page to
  find how to reach us.
- Every page names the price at least once, even About.

---

## 9 — Motion

Budget: near zero.

**What animates, and why:**

1. **Button hover (200ms colour swap).** Feedback that the
   thing is interactive. Necessary.
2. **Focus ring appear (100ms).** Accessibility affordance.
3. **Nav underline on current page (static).** Not an animation.

**What does not animate:**

- No entrance animations. Nothing "reveals" on scroll. Every
  block is present at first paint.
- No parallax. No sticky headers. No scroll-jacked sections.
- No page transitions.
- No animated gradients, blurs, or overlays.
- No page load spinner or skeleton state — the page is HTML,
  it arrives.

### Rules

- The site works identically with `prefers-reduced-motion: reduce`.
  If it does not, the animation is not needed.
- Any animation added later must be defended in writing — added
  to this section, or removed from the code.

---

## 10 — Standards

Pass/fail.

### Accessibility

| Check | Pass |
|---|---|
| Body text contrast | ≥ 4.5:1 |
| Large text contrast (18pt+ or 14pt bold+) | ≥ 3:1 |
| Focus ring on every interactive element | Yes |
| Tab order matches visual order | Yes |
| Every `<img>` has meaningful alt (or empty for decorative) | Yes |
| Every form field has a real `<label>` | Yes |
| `prefers-reduced-motion` respected | Yes |
| Semantic HTML — no `<div>` where `<button>` fits | Yes |
| Colour is not the only signal for any state | Yes |
| Keyboard-only user can complete an enquiry | Yes |
| Page has one `<h1>` | Yes |
| Skip-to-content link on every page | Yes |

### Performance

Throttled to mid-tier Android on 4G, run in Chrome:

| Metric | Pass |
|---|---|
| Largest Contentful Paint | ≤ 1.8 s |
| Cumulative Layout Shift | ≤ 0.02 |
| Total Blocking Time | ≤ 100 ms |
| Total JS shipped | ≤ 80 KB gzipped |
| Total CSS shipped | ≤ 20 KB gzipped |
| Total fonts shipped | ≤ 60 KB (two Inter weights, subset) |
| Lighthouse Performance | ≥ 95 |
| Lighthouse Accessibility | 100 |
| Lighthouse Best Practices | ≥ 95 |
| Lighthouse SEO | 100 |
| Console errors | 0 |

### Rules

- The pass/fail column is not aspiration. A build that misses
  any pass column is not shipped until it hits it, or the miss
  is documented as a knowing exception (with the reason) in the
  repository README.

---

## 11 — Do / Don't

Full paired examples rendered in `specimen.html`. Written form:

| Don't | Do |
|---|---|
| Purple → blue hero gradient | Flat paper background |
| "Elevate your online presence." | "Get you findable online." |
| Stock handshake photograph | One photograph of a real hand on a real tool |
| Three-card feature grid with icons | Five ruled rows, invoice-formatted |
| Rounded card with soft shadow | Rectangular block with a 1px rule border |
| "Get a free quote" as only CTA | Named price + "Talk to us" as secondary |
| Testimonial with stock avatar | No testimonial until a real one exists |
| Auto-playing hero video | One still photograph |
| Blurred glassmorphism panel | Flat `paper-2` panel |
| Text over a photograph | Text beside a photograph, never on it |

### Rules

- If a design choice appears in the left column above, it is
  banned regardless of who suggests it.

---

## 12 — The client kit

The whole point of this system is that it produces one AIMS
site AND every client site AIMS builds — without re-designing.

### What varies per client

Exactly three things.

1. **Colour anchor.** The client picks their own accent
   colour — a colour they already use on their van, their
   sign, or their business cards. Everything else stays.
   Paper stays paper. Ink stays ink. Grey stays grey.
   The accent replaces `red` — and, like `red`, appears in
   exactly one place per page.
2. **Photography.** Their real photos, briefed per §6.
3. **Copy.** Their trade, their services, their reviews.
   Written by us from one call.

### What does not vary

Everything else. Type scale, spacing, component anatomy,
motion budget, standards. If we're tempted to add a component
"just for this client," we have not built a system.

### Two-week build checklist

Once a deposit lands:

**Day 1 (60 min)**
- Call with client. Record. Get: services list, area covered,
  hours, phone, existing reviews, photos brief.

**Day 2**
- Copy draft. Send to client on WhatsApp for read-through, not
  approval. "Anything obviously wrong?"

**Day 3–4**
- Design page 1 (Home) on the shared template. Send screenshot.
  Wait for "yeah looks good" before continuing.

**Day 5–8**
- Build all five pages. Wire up form. Register domain in
  client's name. Set up hosting. Configure email forwarder.

**Day 9**
- Send private preview link. Book 30-minute call.

**Day 10**
- Change call. Fix anything wrong same day.

**Day 11**
- Google Business Profile connected. Reviews pulled in.
  Second preview.

**Day 12**
- Handover documentation drafted. Domain switched to
  production DNS.

**Day 13**
- Site live. Handover call. Client walks through their own
  login. Balance invoice sent.

**Day 14**
- Balance clears. 30-day warranty begins.

### Rules

- Nothing beyond §6 varies without being added to this section
  first. A "one-off" component is a system rot.
- If the client asks for something not in the system, tell them
  we don't do it. If it's clearly needed by every trade site
  built after this, add it here — then build it in.

---

## 13 — Needs to become true

Written down honestly so nothing on the site pretends these
already exist.

### Blocking (before Friday's first dial)

- [ ] `hello@aimsstudio.online` mailbox created and receiving.
- [ ] `RESEND_API_KEY` set in Vercel Production env.
- [ ] End-to-end test: submit a real enquiry from the live site,
      confirm it lands in the mailbox, reply from the mailbox,
      confirm the reply lands with the customer.
- [ ] One UK phone number acquired and put in `TO_FILL`.
- [ ] PayPal partner's handle and receipt-name filled in on the
      US caller PDF page 3.

### Blocking (before we take a paying UK client)

- [ ] UK company registration (any structure — Ltd or a
      registered sole trader with a UK address).
- [ ] `aimsstudio.co.uk` domain acquired and pointed at the
      same site.
- [ ] Written contract drafted, PDF-form, one page, plain
      English. Reviewed by a UK solicitor once.
- [ ] Privacy notice published at a real URL.

### Blocking (before the trade-van redesign lands)

- [ ] One real photo of Ali sent through.
- [ ] One real screenshot of a client site opened on a real phone,
      shot from above at a workbench or dashboard.
- [ ] Any client — Startup Solution, Ahmed Mobasher, or
      Cybertech — willing to send a short text quote we can
      quote them on with their name attached.

### Improving

- [ ] A second, UK-flavoured case study — plumber, garage or
      barber. Even hypothetical, labelled as such, is stronger
      than absence.
- [ ] A `.co.uk` mirror.
- [ ] A downloadable one-page PDF of the price sheet — sent
      by WhatsApp when the caller can't hold a buyer on the phone.

---

## Sections I'm least confident in

**§ 6 Photography.** The rules are right, but every rule
depends on the client sending photos we know most won't. The
fallback — the AIMS badge as placeholder — is honest but weak.
The right fix is that AIMS itself photographs the first client
free, uses those photos in the case study, then trades on the
result. That's a business change, not a guide change, and it
belongs on the roadmap not in this section. Called out here
so the developer knows.

**§ 12 Client kit.** The two-week checklist is aspirational
until we've delivered a paid client through it. Day 1's "call
with client" is trivial; day 5-8's "build all five pages" is
where real projects diverge from the plan. When the first
paying client's build actually happens, this section gets
rewritten from what really happened.

**§ 11 Do/Don't.** The pairs are correct but need to render
as real examples in the specimen. Written prose here is not
enough.
