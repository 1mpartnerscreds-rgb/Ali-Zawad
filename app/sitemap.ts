import type { MetadataRoute } from 'next';
import { SITE, TIER_ORDER } from '@/content/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ['/', '/book', ...TIER_ORDER.map((t) => `/services/${t}`)];
  return routes.map((path) => ({
    url: `${SITE.url}${path}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: path === '/' ? 1 : 0.7,
  }));
}
