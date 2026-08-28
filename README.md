# AZ Studio

Front-end and motion for brand studios. White-label: the studio keeps the
client, the credit and the margin.

```bash
npm install && npm run dev
npm run build && npm start
```

## What this site is

The portfolio, not a description of one. Every claim in the copy is redundant
with something the page is already doing — the reel pieces are built in the
page and scrub under the reader's scroll rather than playing as recordings.

Six movements: opening, the gap, the reel, terms, rates, contact. Total copy is
208 words.

## Motion

Lenis drives scroll position, GSAP ScrollTrigger reads it, and both run off
gsap's single ticker — two independent rAF loops disagree by a half-frame,
which shows up as jitter on exactly the pinned sections that are the argument.

Everything is scrubbed rather than triggered. Text reveals are masked wipes; the
type is in place by default and only pushed out of frame once JavaScript has
confirmed it can bring it back, so a failed script leaves a readable page.

Three moments are extraordinary and the rest is still: the load sequence, the
reel, the contact reveal.

**Reduced motion removes scrub entirely.** The reel only exists because the
track is translated — with nothing translating it, two of three panels sit
outside an `overflow: hidden` frame with no way to reach them. So it stops being
a rail and becomes the vertical sequence the markup already is. Motion may be
absent; the work may not. Same behaviour under 900px.

## Design

Two tones, no accent. Ink `#14161A`, Bone `#E8E4DC`, and two greys derived from
Ink for hairlines and secondary type. The only colour anywhere comes from inside
the reel pieces. Contrast is AA on both surfaces; one grey cannot serve both, so
each carries an inverted counterpart made the same way.

Three type roles: **Bricolage Grotesque** for display, set at `wdth` 88 for the
statement and 100 elsewhere; **Newsreader** for reading; **IBM Plex Mono** for
frame counts, easing labels, section markers and rates. Radii are sharp
throughout. Vertical rhythm is deliberately uneven.

The signature element is the playhead: the page is a timeline and the scrollbar
is a scrub head, so a fixed monospace readout counts frames against a fixed
duration. It updates by writing `textContent` directly rather than through React
state, and inverts over Bone sections with `mix-blend-mode: difference` instead
of a listener watching what is underneath it.

Where a curve is named, it is drawn from the same four numbers gsap eases with —
`components/motion.ts` is the single source for both.

## Measured

| | |
|---|---|
| Lighthouse | 96 perf / 100 a11y / 100 best-practices / 100 SEO |
| LCP | 2.8s on Lighthouse's simulated slow 4G — see below |
| CLS | 0 |
| TBT | 0ms |
| Client JS | 181KB gzipped (budget 200KB) |
| Horizontal scroll | none, at 1440 and 375, both motion modes |

**LCP misses the 2.0s budget.** 2.8s is against Lighthouse's simulated *slow*
4G — 1.6Mbps and 150ms RTT, measured against localhost with no CDN. Real 4G is
several times that. Two things already went into it: the display face is subset
to the 92 characters the site sets in it (78KB → 41KB, both axes intact), and
the body face is a static cut rather than a 132KB variable file that sat in the
critical chain. The remaining cost is framework JavaScript. Astro would remove
most of it and is the change that would actually meet the number.

## Fonts

`app/fonts/bricolage-subset.woff2` is generated, not vendored blind. Regenerate
if display copy gains characters:

```bash
pyftsubset <source>.woff2 --output-file=app/fonts/bricolage-subset.woff2 \
  --flavor=woff2 --text-file=<chars> --layout-features='kern,liga,calt' \
  --no-hinting --desubroutinize
```

## Carried over

`public/client-portal.html` and `public/admin-dashboard.html` are the previous
client-facing apps, still served at `/client-portal` and `/admin-dashboard` with
their Supabase config untouched. They are client infrastructure, not marketing,
and nothing on this site links to them.

## Open

The contact address is `hello@alizawad.online` pending confirmation. It is the
only conversion point on the site and is set at display scale, so it needs to be
an inbox that is actually watched.
