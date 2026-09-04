# THREE DIRECTIONS

Every one keeps: dual currency (£/$) headline, PayPal + bank
transfer payment, real recent-work strip, the domain-in-your-name
promise, the AMS hexagon badge. Every one passes the mechanic
test: does it look trustworthy to a 55-year-old reading in a
workshop, or does it look like it costs more than £399?

---

## Direction 1 — TRADE VAN (recommended)

**Reference lineage.** UK signage, painted vans, printed
invoices, hardware-store shelf-talkers, GOV.UK's flat design
system, Monzo's early payments UI, Signal Noise's editorial
layouts. What every trades supplier's own truck looks like — big
lettering, one accent stripe, high contrast, no ornament.

**Typefaces.**
- Display: **Inter Tight** at wide tracking / semibold. Reads
  as signage rather than editorial. Broad, evenly weighted, no
  fashion-magazine attitude. Free, ships with a great variable
  cut.
- Body: **Inter** regular. Same family, different role. Two
  fonts total. One family means less to load, one voice
  throughout, less "designed."
- Numbers use `tabular-nums` because prices are the loudest
  thing on the page.

**Why for this reader.** He reads receipts, road signs, and
his phone. Inter is what all three look like. Bricolage
Grotesque, however good, reads as fashion — and this reader
is not the fashion buyer.

**Colour strategy.**
- Paper `#F7F5F0` — off-white with the barest warm bias, so it
  doesn't strobe under fluorescent shop light
- Ink `#111418` — near-black, sits on paper at ~15:1
- Rule `#D9D3C6` — a hairline warmer than the paper
- Grey `#5A6068` — muted secondary type
- **Accent: Van Red `#B33227`** — used on the primary CTA
  and nowhere else. This is the trade van paint stripe. Not
  amber, not brass — red is what British trades paint their
  own vans and lorries. Contrast on paper: 6.1:1.

**The structural idea that makes it not a template.**
The homepage is composed **as an invoice**. Ruled lines,
labelled rows, prices in the right column with `tabular-nums`.
The five-page structure becomes the argument by rendering it
as five rows on the home page's centre column — line 1 Home,
line 2 Services, line 3 About, line 4 Reviews, line 5 Contact,
with `£99` in the first column and `£300` in the go-live
column, `£399 total` ruled at the bottom. It reads as a
quote. Which is what a tradesman actually receives from a
supplier and trusts.

**Do this look expensive?** No — it looks like a printed
quote from a supplier. That's the entire point.

---

## Direction 2 — WORKSHOP JOURNAL

**Reference lineage.** Kinfolk, the Craftsman's newsletter,
The Modern House's property pages, Toast's catalogue,
Muji's typography — quiet paper stock, single-column setting,
generous margins, one photograph per spread.

**Typefaces.**
- Display: **Söhne Breit** or, as a free fallback, **Bricolage
  Grotesque at width 100**. The wider optical cut of the same
  face already on the site.
- Body: **Söhne Buch** or **Inter regular**. Consistent
  workaday sans.
- The current site's IBM Plex Mono stays for labels — it
  reads as "invoice" and doesn't need replacing.

**Why for this reader.** He respects craft. This is what a
plumber's own quote or a joiner's letterhead looks like when
it's been designed by someone who charges more than a template
shop. It flatters him without shouting.

**Colour strategy.** Paper cream `#F0EBE1`, ink navy
`#1E2733`, one accent — deep olive `#5F6B3E`. Reads as
"trusted, quiet, considered." Not warm, not editorial-cold
either.

**The structural idea.** One vertical column of type, 66ch
wide, no horizontal grid — like the page of a book. Every
section separated by a rule and a monospace label ("§ 1 · The
problem"). Photography is one image per section, real,
landscape-format, taken on a phone. This structure discards
the idea of "sections stacked in a grid" entirely.

**Does this look expensive?** Slight risk — cream-paper +
serif can read as "boutique" to this reader. The mitigation
is aggressive: no serif anywhere, all sans, tight margins on
mobile, prices set large as figures rather than as small
italic notation.

---

## Direction 3 — MANIFEST

**Reference lineage.** Craigslist, GOV.UK service pages,
IKEA's assembly instructions, Basecamp's marketing pages,
Signalvnoise's writing. Utilitarian to the point of
provocation. Text-first, decorative-zero.

**Typefaces.**
- **Verdana** for everything. Yes, Verdana. Screen-
  designed sans, ships on every OS, weight = zero download,
  legible at any size in any light. Semibold for headings,
  regular for body.
- Optionally IBM Plex Mono for labels.

**Why for this reader.** He is on 4G, on a phone, one-
handed. Verdana loads instantly and reads at any size.
There is no download waiting, no CLS shift, no font swap
flash. The whole page renders in the first paint.

**Colour strategy.** True white ground, near-black ink,
one accent — Post Office Red `#C8102E`. Nothing else.

**The structural idea.** The homepage IS the pricing page.
There is no hero. First thing on the page: a full-width
priced list with the deposit named. The whole thing reads
as a receipt printed by a machine. Every subsequent block
sits below it, labelled, un-styled.

**Does this look expensive?** No, it looks radical — which
is either a genius signal to the reader that we're not
another agency, or a fail signal that we're amateur. This
direction is a bet: does the reader value plainness enough
to trust it? On a UK trades buyer, roughly 30% probably do
and 70% probably don't. Risk highest of the three.

---

## Which one, and why

**Recommend: Direction 1 — Trade Van.**

The reader's world is red vans, printed invoices, and
GOV.UK. Direction 1 is the intersection of those three.
Direction 2 is craft-adjacent — it flatters him but risks
reading as "the designer thinks he's a joiner." Direction
3 is philosophically correct but commercially risky:
plainness that reads as choice needs a bigger brand behind
it than we can put behind it right now.

Direction 1 also survives the 30-second on-call test best:
buyer opens the site while the caller is still talking, sees
what looks like a supplier's price sheet, closes the objection
in his own head. That's the single most important reading of
the site the whole business turns on.

Weakest thing about Direction 1 that I'd want you to hear
before committing: **the invoice-as-hero idea is genuinely
different from anything on this list, and different is a
double-edged blade.** If it lands, it's the strongest thing
we could ship. If it doesn't land in usability testing (which
is really "the first 20 calls tomorrow"), it becomes a very
identifiable failure, harder to iterate away from than a
conventional hero would be. I'm arguing we ship it anyway
because the alternative — a fifteenth agency site with a
cleaner grid — closes nobody who wasn't already convinced.

## What I'd want to check before the guide is written

- The badge (`ams-badge.svg`) sits well on cream as well as it
  does on ink; I've checked it renders correctly at 32px on
  both. Confirmed.
- Bricolage's licence permits commercial use — yes, SIL Open
  Font License.
- Inter renders correctly in Bengali/Bangla contexts if the
  About page ever mentions Bogura — no dependency; About is
  set in Inter Latin. Confirmed.

## What comes next (if you pick 1)

I write GUIDE.md (13 sections, per brief §4) and specimen.html
(per §5). That is roughly a full working day. The specimen is
the artefact that proves the guide is real — I will not ship
the guide without it. After Phase 3 the brief instructs me to
stop; I am stopping here.

Reply with `1`, `2`, or `3` — or a genuine alternative if all
three miss.
