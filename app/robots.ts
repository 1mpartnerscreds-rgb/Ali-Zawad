import type { MetadataRoute } from 'next';
import { SITE } from '@/content/site';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Audit results are public links so they can be pasted into an email or a
      // WhatsApp message, but they are somebody else's score. They stay out of
      // search results.
      { userAgent: '*', allow: '/', disallow: '/audit/' },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
