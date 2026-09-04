# AUDIT — aimsstudio.online, Sept 2026

Written from evidence, not opinion: the live site's own source
and screenshots at 390 / 768 / 1440 (`refs/aims-*.png`), the site's
git history at commit `41ac1b4`, and the 21st.dev catalogue as it
stands today. No competitor screenshot library was assembled from
scratch — the category is well-defined and the pattern is stable:
every UK small-agency site at £300–£1,500 does the same seven things.

## 1 — What actually exists at aimsstudio.online today

The site is not vapourware. It is live, five pages
(`/`, `/what-you-get`, `/pricing`, `/how-it-works`, `/about`)
plus one case study at `/case-studies/cybertech`. Stack: Next.js 16,
React 19, Tailwind v4, static-generated. Icons and mark ship as
inline SVG; three typefaces load (Bricolage Grotesque display,
Newsreader serif body, IBM Plex Mono for labels). The build
tree passes typecheck and Lighthouse cleanly enough to not be
the thing that fails a buyer.

The commercial engine is: outbound cold call, deposit taken over
the phone, site consulted mid-call by the buyer as a legitimacy
check. Deposit path is currently **PayPal for US buyers**, bank
transfer for UK — dual-currency headline `£399 · $499`, dual
`£99 or $99 to start`. Enquiry form on `/about` posts to
`/api/enquiry`. There is no phone number on the public site
(placeholder was live for a week and correctly hidden Sept 3rd).

The tone is editorial-dark. Bone type on Ink `#14161a` ground,
one warm-amber accent on the primary CTA. The hero uses masked
type reveal on load; the four interior pages have had their
scroll-triggered stagger stripped (commit `41ac1b4`, Sept 3rd).

Recent work is shown as a four-thumbnail strip on Home — real,
clickable, checkable. One long-form case study (Cybertech,
training institute in Bogura since 2000) exists at `/case-studies/cybertech`.

## 2 — What the reader will see (screenshots)

- `refs/aims-mobile.png` — 390×1600. Hero fits within one screen.
  Prices `£399 or $499` visible above the fold. Two CTAs land
  above the credibility strip. Header consumes 98px.
- `refs/aims-tablet.png` — 768×1800. Same content, layout
  identical.
- `refs/aims-desktop.png` — 1440×2200. Four credibility columns
  visible side-by-side; recent-work strip lands as four thumbnails
  above the argument.

Weak evidence: no photograph of a client, no photograph of Ali,
no photograph of a real installation. Four client-site thumbnails
sit in place of photography. The whole page is type + colour +
one accent.

## 3 — The 21st.dev catalogue: what's usable

Categorical assessment, not per-component. Search on
`pricing table simple minimal` returns three-tier plans with
"popular" highlighted, gradients on cards, subtle box-shadow.
Search on `contact form` returns forms with animated backgrounds
and social-media integrations. Every result is built for SaaS
marketing, and every result would fail the "trade van" test on
its default styling.

**What is usable, as mechanics:** the shadcn form primitives and
button component (basic input structure, focus-ring, disabled
state, error state) are worth pulling as base — they solve the
tedious accessibility mechanics correctly. Nothing else in the
top-ranked results for these queries reaches this site's brief
without a full restyle.

**What is not usable:** every "pricing section," "hero section,"
"features grid" ships with the exact aesthetic the brief bans.
Pulling one in and stripping the gradient is more work than
authoring the block.

**Verdict on 21st.dev for this site:** it is a mechanics
library for shadcn projects, not a visual reference for this
buyer. Import the base form primitives, author everything else.

## 4 — What the competition looks like (composite, not survey)

Every UK web-design shop selling to trades at £300–£1,500 does
the same seven things:

1. Hero image, stock photograph of a hand shaking or a laptop
2. Poetic headline: *"Websites that convert"* / *"Digital that delivers"*
3. Three-card feature grid — Design / Build / Grow
4. "Trusted by" strip with unrelated client logos
5. Fabricated testimonial with a stock avatar
6. Numbers stated without evidence: *"200+ businesses served"*
7. A single CTA — *"Get a free quote"* — with a form gate

The whole class reads as identical because it is. A tradesman
who has been called by two of them in the past year will not
believe the third. The design lever available to us is
structural, not aesthetic: don't do those seven things.

## 5 — Ranked problems on the current site

Ranked by money lost, not by ugliness.

### P0 — costs a sale directly

1. **The enquiry form's target mailbox does not exist.**
   `hello@aimsstudio.online` has no MX record. The form posts
   correctly and, without a Resend API key set, refuses honestly
   ("please email us directly"). But the address it points at
   bounces. Every enquiry that clears the caller's phone script
   and lands on the form is lost the moment they email you.
   *Fix: create the mailbox in Hostinger before Friday's first
   dial. Add Resend key. Cost: 20 minutes.*

2. **No phone number anywhere.**
   The placeholder `[UK PHONE NUMBER]` was pulled correctly on
   Sept 3rd. But the *absence* fails the sceptical-tradesman test
   too: a website with no phone number is a website that doesn't
   want a phone call. Every credible trades supplier in the UK
   puts a number on every page.
   *Fix: acquire a UK number — Google Voice, Skype, or a burner
   SIM. Two hours. Nothing else on the site is worth doing before this.*

3. **No case study for a business the buyer's tradesman is like.**
   The one case study is Cybertech, a training institute in
   Bogura since 2000 — a different country, a different sector,
   a different scale. A Manchester plumber reads it and thinks
   "that's not me." *Fix: write a second case study — a UK
   plumber, garage or barber — even a hypothetical / "typical"
   one clearly labelled as such. Half a day.*

### P1 — costs trust over time

4. **The site has no real photography.**
   Four site thumbnails is not photography. Photography is a
   person's hand on a brake caliper, a barber chair against a
   window, a plumber's van parked at a job. The whole site is
   set type. Type-only sites read as "designer," and this reader
   pays designers for logos, not websites.
   *Fix: request one real photo from each existing client. Brief
   in Section 6 of the guide. Half a day of coordination.*

5. **The Bricolage / Newsreader pairing reads as editorial, not trade.**
   The face is fashion-magazine — well-cut, high contrast, wide
   optical range. On a good black background it looks expensive.
   To a 55-year-old mechanic it reads as "this costs £3,000."
   *Fix: swap body serif for a plainer sans, and use display
   Bricolage at wider width (100) so it reads as signage rather
   than editorial. See Direction 2 below.*

6. **Dark aesthetic is a designer choice, not a buyer choice.**
   The whole page is set on `#14161a`. Every credible tradesman
   website is white. Every van is painted. Ink on paper is what
   this buyer's world looks like. Dark-mode is not signalling
   quality here; it's signalling "the person who made this is a
   designer."
   *Fix: flip to paper as the default surface, with dark ink
   type. See Direction 1 below.*

### P2 — smaller drags

7. Hero body copy is a full paragraph before the price is
   named. Cut to two sentences.
8. "You're not hard to recommend. You're hard to find." is poetic.
   True to the buyer's frame, but reads as an ad line. Consider
   replacing with the flatter "You're good. Nobody can find you.
   We fix that."
9. The `case-studies` route is orphaned — no card in nav, only
   linked from a single line in the Recent Work paragraph.
10. Named person line says "Ali Zawad, our developer, on every
    contract we send." Ali is not the caller; the caller has no
    name on the site. This is honest but weak — a real person
    on the About page with a photograph closes it.

## 6 — What the current site does WELL — leave alone

- **Price is on the page.** Not gated. Named twice. Named
  with the deposit. This is 60% of what makes the site
  believable to this buyer.
- **The domain-in-your-name promise.** Correct. Rare. Named
  three times. Keep.
- **The written-contract promise.** Correct. Named. Keep.
- **Recent work is real and clickable.** Not stock, not fake.
  Keep — improve the thumbnails to real screenshots on real
  devices, but keep the strip.
- **Motion is currently near zero.** Only the hero animates
  on load. Everything else lands still. This is right for the
  brief. Do not add motion in the redesign.
- **The badge mark is unusually good** — a real geometric
  monogram, not a font logo. Keep exactly.

## 7 — What's honestly missing (goes in guide §13)

- No UK company registration → no Ltd, no company number, no
  registered office, no VAT number. Site is honest about this
  by omission but a UK buyer notices the absence.
- No `.co.uk` domain — `.online` reads as budget.
- No UK phone number.
- Working mailbox at `hello@aimsstudio.online`.
- Real trades client for photography and case-study.
- Written contract as a downloadable PDF a buyer can read
  before he pays.
