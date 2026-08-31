# AIMS brand marks

- `ams-source.png` — the supplied artwork, as received.
- `ams-badge.svg` — the badge traced to a single vector path, normalised into a
  100×100 box and filled with `currentColor`. This is the master; everything
  else is derived from it.

Derived, in `app/`:

- `icon.svg` — the mark inset 8% on a full-bleed `#F8F2E8` ground. The ground is
  there so the icon stays legible on a dark browser tab, where a navy mark on
  transparent would disappear.
- `favicon.ico` — 16/32/48. The 16px frame carries its own full-bleed artwork:
  at that size the 8% inset costs enough linear space that the letterforms stop
  resolving, so the tile *is* the mark.
- `apple-icon.png` — 180×180, same inset artwork. Full-bleed ground is required
  because iOS applies its own rounded mask.

`components/logo.tsx` inlines the same path for the page header. It fills with
`currentColor` rather than the artwork's navy, so the mark inverts with the
Ink/Bone tokens and the site stays two-tone — the navy is kept for the icons,
which are seen outside the page.

Regenerating: the trace script is not checked in; the master SVG is the artifact.
