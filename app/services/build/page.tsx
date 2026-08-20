import type { Metadata } from 'next';
import { ServicePage } from '@/components/ServicePage';
import { TIERS } from '@/content/site';

const tier = TIERS.build;

export const metadata: Metadata = {
  title: `${tier.name} — ${tier.price}`,
  description: tier.what,
  alternates: { canonical: '/services/build' },
  openGraph: {
    title: `${tier.name} — ${tier.price}`,
    description: tier.what,
    url: '/services/build',
  },
};

export default function Page() {
  return <ServicePage slug="build" />;
}
