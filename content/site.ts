/**
 * Every user-facing string on the site.
 *
 * English only, no translation layer — but nothing is hardcoded in JSX either,
 * so adding one later is a mechanical change rather than a rewrite.
 *
 * Copy rules, enforced by review not by types:
 *   - Second person. It is about the visitor's business, not about us.
 *   - No agency vocabulary. No "solutions", "leverage", "craft", "passionate".
 *   - Short sentences. The reader is skimming on a phone.
 *   - Every claim is measurable, or it is deleted.
 */

export const SITE = {
  name: 'AZ Studio',
  domain: 'alizawad.online',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://alizawad.online',
  description:
    'Run a free automated audit of your website and find out what it is costing you. Web development for small businesses.',
  whatsapp: 'https://wa.me/8801921459811',
} as const;

export const NAV = {
  wordmark: 'AZ Studio',
  primaryAction: 'Book a call',
  skipToContent: 'Skip to content',
} as const;

export const HOME = {
  /**
   * Chosen headline. The other drafts are kept here rather than deleted so the
   * decision stays visible and reversible:
   *
   *   A. "Most business websites quietly lose customers. Find out if yours does."
   *   B. "Your website is either earning you customers or losing them. Find out which."
   *   C. "You can't see what your website does to visitors. This can."
   */
  headline: 'Most visitors leave before your homepage finishes loading. See what yours does.',
  inputLabel: 'Your website address',
  placeholder: 'yourwebsite.com',
  submit: 'Run the audit',
  submitting: 'Running',
  noSiteLink: "I don't have a website yet",
  /**
   * The three things somebody silently worries about before typing their domain
   * into a stranger's box: will this cost me, will I get spammed, how long will
   * it take. All three answers are true, which is the only reason they are here.
   */
  reassurance: 'Free. No email needed. Takes about 20 seconds.',
  errors: {
    empty: 'Enter your website address first.',
    shape: "That doesn't look like a web address. Try something like yourwebsite.com",
    local: 'That address only exists on your own computer, so there is nothing for us to check.',
  },
  proof: {
    caption: 'Recent work',
    credibility:
      'Every site above is live right now, and you can open it and check. The audit above runs the same checks these were built against.',
  },
} as const;

/** The four projects in the proof strip. Real screenshots, captured from live sites. */
export const PROJECTS = [
  {
    name: 'Startup Solution',
    href: 'https://www.startupsolution.online',
    image: '/proof/startupsolution.webp',
    imageSmall: '/proof/startupsolution-400.webp',
    imageMedium: '/proof/startupsolution-600.webp',
    caption: 'Business consultancy. Eight pages, one enquiry flow, live since launch.',
  },
  {
    name: 'Ahmed Mobasher',
    href: 'https://www.ahmedmobasher.online',
    image: '/proof/ahmedmobasher.webp',
    imageSmall: '/proof/ahmedmobasher-400.webp',
    imageMedium: '/proof/ahmedmobasher-600.webp',
    caption: 'Personal brand site. Contact routes straight to WhatsApp.',
  },
  {
    name: 'Cybertech',
    href: 'https://cybertech-web-btzy.vercel.app',
    image: '/proof/cybertech.webp',
    imageSmall: '/proof/cybertech-400.webp',
    imageMedium: '/proof/cybertech-600.webp',
    caption: 'Training institute. Course listings, admissions enquiries, student login.',
  },
  {
    name: 'Cutting Edge Lawn Care',
    href: 'https://cutting-edge-lawn-care-concept.vercel.app',
    image: '/proof/lawncare.webp',
    imageSmall: '/proof/lawncare-400.webp',
    imageMedium: '/proof/lawncare-600.webp',
    caption: 'Concept build for a local service business, around one action: get a quote.',
  },
] as const;

export const AUDIT = {
  runningTitle: 'Running the audit',
  liveRegionLabel: 'Audit progress',
  verdicts: {
    poor: 'This site is costing you customers.',
    fair: "This site works, but it's leaving money on the table.",
    good: 'This site is in good shape. The opportunity is elsewhere.',
  },
  scoreLabel: 'out of 100',
  scoreCaption: 'Measured on a mobile connection, the way most of your visitors arrive.',
  findingsTitle: 'What we found',
  recommendationTitle: 'What we would do about it',
  bookCta: 'Book a call',
  partialTitle: 'We could only finish part of this audit',
  partialNote:
    "Google's testing service didn't return load measurements for your site, so there's no score here — a score built from half the checks would be a made-up number. Everything below was measured directly on your page, and it all still counts.",
  rerunNote: 'Results are kept for 24 hours. Run it again tomorrow to see whether a change worked.',
  metaPrefix: 'Website audit for',
  /**
   * Said next to the button, where the hesitation actually happens. "Book a
   * call" is vague about what it costs you; this makes the commitment small and
   * specific, and it is the same promise made on the booking page itself.
   */
  ctaReassurance: 'Twenty minutes, no pitch. If we are not the right fit for this, we will say so on the call.',
  /**
   * The result is a permanent URL, and most owners are not the person who
   * maintains the site. Saying the link is theirs turns the audit into something
   * they hold — and forwarding it to their developer is how this spreads.
   */
  ownership: 'This page stays at this address. Send it to whoever looks after your site.',
  methodLink: 'How this audit works, and what it cannot tell you',
  closingTitle: 'What happens next',
  closingBody:
    'Book a call and we will go through this together — what to fix first, what can wait, and what it would take. If the answer is that you do not need us yet, that is a fine outcome for a twenty minute call.',
} as const;

/** Failure copy. Every one of these ends with a way forward. */
export const AUDIT_ERRORS: Record<string, { title: string; body: string }> = {
  invalid: {
    title: "That address didn't work",
    body: "We couldn't read that as a web address. Check the spelling and try again — you only need the domain, like yourwebsite.com.",
  },
  dns: {
    title: "That domain doesn't exist",
    body: "Nothing is registered at that address, or it isn't pointed anywhere yet. If you've just bought the domain, it can take a day to start working.",
  },
  unreachable: {
    title: "Your site didn't answer",
    body: "We reached the domain but the server never responded. That usually means the site is down right now — which is worth knowing on its own, because your customers are seeing the same thing.",
  },
  timeout: {
    title: 'Your site took too long to answer',
    body: 'We gave up after 20 seconds. A visitor gives up in about three. We cannot score what we cannot load, but a site that slow is already the finding.',
  },
  tls: {
    title: 'Your security certificate is broken',
    body: "The site is there, but the certificate is invalid or expired, so browsers show a full-page warning before anyone sees your homepage. This is usually a quick fix and it's costing you traffic right now.",
  },
  blocked: {
    title: 'Your site blocked the check',
    body: "A firewall or bot filter refused our request. That's often a sign of good security rather than a problem — it just means we can't measure the site from outside.",
  },
  'not-html': {
    title: "That address didn't return a web page",
    body: 'We got something back, but it was a file or a redirect rather than a page. Check that you gave us the address people actually visit.',
  },
  'redirect-loop': {
    title: 'Your site redirects in a loop',
    body: 'The address kept forwarding to itself and never landed on a page. Browsers give up on this too, so most visitors are seeing an error instead of your site.',
  },
  'rate-limited': {
    title: 'Too many audits from this connection',
    body: 'This runs a real measurement against Google, so there is a limit. Wait a few minutes and try again.',
  },
  upstream: {
    title: "The measurement service didn't respond",
    body: "This one is on us, not on your site. Google's testing service is busy or briefly down. Try again in a few minutes.",
  },
};

export const TIERS = {
  launch: {
    slug: 'launch',
    name: 'Launch',
    price: '$499',
    priceNote: 'one-off',
    timeline: '2 weeks',
    what: 'A small site that loads fast, works on a phone, and makes it obvious how to contact you. This is the version of your business a stranger sees before they decide whether to call.',
    includes: [
      'Up to 5 pages, written and built',
      'Built mobile-first, then checked on desktop',
      'Contact form, phone link and WhatsApp link',
      'Basic SEO: titles, descriptions, sitemap, structured data',
      'Hosting set up on your own domain, with HTTPS',
      'One round of revisions after launch',
    ],
    caseNote:
      'Startup Solution and the lawn care build in the strip on the homepage are both this size of job. Open either one and see what you get.',
    caseHref: 'https://www.startupsolution.online',
    caseLabel: 'startupsolution.online',
  },
  build: {
    slug: 'build',
    name: 'Build',
    price: '$999',
    priceNote: 'one-off',
    timeline: '4 to 6 weeks',
    what: 'A site that does something rather than just saying something. Customers book, pay, or log in without leaving and messaging you first.',
    includes: [
      'Everything in Launch',
      'A dashboard you log into, to see what is happening',
      'Payments, taking real money through Stripe',
      'User accounts with sign-in and password reset',
      'A database, so records survive and can be exported',
      'Email notifications on the events that matter to you',
      'Two rounds of revisions after launch',
    ],
    caseNote:
      'The client portal and admin dashboard behind this site are the same shape of work: a login, a database, and one screen per person who needs one.',
    caseHref: '/client-portal',
    caseLabel: 'the client portal',
  },
  scale: {
    slug: 'scale',
    name: 'Scale',
    price: 'Custom',
    priceNote: 'quoted per project, plus a monthly retainer',
    timeline: 'From 8 weeks, then ongoing',
    what: 'A full web application, and someone accountable for keeping it running after it ships. This is for a business where the software is the operation, not a brochure in front of it.',
    includes: [
      'Full application design and build',
      'Integrations with the tools you already run on',
      'Ongoing development after launch, monthly',
      'Monitoring and uptime alerting',
      'A response-time SLA, written down',
      'Direct access on WhatsApp during working hours',
    ],
    caseNote:
      'No case study here yet, and inventing one would be the wrong way to start. Scale work is quoted after a call, against what your operation actually does.',
    caseHref: null,
    caseLabel: null,
  },
} as const;

export type TierSlug = keyof typeof TIERS;
export const TIER_ORDER: TierSlug[] = ['launch', 'build', 'scale'];

export const SERVICE_PAGE = {
  whatTitle: 'What this is',
  includesTitle: "What's included",
  priceTitle: 'Price',
  timelineTitle: 'Timeline',
  caseTitle: 'A relevant case',
  cta: 'Book a call',
} as const;

export const BOOK = {
  title: 'Book a call',
  intro:
    'Twenty minutes, no pitch. Tell us what the site needs to do and we will tell you what it would take. If we are not the right fit we will say so on the call.',
  contextTitle: 'From your audit',
  fields: {
    name: 'Your name',
    email: 'Email',
    whatsapp: 'WhatsApp number',
    message: 'What do you need the site to do?',
    messagePlaceholder: 'A sentence or two is plenty.',
  },
  submit: 'Book a call',
  submitting: 'Sending',
  success: {
    title: 'Got it.',
    body: 'We will reply within one working day, on WhatsApp if you left a number.',
  },
  /**
   * Shown when there is no mail provider configured and delivery happens over
   * WhatsApp instead. It needs one more tap from the visitor, so we say that
   * plainly rather than showing a "sent" screen for a message still sitting in
   * the browser.
   */
  handoff: {
    title: 'One more tap.',
    body: 'Your message is ready to send on WhatsApp — everything you typed is already in it, including your audit if you came from one. Nothing reaches us until you hit send there.',
    cta: 'Send it on WhatsApp',
  },
  errors: {
    name: 'Tell us what to call you.',
    email: 'We need an email address that works.',
    message: 'One sentence about what you need is enough.',
    server: 'That did not send. Message on WhatsApp and we will pick it up there.',
  },
} as const;

export const FOOTER = {
  tagline: 'Web development for small businesses.',
  servicesLabel: 'Services',
  moreLabel: 'More',
  rights: (year: number) => `© ${year} AZ Studio`,
  links: {
    method: 'How the audit works',
    book: 'Book a call',
    portal: 'Client portal',
    whatsapp: 'WhatsApp',
  },
} as const;

export const NOT_FOUND = {
  title: 'That page is not here.',
  body: 'The link may be old. You can audit your site from the homepage, or book a call.',
  cta: 'Go to the homepage',
} as const;
