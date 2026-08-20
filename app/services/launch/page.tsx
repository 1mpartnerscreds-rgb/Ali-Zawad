import type { Metadata } from 'next';
import { ServicePage } from '@/components/ServicePage';
import { TIERS } from '@/content/site';

const tier = TIERS.launch;

export const metadata: Metadata = {
  title: `${tier.name} — ${tier.price}`,
  description: tier.what,
  alternates: { canonical: '/services/launch' },
  openGraph: {
    title: `${tier.name} — ${tier.price}`,
    description: tier.what,
    url: '/services/launch',
  },
};

export default function Page() {
  return <ServicePage slug="launch" />;
}
