/**
 * Finding copy.
 *
 * Rule, without exception: the consequence leads, the metric follows in small
 * secondary text. A business owner does not know what LCP is and should not
 * have to. They know what "people leave before it loads" means.
 */

const seconds = (ms: number) => (ms / 1000).toFixed(1);
const mb = (bytes: number) => (bytes / 1_000_000).toFixed(1);

export const FINDING_COPY = {
  lcpSlow: (ms: number) => ({
    headline: `Your homepage takes ${seconds(ms)} seconds to appear on a phone. Most visitors leave before it finishes.`,
    metric: `Largest Contentful Paint: ${seconds(ms)}s on mobile. Google treats anything over 2.5s as slow.`,
  }),
  lcpFast: (ms: number) => ({
    headline: `Your homepage appears in ${seconds(ms)} seconds on a phone. That is faster than most sites we test.`,
    metric: `Largest Contentful Paint: ${seconds(ms)}s on mobile.`,
  }),
  tbtHigh: (ms: number) => ({
    headline: 'Your page looks ready before it is. Someone tapping your menu in the first seconds gets nothing back.',
    metric: `Total Blocking Time: ${Math.round(ms)}ms of frozen main thread. Google treats anything over 200ms as a problem.`,
  }),
  clsHigh: (value: number) => ({
    headline: 'Content jumps around while your page loads. People tap the wrong thing, then stop trusting the page.',
    metric: `Cumulative Layout Shift: ${value.toFixed(2)}. Google treats anything over 0.1 as unstable.`,
  }),
  noViewport: () => ({
    headline:
      'Your site is not set up for phones. It loads at desktop width, so a customer has to pinch and zoom to read anything.',
    metric: 'No viewport meta tag in the page head.',
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
