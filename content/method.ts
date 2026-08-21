/**
 * The "how this works" page.
 *
 * This exists because the audit asks a stranger to accept a number about their
 * own business from someone they have never met. The fastest way to be believed
 * is to be checkable: say what we measure, where each number comes from, and
 * what we do when we cannot measure something.
 *
 * The pillar weights on this page are read from the scoring config itself, so
 * the published explanation cannot drift away from what the code does.
 */

export const METHOD = {
  title: 'How the audit works',
  intro:
    'Nobody should take a score about their own business on trust. So here is exactly what we measure, where each number comes from, and what we do when we cannot measure something.',

  sections: {
    sources: {
      title: 'Where the numbers come from',
      body: [
        'Two places, and we always tell you which one you are looking at.',
        'The first is Google. If enough people have visited your site recently, Google has recorded what they actually experienced — how long they waited, whether the page moved under their thumb, how quickly it answered a tap. That is real data about real customers, and when it exists it is what we score you on.',
        'The second is a simulation. If your site does not yet get enough traffic for Google to report on, we run a test on a simulated mid-range phone over a slow connection. It is deliberately harsh. It is useful, but it is a stress test, not a typical visit — so any finding built on it says so in the finding itself.',
        'We never present one as the other. A number measured on a throttled test phone is not what your visitors experience, and describing it that way would be the easiest lie on this page to tell.',
      ],
    },
    ourChecks: {
      title: 'What we check ourselves',
      body: [
        'Google grades a page the way an engineer reads it. Some of what costs you customers never appears in that report, so we fetch your homepage directly and read it.',
        'Whether a customer can reach you at all — a phone link, an email, WhatsApp, or a contact form. Whether the page is set up for a phone screen, or pinned to a fixed desktop width so it gets cut off at the edge. Whether pinch-to-zoom has been switched off. What your page title and description actually say, since those are your advert in Google. Whether anything is there at all when the page loads.',
        'We also look at whether your site can take a booking, a payment or a login — and whether it sends customers to another company to do those things.',
      ],
    },
    score: {
      title: 'How the score is built',
      body: [
        'Your score is not Google’s performance number. Google measures a page. We are trying to measure a business, so the weighting is different: it leans towards whether customers can reach you, whether it works on the phone in their hand, whether it loads before they give up, and whether Google can find you at all.',
      ],
      note: 'Each pillar is scored from 0 to 100 percent of its weight, then added up. The thresholds we use for fast, slow, stable and unstable are Google’s own published boundaries, so every number we quote can be checked against PageSpeed Insights directly.',
    },
    honesty: {
      title: 'What we do when a check fails',
      body: [
        'We do not fill the gap.',
        'If Google cannot give us load measurements, you get no score at all — just the checks we could run, and a note saying why the number is missing. A score assembled from half the inputs looks exactly like a real one, and it is not.',
        'If your site is unreachable, or its certificate has expired, or it blocked us, we say that plainly instead of scoring you badly for it. And in the full checklist, anything we could not test is marked as unchecked rather than passed. A report that quietly counts its own blind spots as passes is worth nothing.',
      ],
    },
    recommendation: {
      title: 'How one tier gets recommended',
      body: [
        'The findings decide it, not the price list.',
        'If the foundations are broken — it is slow, it is cut off on a phone, or a customer cannot find a way to contact you — nothing else matters yet, and that is Launch.',
        'If the site works but cannot do anything, and your own pages are already asking people to book, buy, apply or pay, then the gap is that the site cannot take the action it is asking for. That is Build.',
        'If your site is already an application — a real login, a cart, a payment system — or if nothing is broken and nothing obvious is missing, then there is no repair job to sell you. That is Scale, and it is a conversation rather than a quote.',
        'A site that is already running an application never gets recommended Launch, however badly it scores. Rebuilding a working storefront as five pages would be a worse business, and quoting for it would be dishonest.',
      ],
    },
    limits: {
      title: 'What this audit cannot tell you',
      body: [
        'It reads your homepage, not your whole site. It cannot judge whether your copy persuades anyone, whether your prices are right, or whether your photographs are any good. It cannot see anything behind a login.',
        'It is a technical read of the first thing a customer sees. That is genuinely useful, and it is not everything.',
      ],
    },
  },

  cta: 'Run the audit on your site',
} as const;
