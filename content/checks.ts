/**
 * The full checklist shown under the headline findings.
 *
 * The findings list stays short on purpose — three to five things worth acting
 * on. But "what else did you look at?" is a fair question, and a report that
 * cannot answer it looks like it was guessing. So everything we tested is listed
 * here, passed or failed, in words that say what the check is *for*.
 *
 * `label` is the thing being checked, phrased as a good outcome.
 * `failed` is what it costs when it isn't true. Consequence, never jargon.
 */

export type CheckGroup = 'phone' | 'speed' | 'reach' | 'search' | 'trust' | 'readable';

export const GROUP_LABELS: Record<CheckGroup, string> = {
  phone: 'On a phone',
  speed: 'Speed',
  reach: 'Getting in touch',
  search: 'Being found',
  trust: 'Trust and security',
  readable: 'Readable by everyone',
};

export const GROUP_ORDER: CheckGroup[] = ['phone', 'speed', 'reach', 'search', 'trust', 'readable'];

export interface CheckCopy {
  group: CheckGroup;
  label: string;
  failed: string;
}

/** Keys are either a Lighthouse audit id or one of our own check names. */
export const CHECK_COPY: Record<string, CheckCopy> = {
  // --- On a phone --------------------------------------------------------
  viewport: {
    group: 'phone',
    label: 'Set up for phone screens',
    failed: 'Your site loads at desktop width on a phone, so everything is tiny until the visitor pinches to zoom.',
  },
  'viewport-width': {
    group: 'phone',
    label: 'Lays out at the width of the screen',
    failed:
      'Your page is pinned to a fixed desktop width, so on a phone it is cut off at the edge and visitors have to drag sideways to read a sentence.',
  },
  zoom: {
    group: 'phone',
    label: 'Visitors can pinch to zoom',
    failed:
      'Zooming is switched off on your site. Anyone who cannot read the text at its default size — which is a lot of people over forty — has no way to make it bigger.',
  },
  'viewport-insight': {
    group: 'phone',
    label: 'Viewport tuned for touch',
    failed: 'Taps on your site can be delayed by up to 300ms because of how the page is configured for mobile.',
  },
  'content-width': {
    group: 'phone',
    label: 'Fits the screen without scrolling sideways',
    failed: 'Your page is wider than a phone screen, so part of it is cut off and visitors have to drag sideways to read.',
  },
  'font-size': {
    group: 'phone',
    label: 'Text big enough to read without zooming',
    failed: 'Some text is too small to read on a phone. People zoom in, lose their place, and give up.',
  },
  'tap-targets': {
    group: 'phone',
    label: 'Buttons far enough apart to tap',
    failed: 'Some buttons and links are too small or too close together to tap accurately. People hit the wrong one.',
  },
  'meta-viewport': {
    group: 'phone',
    label: 'Zoom not blocked in the page settings',
    failed: 'The page settings stop visitors magnifying the screen, which locks out anyone who needs larger text.',
  },

  // --- Speed -------------------------------------------------------------
  lcp: {
    group: 'speed',
    label: 'Main content appears quickly',
    failed: 'The main thing on your page takes too long to show up, and most visitors leave before it does.',
  },
  response: {
    group: 'speed',
    label: 'Responds straight away when tapped',
    failed: 'There is a noticeable delay between tapping something and anything happening.',
  },
  cls: {
    group: 'speed',
    label: 'Layout stays still while loading',
    failed: 'Content shifts around as the page loads, so people tap the wrong thing.',
  },
  weight: {
    group: 'speed',
    label: 'Light enough for mobile data',
    failed: 'Your page is heavy enough that it costs your visitors real time and real money on a mobile plan.',
  },
  'server-response-time': {
    group: 'speed',
    label: 'Your server answers quickly',
    failed: 'Your hosting is slow to respond, which delays everything else before it can even start.',
  },
  'uses-text-compression': {
    group: 'speed',
    label: 'Files sent compressed',
    failed: 'Your files are being sent uncompressed, making the page slower to download than it needs to be.',
  },
  'uses-responsive-images': {
    group: 'speed',
    label: 'Images sized for the screen',
    failed: 'Phones are downloading full desktop-sized images and shrinking them, wasting your visitors’ data.',
  },
  'font-display': {
    group: 'speed',
    label: 'Text visible while fonts load',
    failed: 'Your text is invisible for a moment while the fonts download, so the page looks blank longer than it is.',
  },
  'dom-size': {
    group: 'speed',
    label: 'Page structure a sensible size',
    failed: 'The page has so many elements that phones struggle to lay it out, which makes scrolling and tapping feel sluggish.',
  },
  'render-blocking-resources': {
    group: 'speed',
    label: 'Nothing blocking the first paint',
    failed: 'Files are loading before anything can appear on screen, so visitors stare at a blank page for longer.',
  },

  // --- Getting in touch --------------------------------------------------
  contact: {
    group: 'reach',
    label: 'A way to contact you on the page',
    failed: 'There is no phone number, email, WhatsApp link or contact form. Someone ready to buy has nowhere to go.',
  },
  outsourced: {
    group: 'reach',
    label: 'Customers stay on your site',
    failed: 'Account or payment links send your customers to another company’s website, where you cannot see what happens.',
  },

  // --- Being found -------------------------------------------------------
  title: {
    group: 'search',
    label: 'A real page title',
    failed: 'Your title is missing or generic. It is the headline Google shows in search results.',
  },
  description: {
    group: 'search',
    label: 'A description you wrote',
    failed: 'With no description, Google scrapes whatever text it finds first to put under your search result.',
  },
  'is-crawlable': {
    group: 'search',
    label: 'Search engines allowed to index it',
    failed: 'Your page is telling search engines not to list it. This alone can keep you out of Google entirely.',
  },
  'crawlable-anchors': {
    group: 'search',
    label: 'Links Google can follow',
    failed: 'Some links are built in a way search engines cannot follow, so those pages may never be found.',
  },
  'robots-txt': {
    group: 'search',
    label: 'robots.txt is valid',
    failed: 'The file that tells search engines what they may read has errors in it.',
  },
  'http-status-code': {
    group: 'search',
    label: 'Page loads without an error code',
    failed: 'Your page returns an error code to search engines even though it looks fine in a browser.',
  },
  'link-text': {
    group: 'search',
    label: 'Link text says where it goes',
    failed: 'Links labelled "click here" or "read more" tell neither Google nor a screen reader what is on the other side.',
  },

  // --- Trust and security ------------------------------------------------
  https: {
    group: 'trust',
    label: 'Loads securely over HTTPS',
    failed: 'Your site is not secure, so Chrome shows a "Not secure" warning next to your address.',
  },
  'is-on-https': {
    group: 'trust',
    label: 'Everything on the page is secure',
    failed: 'Parts of your page load insecurely, which can trigger browser warnings even though the site has a certificate.',
  },
  favicon: {
    group: 'trust',
    label: 'Has a site icon',
    failed: 'Your site shows as a blank page in browser tabs and a grey square in bookmarks.',
  },
  'errors-in-console': {
    group: 'trust',
    label: 'No errors in the browser',
    failed: 'Your site is throwing errors while it runs. Something on the page is broken, even if it is not visible yet.',
  },

  // --- Readable by everyone ---------------------------------------------
  'color-contrast': {
    group: 'readable',
    label: 'Text readable against its background',
    failed: 'Some text is too faint against its background to read comfortably, and nearly impossible in sunlight.',
  },
  'image-alt': {
    group: 'readable',
    label: 'Images have descriptions',
    failed: 'Images have no text description, so screen readers skip them and Google cannot tell what they show.',
  },
  'html-has-lang': {
    group: 'readable',
    label: 'Page declares its language',
    failed: 'Your page does not say what language it is in, so screen readers may read it with the wrong pronunciation.',
  },
  'unsized-images': {
    group: 'readable',
    label: 'Images reserve their space',
    failed: 'Images do not reserve space before they load, which is what makes the page jump around.',
  },
};

export const CHECKLIST = {
  title: 'Everything we checked',
  intro: 'Every test we ran on your homepage, passed or failed.',
  passLabel: 'Passed',
  failLabel: 'Needs work',
  unknownLabel: "Couldn't check",
  unknownNote:
    'A few checks need the load measurements we could not get, so they are listed as unchecked rather than passed.',
} as const;
