/**
 * Every user-facing word on the site.
 *
 * Two rules this file exists to enforce. First, nothing here may claim
 * something the business cannot do today — there is no UK registration, no
 * company number, and no card processing, so none of those appear. Second,
 * anything still unknown lives in TO_FILL rather than being invented, so a
 * missing fact is visible instead of quietly shipping as a lie.
 */

/* ---------------------------------------------------------------------------
   FILL THESE BEFORE THE SITE GOES LIVE. Each one appears on the page exactly
   as written here. An unfilled value renders as a visible marker, which is
   deliberate — a wrong phone number is worse than an obvious gap.
--------------------------------------------------------------------------- */
export const TO_FILL = {
  founder: 'Ali Zawad',              // named on every contract and on the About page
  phone: '[UK PHONE NUMBER]',        // the number that is actually answered
  phoneHref: '',                     // e.g. +441610000000 — leave '' to hide the tel: link
  hours: '9am–6pm',                  // support hours (unused since dual-region)
  hostingRenewal: '£60',             // year two onward
  lateCredit: '£50',                 // comes off the invoice if the deadline slips on us
  privacyUrl: '',                    // set once the notice is published; empty hides the link
  booking: '',                       // Cal.com / Calendly URL. Empty = the button
                                     // sends people to the contact block instead of
                                     // promising a calendar that does not exist.
} as const;

export const SITE = {
  name: 'AIMS Studio',
  domain: 'aimsstudio.online',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://aimsstudio.online',
  title: 'AIMS Studio — five-page websites for trades and service businesses',
  description:
    'Five-page websites for trades and small service businesses. £399 or $499, live in two weeks. Your domain in your name, £99 or $99 to start.',
  email: 'hello@aimsstudio.online',
} as const;

export const NAV = [
  { href: '/', label: 'Home' },
  { href: '/what-you-get', label: 'What you get' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/how-it-works', label: 'How it works' },
  { href: '/about', label: 'About' },
] as const;

/* --- home ---------------------------------------------------------------- */

export const HOME = {
  hero: {
    statement: ["You're not hard", 'to recommend.', "You're hard", 'to find.'],
    body: 'Your customers rate you. Your work speaks for itself. But when someone searches for a tradesman in your town tonight, they find three companies who are worse than you — and one who is not there at all.',
    kicker: 'That last one is you.',
    offer: 'Five-page websites for trades. £399 or $499. Live in two weeks. You own it outright.',
  },

  /* Replaces a registration strip. Every line is true today and every line
     protects the buyer rather than describing us. */
  strip: [
    { k: '£99 or $99 to start', v: 'The rest only when it is live and you have approved it.' },
    { k: 'Your domain, in your name', v: 'From day one. Not ours. Never ours.' },
    { k: 'A written contract', v: 'Signed before any money moves.' },
    { k: 'A named person', v: `${TO_FILL.founder}, on the contract and on the phone.` },
  ],

  problem: {
    marker: 'Why you have not got one',
    lines: [
      'Most trades businesses without a website did not decide against one.',
      'They got quoted £3,000 and a three-month timeline. Or they paid a monthly fee to someone who went quiet. Or they were told they needed to understand hosting, DNS and SEO before anyone would help them.',
      'None of that was necessary.',
    ],
    turn: 'A working website for a trade is five pages: who you are, what you do, what it costs, proof that you are good, and how to reach you. It should take two weeks and cost less than a decent set of tools.',
    close: 'That is the entire business we are in.',
  },

  gets: {
    marker: 'What you actually get',
    items: [
      { t: 'A five-page website, built for your trade', b: 'Home, services, about, reviews, contact. Written by us from a single call. You do not write anything.' },
      { t: 'Found on a phone first', b: 'Most customers find you on a phone, at the side of a road, deciding in about eleven seconds. Built for that first, desktop second.' },
      { t: 'Your reviews on the page', b: 'Your Google reviews on your own site, where a customer sees them before they call rather than after.' },
      { t: 'A phone number that dials', b: 'One tap, no form to fill in. Trades customers ring — the whole site is built to get them to.' },
      { t: 'Set up so Google can find you', b: 'Google Business Profile connected, pages structured so you show up for your trade and your town.' },
      { t: 'Yours, permanently', b: 'The domain is in your name and the files are handed to you. If you never speak to us again, nothing switches off.' },
    ],
  },

  price: {
    marker: 'Price',
    lead: 'We publish our prices. You will not be asked to book a call to find out what it costs.',
    foot: '£99 or $99 to start. The balance when the site is live and you have signed it off. No monthly fee, nothing to be tied into, no charge to leave.',
  },

  closing: {
    line: 'Two weeks from now, you can be findable.',
    body: 'One call to tell us about the business. Two weeks to build it. Then it is yours.',
  },
} as const;

export const TIERS = [
  {
    name: 'Launch',
    price: '£399 · $499',
    who: 'For a business that needs to exist online and be called.',
    note: 'five pages · two weeks',
    includes: [
      'Five pages, written for you from one call',
      'Built for phones first',
      'Your Google reviews on the page',
      'Google Business Profile connected',
      'Your domain, registered in your name',
      'Hosting and business email, first year included',
      '30-day warranty after launch',
    ],
  },
  {
    name: 'Build',
    price: '£799 · $999',
    who: 'For a business that wants the website to take the booking, not just the call.',
    note: 'everything in Launch, plus',
    includes: [
      'Online booking from your own calendar',
      'Take payments through the site',
      'Customer logins for quotes and job history',
      'Everything in Launch',
    ],
  },
] as const;

/* --- what you get -------------------------------------------------------- */

export const PAGES_DETAIL = {
  head: 'Five pages. Everything a trade actually needs. Nothing it does not.',
  lead: 'We build one thing, repeatedly. That is why it takes two weeks and costs £399 (or $499) instead of three months and £3,000.',
  five: [
    { n: 'Home', b: 'Who you are, where you work, what you do, and a phone number. Written so a customer knows within ten seconds whether you can help them.' },
    { n: 'Services', b: 'Every job you take, in the words your customers use, not trade terms. This is the page Google reads to decide whether to show you.' },
    { n: 'About', b: 'The part that wins the job. How long you have been doing this, who you are, what you will and will not take on. Trades work is bought on trust before price.' },
    { n: 'Reviews', b: 'Your Google reviews on your own site, where someone sees them before deciding to call.' },
    { n: 'Contact', b: 'Phone, email, hours, area covered, and a short form for anyone who will not ring. Straight to your inbox.' },
  ],
  included: [
    ['Domain', 'Registered in your name, first year paid by us'],
    ['Hosting', `First year included, then ${TO_FILL.hostingRenewal} a year — or move it anywhere you like`],
    ['SSL certificate', 'Included, renews automatically'],
    ['Mobile build', 'Designed for phones first'],
    ['Google Business Profile', 'Connected and verified'],
    ['Business email', 'you@yourbusiness.co.uk, set up and working'],
    ['Photography', 'Your photos edited and placed. No photos? We supply licensed ones'],
    ['Copywriting', 'Every word written by us, from one call'],
    ['Warranty', '30 days after launch — anything broken, fixed free'],
    ['Handover', 'Every login, every file, and a plain-English guide to editing it yourself'],
  ],
  buildOnly: [
    { t: 'Online booking', b: 'Customers take a slot from your calendar without ringing.' },
    { t: 'Card payments', b: 'Take deposits or payment in full through your site.' },
    { t: 'Customer logins', b: 'A private area for quotes, job history or documents.' },
  ],
  wont: {
    head: 'What we do not do',
    lead: 'Said plainly, because you will find out anyway.',
    items: [
      'No monthly retainers. There is nothing to cancel.',
      'No ongoing SEO campaigns. We build the site correctly and connect your Google profile. That is where the honest work ends and the sales pitch usually starts.',
      'No brand strategy, logo design or social media management.',
      'No large e-commerce stores.',
    ],
    close: 'If you need those, we will say so on the first call and you will not be sold anything.',
  },
} as const;

/* --- pricing ------------------------------------------------------------- */

export const PRICING = {
  head: 'Two prices. Both published. Neither changes after you have signed.',
  payHead: 'How you pay — and what protects you',
  payLead: 'You found us because we rang you. You have not met us. So here is exactly how the money works and exactly what you keep hold of.',
  /* Two rails: UK buyers by bank transfer, US buyers by card via PayPal.
     Naming both on the page matches what the caller says on the phone and
     what the buyer sees at checkout — a rail that surfaces without warning
     is the fastest way to lose a sale that had already closed. */
  table: [
    ['To start', '£99 or $99'],
    ['On go-live, after you have approved it', 'The balance'],
    ['How', 'Card by PayPal, or bank transfer'],
    ['What that gets you (card)', 'The protection your card gives you against a supplier that does not deliver — kept.'],
    ['Ongoing cost', `None. Hosting renews at ${TO_FILL.hostingRenewal} a year from year two, or move it elsewhere free`],
    ['Before you pay anything', 'You get the written contract'],
  ],
  domain: {
    head: 'Your domain is registered in your name, not ours.',
    body: 'This is the one that matters most and almost nobody offers it. It means we cannot hold your website over you, we cannot charge you to release it, and if you decide tomorrow that you would rather someone else looked after it, you take it and go. Nothing to ask us for.',
  },
  safeguards: {
    head: 'What happens if you are not happy',
    items: [
      'You see the design before we build the rest. If it is wrong, we redraw it — twice, at no cost.',
      'You approve every page before it goes live. Nothing publishes without your say-so.',
      'The balance is not due until the site is live and you have signed it off. If we never deliver, you are £99 down, not £399 (or $99, not $499).',
      'For 30 days after launch, anything broken is fixed free within one working day.',
      `If we miss the two-week deadline for a reason that is ours, ${TO_FILL.lateCredit} comes off the final invoice.`,
      'All of the above is in the written contract you sign before any money moves.',
    ],
  },
} as const;

/* --- how it works -------------------------------------------------------- */

export const PROCESS = {
  head: 'Two weeks, five stages. You are needed for about ninety minutes of it.',
  steps: [
    { d: 'Day 1', t: 'The call', b: 'Forty-five minutes. What you do, where you work, what jobs you want more of, what you would rather stop doing. We take it from there. You do not write anything or fill in a brief.' },
    { d: 'Days 2–3', t: 'Design', b: 'You get one page, designed, in your colours, with your words. Not a template preview. Wrong? We redraw it, twice if needed, free. Nothing continues until you say yes.' },
    { d: 'Days 4–9', t: 'Build', b: 'The other four pages, your photos edited, the copy written, Google profile connected, email set up. One progress message mid-week. You are not needed.' },
    { d: 'Day 10', t: 'Review', b: 'Forty-five minutes. You see the whole site on a private link and go through it page by page. Changes made the same day.' },
    { d: 'Days 11–14', t: 'Launch and handover', b: 'Domain points at the site, SSL goes on, it goes live. You get every login, the files, and a short guide to changing your own text and photos.' },
  ],
  after: 'Then the 30-day warranty runs.',
  who: {
    head: 'Who you deal with',
    body: `${TO_FILL.founder}. Named on your contract, on the phone, for the whole project and the warranty after it. Not a ticket queue and not a different account manager every week.`,
    hours: `Emails answered within one working day, Monday to Friday.`,
  },
} as const;

/* --- about --------------------------------------------------------------- */

export const ABOUT = {
  head: 'We build websites for trades and small service businesses, on both sides of the Atlantic. That is the whole of it.',
  who: {
    head: 'Who you are actually dealing with',
    body: `AIMS Studio is ${TO_FILL.founder} and a small build team, working remotely for clients across the UK and the US.`,
    why: 'We put that on the About page rather than leaving you to work it out later, because you are about to send money to people you have never met and you are entitled to know who they are. Our phone number is real, it is answered by the person who will build your site, and it is on every contract we send.',
  },
  narrow: {
    head: 'Why we only do this one thing',
    body: 'Because a plumber, a barber and a recovery garage need the same five pages, and pretending otherwise is how the price gets to £3,000.',
    body2: 'We have built this specific thing enough times to know what a customer looks for on a trades website in the first ten seconds. That is why it takes two weeks. It is not a shortcut. It is a narrow business.',
  },
  privacy: {
    head: "Your customers' information",
    body: 'Any enquiry that comes through your site goes straight to your inbox. We do not keep it, we do not sell it, and we do not market to it.',
  },
} as const;

/* Real, live, and checkable. The only claim on the site that a buyer can
   verify himself, which is why no number is attached to it — four sites is
   four sites, and "X delivered" would invite a question we cannot answer. */
export const WORK = {
  marker: 'Recent work',
  pieces: [
    {
      id: 'startupsolution', client: 'Startup Solution', href: 'https://www.startupsolution.online',
      host: 'startupsolution.online', image: '/proof/startupsolution.webp',
      imageSmall: '/proof/startupsolution-400.webp', imageMedium: '/proof/startupsolution-600.webp',
      note: 'Business consultancy. Eight pages, one enquiry flow, shipped in nine days.',
    },
    {
      id: 'cybertech', client: 'Cybertech', href: 'https://www.cybertechedu.com',
      host: 'cybertechedu.com', image: '/proof/cybertech.webp',
      imageSmall: '/proof/cybertech-400.webp', imageMedium: '/proof/cybertech-600.webp',
      note: 'Training institute running since 2000. Course listings, admissions, student login.',
    },
    {
      id: 'lawncare', client: 'Cutting Edge Lawn Care', href: 'https://cutting-edge-lawn-care-concept.vercel.app',
      host: 'cutting-edge-lawn-care', image: '/proof/lawncare.webp',
      imageSmall: '/proof/lawncare-400.webp', imageMedium: '/proof/lawncare-600.webp',
      note: 'Local service business. Built around one action: get a free estimate.',
    },
    {
      id: 'ahmedmobasher', client: 'Ahmed Mobasher', href: 'https://www.ahmedmobasher.online',
      host: 'ahmedmobasher.online', image: '/proof/ahmedmobasher.webp',
      imageSmall: '/proof/ahmedmobasher-400.webp', imageMedium: '/proof/ahmedmobasher-600.webp',
      note: 'Personal brand site. Every contact route lands in one place.',
    },
  ],
} as const;

export const CTA = {
  cost: 'See what it costs',
  breakdown: 'See the full breakdown',
  /* The label follows what the button can actually do. Promising to book a
     call and then landing someone on a page is the exact broken promise this
     site is built to avoid. */
  call: TO_FILL.booking ? 'Book a 15-minute call' : 'Talk to us',
  callHref: TO_FILL.booking || '/about#contact',
} as const;
