/**
 * Finding copy.
 *
 * Rule, without exception: the consequence leads, the metric follows in small
 * secondary text. A business owner does not know what LCP is and should not
 * have to. They know what "people leave before it loads" means.
 */

const seconds = (ms: number) => (ms / 1000).toFixed(1);
const mb = (bytes: number) => (bytes / 1_000_000).toFixed(1);

/**
 * How a measurement was taken, in words a business owner can check.
 *
 * `field` means Google recorded it from real people visiting the site. `lab`
 * means we ran a simulation because the site has too little traffic for real
 * data — a deliberately harsh one, on a mid-range phone over a slow connection.
 * Those two things must never be described in the same sentence, because one is
 * evidence about their customers and the other is a stress test.
 */
export type Source = 'field' | 'lab';

const provenance = (source: Source, scope: 'page' | 'origin' | null) =>
  source === 'field'
    ? `Measured by Google from real visits ${scope === 'origin' ? 'across your site' : 'to this page'} over the last 28 days, for the slowest quarter of them.`
    : 'Measured in a simulation on a mid-range phone over a slow connection, because your site does not yet get enough traffic for Google to report on real visits. Treat it as a stress test rather than a typical visit.';

export const FINDING_COPY = {
  lcpSlow: (ms: number, source: Source, scope: 'page' | 'origin' | null) => ({
    headline:
      source === 'field'
        ? `For a quarter of the people who visit you on a phone, your homepage takes ${seconds(ms)} seconds to show up. Most of them leave before it finishes.`
        : `On a mid-range phone over a slow connection, your homepage takes ${seconds(ms)} seconds to show up. Anyone on a weak signal is leaving before it finishes.`,
    metric: `Largest Contentful Paint — how long until the main thing on screen appears: ${seconds(ms)}s. Google treats anything over 2.5s as slow. ${provenance(source, scope)}`,
  }),
  lcpFast: (ms: number, source: Source, scope: 'page' | 'origin' | null) => ({
    headline:
      source === 'field'
        ? `Your homepage shows up in ${seconds(ms)} seconds for people on a phone. That is faster than most sites we test.`
        : `Your homepage shows up in ${seconds(ms)} seconds even on a mid-range phone over a slow connection. That is faster than most sites we test.`,
    metric: `Largest Contentful Paint — how long until the main thing on screen appears: ${seconds(ms)}s. ${provenance(source, scope)}`,
  }),
  inpSlow: (ms: number, scope: 'page' | 'origin' | null) => ({
    headline: `When someone taps something on your site, it takes about ${Math.round(ms)} milliseconds to react. Long enough that people tap again, thinking it did not work.`,
    metric: `Interaction to Next Paint — the delay between a tap and the screen changing: ${Math.round(ms)}ms. Google treats anything over 200ms as a problem. ${provenance('field', scope)}`,
  }),
  tbtHigh: (ms: number) => ({
    headline: 'Your page looks ready before it is. Someone tapping your menu in the first seconds gets nothing back.',
    metric: `Total Blocking Time — how long the page is too busy to respond to a tap: ${Math.round(ms)}ms. Google treats anything over 200ms as a problem. ${provenance('lab', null)}`,
  }),
  clsHigh: (value: number, source: Source, scope: 'page' | 'origin' | null) => ({
    headline: 'Content jumps around while your page loads. People tap the wrong thing, then stop trusting the page.',
    metric: `Cumulative Layout Shift — how much the page moves while it loads: ${value.toFixed(2)}. Google treats anything over 0.1 as unstable. ${provenance(source, scope)}`,
  }),
  noViewport: () => ({
    headline:
      'Your site is not set up for phones. It loads at desktop width, so a customer has to pinch and zoom to read anything.',
    metric: 'No viewport meta tag in the page head.',
  }),
  viewportFixedWidth: (width: number) => ({
    headline: `Your site is built to a fixed ${width}-pixel width, so on a phone it is cut off at the edge. Visitors have to drag sideways to finish a sentence, and most of them just leave.`,
    metric: `The page's viewport tag is set to width=${width} instead of width=device-width, which tells every phone to lay the page out at desktop size and crop it.`,
  }),
  zoomDisabled: () => ({
    headline:
      'Your site stops people zooming in. Anyone who cannot comfortably read text at its default size has no way to make it bigger, and simply leaves.',
    metric: 'The viewport tag disables pinch-to-zoom (user-scalable=no, or a maximum-scale below 5).',
  }),
  contentTooWide: () => ({
    headline: 'Your page is wider than a phone screen. Visitors have to scroll sideways to finish a sentence.',
    metric: 'Page content overflows the mobile viewport.',
  }),
  noContact: () => ({
    headline: 'There is no way to contact you on the page. Someone ready to buy has nowhere to go.',
    metric: 'No phone link, email link, WhatsApp link or contact form found in the homepage markup.',
  }),
  contactOk: (kinds: string[]) => ({
    headline: `A customer can reach you from the homepage — you have ${kinds.slice(0, 2).join(' and ')}.`,
    metric: `Found: ${kinds.join(', ')}.`,
  }),
  noHttps: () => ({
    headline:
      'Your site does not load securely. Chrome puts "Not secure" next to your address, and some visitors stop right there.',
    metric: 'The homepage did not resolve over HTTPS with a valid certificate.',
  }),
  genericTitle: (title: string | null) => ({
    headline: title
      ? `Your page title reads "${title}". That is the headline Google shows in search results, and it is telling people nothing.`
      : 'Your page has no title. Google invents one, and browser tabs show your bare domain.',
    metric: title ? `<title> is "${title}".` : 'No <title> tag found.',
  }),
  noDescription: () => ({
    headline:
      'Google is writing your search listing for you, by scraping whatever text it finds first. You are not choosing what people read before they click.',
    metric: 'No meta description tag.',
  }),
  outsourcedPortal: (hosts: string[]) => ({
    headline: `To pay you or manage their account, your customers get sent to ${hosts[0]} — a different company's website. Some of them will not come back, and you cannot see what happens over there.`,
    metric: `Account or billing links point off your domain, to ${hosts.join(', ')}.`,
  }),
  seoWeak: (score: number) => ({
    headline: 'Search engines are struggling to read your site properly, so you rank below businesses that are easier to index.',
    metric: `Google SEO checks: ${score}/100.`,
  }),
  heavyPage: (bytes: number) => ({
    headline: `Your homepage downloads ${mb(bytes)}MB. On mobile data that is a real wait, and on a limited plan it is a real cost.`,
    metric: `Total page weight: ${mb(bytes)}MB.`,
  }),
  noFavicon: () => ({
    headline: 'Your site has no icon, so it shows as a blank page in a tab and as a grey square when someone bookmarks it.',
    metric: 'No favicon or apple-touch-icon link.',
  }),
  accessibilityWeak: (score: number) => ({
    headline:
      'Parts of your site are hard to use with a screen reader or at low vision — and the same problems make it awkward for everyone in bright sunlight.',
    metric: `Google accessibility checks: ${score}/100.`,
  }),
  mobileOk: () => ({
    headline: 'Your site renders correctly on a phone, which is where most of your visitors are.',
    metric: 'Viewport configured and content fits the mobile screen.',
  }),
  secureOk: () => ({
    headline: 'Your site loads securely and passes the browser trust checks visitors never consciously notice.',
    metric: 'Valid HTTPS, no mixed-content or best-practice failures flagged.',
  }),
} as const;
