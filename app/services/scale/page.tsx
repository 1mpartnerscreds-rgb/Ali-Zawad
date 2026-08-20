import type { Metadata } from 'next';
import { ServicePage } from '@/components/ServicePage';
import { TIERS } from '@/content/site';

const tier = TIERS.scale;

export const metadata: Metadata = {
  title: `${tier.name} — ${tier.price}`,
  description: tier.what,
  alternates: { canonical: '/services/scale' },
  openGraph: {
    title: `${tier.name} — ${tier.price}`,
    description: tier.what,
    url: '/services/scale',
  },
};

export default function Page() {
  return <ServicePage slug="scale" />;
}
