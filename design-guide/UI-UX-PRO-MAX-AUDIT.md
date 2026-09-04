# ui-ux-pro-max audit — aimsstudio.online

Ran the skill's search against six domains + the Next.js stack.
Findings organised by "database says this and we agree" (real gaps
worth fixing before Friday) versus "database says this but the
brief overrides" (defensible aesthetic disagreements).

## 1 — The product-type match

The database has an exact profile for our audience:

> **Home Services (Plumber/Electrician)**
> Keywords: plumber, electrician, hvac, handyman, repair, emergency, licensed
> Primary style: Flat Design + Accessible & Ethical
> Landing pattern: Conversion-Optimized + Trust
> Colour focus: Trust Blue + Safety Orange + Professional grey

A second profile — Hyperlocal Services — is a close secondary match.
That "Home Services" row is what we should audit against.

## 2 — Where the site already matches (leave alone)

- Five-page structure fits `Conversion-Optimized + Trust`'s canonical
  section order (Hero → Proof → Solution → CTA).
- Semantic HTML in use (`<nav>`, `<main>`, `<article>`, `<footer>`).
- `next/font` in the root layout — matches Next.js stack guideline
  verbatim.
- Motion budget is near zero — matches the Accessible & Ethical
  profile's `reduced motion` requirement.
- Focus rings on `:focus-visible` at 2px offset — passes AA;
  the profile's enhanced target is 3-4px (see gap #3 below).
- Prices published on the page, not gated — matches the pattern's
  "Transparent pricing" conversion optimisation.

## 3 — Real gaps (the DB and the brief agree; fix these)

### G1 — Body contrast is AA, target profile is AAA

`Accessible & Ethical` sets the enhanced target at **7:1** for
normal text. Our current secondary grey `#828892` on ink `#14161a`
measures **5.08:1** — passes AA (4.5:1) but misses the AAA target
the profile calls for.

The buyer is a 55-year-old in bad workshop light. This is not a
theoretical accessibility gap — his eyes actually need the extra
contrast. **Fix:** darken `--color-grey` on ink to a value that
hits 7:1 on paper. Suggested `#A6ACB5` on ink = 7.2:1.

Cost: one CSS token change.

### G2 — Enquiry form only validates on submit

DB severity: **High**. Both required patterns:
- Inline validation on blur (not just on submit)
- Focusable error summary with `role="alert"` and links to invalid
  fields

Our form currently returns a single error paragraph after submit
and doesn't move focus. On a small-business owner in a hurry this
loses enquiries silently.

**Fix:** add `onBlur` validators on each field, plus an error-summary
region at the top of the form after failed submit. ~50 lines of
component code.

### G3 — Focus ring is 2px, enhanced target is 3-4px

Small, honest gap. **Fix:** bump the specimen and site focus rings
from 2px to 3px, keep 2px offset.

### G4 — Proof block is thin

The DB's `Conversion-Optimized + Trust` pattern names its proof
section as "logos, certs, stats." We ship four client-site thumbnails
and one Managing Director quote. No stats, no certifications, no
recognisable logos.

Some of these are "needs to become true" (§13 of the guide) — we
don't yet have a client whose logo a UK plumber would recognise.
But there are three we CAN do today:

- **Stats:** "4 sites live," "9 days average delivery" — real numbers
  from our four projects.
- **A visible reviews link:** put the client quote at the top of
  the proof strip, above the thumbnails.
- **A "trades built for" line:** list the industries we've built for.

Cost: half an hour of content.

## 4 — Aesthetic disagreements (defensible under the brief)

### D1 — Dark palette vs Trust-Blue-on-light

The DB recommends `#1E40AF` (deep blue) + `#EA580C` (safety orange)
on `#EFF6FF` (light blue). Every plumber/electrician site in the US
does exactly this — precisely why the brief bans it as "template
land."

**Direction 1 (Trade Van)** in `DIRECTIONS.md` chose Van Red on paper
for the same reason the DB flags trust-blue as safe: it converts. The
divergence is deliberate. **Keep** the trade-van direction; note that
if it doesn't land in the first 40 calls, the DB's default is the
fallback.

### D2 — Bricolage + Newsreader + Plex Mono vs Lexend + Source Sans 3

DB flags our stack as belonging to "News Editorial" — a pairing meant
for journalism, not trades. Its recommendation for trades is the
**Corporate Trust** pairing: **Lexend** (heading) + **Source Sans 3**
(body). Lexend was literally designed to help slower readers.

`GUIDE.md` §3 already moves us to Inter Tight + Inter, which is
closer to the DB's target but not the same. If we want to be literal
about the DB: swap to Lexend + Source Sans 3 in the redesign.

Lexend is unusual — heavier letterspacing than Inter — and has a
signature look. It's worth testing against your caller's audience.
My weak preference is Inter Tight + Inter for aesthetic consistency
with the badge, but the DB is not wrong that Lexend would be a
better readability choice for THIS reader specifically.

### D3 — Newsreader specifically

Regardless of the wider debate, **Newsreader is misfit for a trades
site.** The DB confirms what §5 of the audit already said. `GUIDE.md`
already drops it. Leave dropped.

## 5 — What the DB adds that we hadn't considered

### N1 — Landing section order

Canonical `Trust & Authority + Conversion` order:
`Hero (mission/credibility) → Proof → Solution → CTA`

Ours: `Hero → Credibility strip → Recent work → What you get →
Problem → Price → Closing`

Small reorder worth considering: the "problem" section (`Why you
have not got one`) currently sits after the deliverable. Moving it
earlier — between hero and credibility — would match the pattern's
"mission/credibility → problem statement → proof" arc more literally.
Not a blocker, worth trying.

### N2 — Icon set

DB recommends: **SVG icons only, no emoji.** Aria-hidden decorative
icons need `aria-hidden="true"`.

We use zero decorative icons currently — genuinely none. That's
lucky, not deliberate. If a redesign adds any (a check mark on the
bundled-items list, for example), it must be inline SVG with
`aria-hidden="true"`.

### N3 — Number formatting

DB flags: format large numbers with thousand separators. Not applicable
today — we have no numbers ≥ 1000 on the site. Worth remembering if
we ever add "reviews served" or "sites live" stats.

## 6 — Priority-ordered fix list

For the next session, in order of ROI:

1. **G1** — bump body contrast to AAA (one CSS token).
2. **G2** — add on-blur validation and focusable error summary to the
   enquiry form.
3. **G4** — add three real stats and the client quote to the
   Recent Work strip.
4. **G3** — bump focus ring to 3px.
5. **N1** — re-order home to Hero → Problem → Proof → Solution → CTA
   (worth A/B against current if we ever get traffic).
6. **D2** — decide whether to swap to Lexend + Source Sans 3
   before the trade-van redesign. My weak preference is not to;
   argue with me if you disagree.

## 7 — What the DB did NOT flag (that I was expecting it to)

- The empty `hello@aimsstudio.online` mailbox — DB doesn't audit
  external infrastructure. Still a launch blocker per `GUIDE.md` §13.
- The missing UK phone number — same reason.
- The lack of real photography — the DB's icons/proof rules assume
  a client already has images.

These stay as the top of `GUIDE.md` §13. The DB fills in the
component-level detail; the guide holds the ground-truth business
blockers.

## Confidence

**High** on G1, G2, G3 — measurable, database-backed, brief-aligned.

**Medium** on G4 and N1 — worth trying, judgement calls.

**Low** on D2 — the DB has a strong recommendation, but the brief's
"trade van" direction has a stronger visual argument. This one I'd
put in front of you before changing.
