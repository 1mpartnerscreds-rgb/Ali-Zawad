export const SITE = {
  name: 'AIMS Studio',
  domain: 'aimsstudio.online',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aimsstudio.online',
  title: 'AIMS Studio — websites for small businesses',
  description:
    'A five-page website for your business, live in two weeks. £399 to start. Fixed price, fixed date, everything in your name.',
  email: 'hello@aimsstudio.online',
  phone: '+8801921459811',
} as const;

export const OPENING = {
  wordmark: 'AIMS Studio',
  /* Broken by hand. Each line is its own mask band, so a line that wraps splits
     across two bands and the reveal reads as an accident. */
  statement: ['Your customers', 'looked you up', 'and found', 'nothing.'],
  sub: 'A five-page website for your business, live in two weeks.',
} as const;

export const GAP = {
  marker: 'The problem',
  lines: [
    'You are good at the job.',
    'Your reviews say so.',
    'But when someone searches your name, they find a Facebook page from 2019 and a Yell listing you never wrote.',
  ],
} as const;

/**
 * Real work, live right now. Every one of these can be opened and checked,
 * which is the only reason to put them on the page at all.
 */
export const REEL = {
  marker: 'Built and running',
  pieces: [
    {
      id: 'startupsolution',
      client: 'Startup Solution',
      kind: 'Live',
      href: 'https://www.startupsolution.online',
      host: 'startupsolution.online',
      image: '/proof/startupsolution.webp',
      imageSmall: '/proof/startupsolution-400.webp',
      imageMedium: '/proof/startupsolution-600.webp',
      note: 'Business consultancy. Eight pages, one enquiry flow, shipped in nine days.',
    },
    {
      id: 'cybertech',
      client: 'Cybertech',
      kind: 'Live',
      href: 'https://www.cybertechedu.com',
      host: 'cybertechedu.com',
      image: '/proof/cybertech.webp',
      imageSmall: '/proof/cybertech-400.webp',
      imageMedium: '/proof/cybertech-600.webp',
      note: 'Training institute in Bogura, running since 2000. Course listings, admissions, student login.',
    },
    {
      id: 'lawncare',
      client: 'Cutting Edge Lawn Care',
      kind: 'Live',
      href: 'https://cutting-edge-lawn-care-concept.vercel.app',
      host: 'cutting-edge-lawn-care',
      image: '/proof/lawncare.webp',
      imageSmall: '/proof/lawncare-400.webp',
      imageMedium: '/proof/lawncare-600.webp',
      note: 'Local service business in Austin. Built around one action: get a free estimate.',
    },
    {
      id: 'ahmedmobasher',
      client: 'Ahmed Mobasher',
      kind: 'Live',
      href: 'https://www.ahmedmobasher.online',
      host: 'ahmedmobasher.online',
      image: '/proof/ahmedmobasher.webp',
      imageSmall: '/proof/ahmedmobasher-400.webp',
      imageMedium: '/proof/ahmedmobasher-600.webp',
      note: 'Personal brand site. Every contact route lands in one WhatsApp thread.',
    },
  ],
} as const;

export const WORKS = {
  marker: 'How it works',
  steps: [
    {
      n: '01',
      title: 'You talk, we write it down.',
      body: 'One call. What you do, where you cover, what you want the phone to ring about. No brief to fill in.',
    },
    {
      n: '02',
      title: 'Half up front. Two weeks.',
      body: 'You pay half to start and see the first version inside a week. Nothing is hidden until the end.',
    },
    {
      n: '03',
      title: 'It goes live. You pay the rest.',
      body: 'Your domain, your hosting, in your name. One round of changes after launch, and we answer by email when something breaks.',
    },
  ],
} as const;

export const PRICES = {
  marker: 'Price',
  tiers: [
    {
      name: 'Launch',
      price: '£399',
      note: 'five pages · two weeks',
      includes: [
        'Home, services, areas covered, reviews, contact',
        'Your phone number on every screen, one tap to call',
        'Built for phones first',
        'Your own domain, set up for you',
        'Your Google reviews on the page',
        'One round of changes after launch',
      ],
    },
    {
      name: 'Build',
      price: '£799',
      note: 'everything above, plus a site that does things',
      includes: [
        'Online booking or enquiry system',
        'Take payments through the site',
        'Customer logins',
        'A dashboard you can actually read',
        'Email alerts when someone books',
        'Two rounds of changes after launch',
      ],
    },
  ],
  foot: 'Half up front, half when it is live. No monthly fee. Paid by bank transfer.',
} as const;

export const TRUST = {
  marker: 'Why AIMS',
  lines: [
    'Fixed price and a fixed date, agreed before anything starts.',
    'Your domain, your hosting, your accounts. All in your name.',
    'Building for small businesses since 2022, working UK hours.',
  ],
  quotes: [
    {
      text: 'Ali delivered our platform two weeks ahead of schedule. The code quality was exceptional. Our engineering team was genuinely impressed.',
      who: 'Founder, 1M Partners',
    },
    {
      text: 'The sophistication of the design and the sheer quality of execution set a new standard for our brand.',
      who: 'Managing Director, Cybertech',
    },
  ],
} as const;

export const CONTACT = {
  marker: 'Start',
  line: 'Tell us what your business does.',
  body: 'A ten minute call. If a website is not what you need, we will say so.',
  emailLabel: 'Email us',
  replyNote: 'We reply the same working day.',
} as const;
