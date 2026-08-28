export const SITE = {
  name: 'AZ Studio',
  domain: 'alizawad.online',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alizawad.online',
  title: 'AZ Studio — front-end and motion for brand studios',
  description:
    'White-label front-end build partner. Brand studios keep the client and the credit; I build the parts that move.',
  // Placeholder until the real inbox is confirmed. Single conversion point on
  // the site, so it has to be an address that is actually watched.
  email: 'hello@alizawad.online',
} as const;

export const OPENING = {
  wordmark: 'AZ Studio',
  /* Broken by hand. Each line is its own mask band, so a line that wraps splits
     across two bands and the reveal reads as an accident. */
  statement: ['Brand studios', 'hire me for', 'the parts', 'that move.'],
} as const;

export const GAP = {
  marker: 'The gap',
  lines: [
    'You sold them a system.',
    'The builder gives them a template of it.',
    'Rhythm and timing are the first things it drops.',
  ],
} as const;

/**
 * Three rebuilds, none of them commissioned. Each is built in the page rather
 * than recorded, so what a visitor scrubs is the running thing, not footage of
 * it. Labelled as rebuilds because ambiguity about what was paid work is the
 * fastest way to lose the person this site is written for.
 */
export const REEL = {
  marker: 'The reel',
  pieces: [
    {
      id: 'aesop',
      client: 'Aesop',
      kind: 'Unsolicited rebuild',
      note: 'A catalogue is a list of names. Reading it should feel like type setting itself, not a carousel advancing.',
      technique: 'Variable width axis, scrubbed',
    },
    {
      id: 'monocle',
      client: 'Monocle',
      kind: 'Unsolicited rebuild',
      note: 'Winkreative drew the masthead. It should assemble on arrival, and come apart if you scroll back.',
      technique: 'Staggered mask wipes, reversible',
    },
    {
      id: 'vitsoe',
      client: 'Vitsœ',
      kind: 'Unsolicited rebuild',
      note: 'The whole argument is a system that adapts. So the shelf reconfigures while you read that sentence.',
      technique: 'Path drawing on scroll',
    },
  ],
} as const;

export const PARTNERSHIP = {
  marker: 'How it works',
  statements: [
    'Your studio keeps the client and the relationship.',
    "The work ships under your name. I'm not in the credits, the code comments, or the footer.",
    'NDA before the first brief. IP assigned to you on delivery.',
  ],
} as const;

export const RATES = {
  marker: 'Rates',
  rows: [
    { label: 'Single interactive section', value: '600 — 900' },
    { label: 'Full front-end build', value: '2,000 — 3,500' },
    { label: 'Ongoing capacity', value: '1,500 — 2,500 / mo' },
  ],
  unit: 'USD',
} as const;

export const CONTACT = {
  marker: 'Contact',
  line: 'Send me the brand book.',
} as const;
