import { Contact } from '@/components/contact';
import { Gap } from '@/components/gap';
import { Opening } from '@/components/opening';
import { Prices } from '@/components/prices';
import { Reel } from '@/components/reel';
import { Trust } from '@/components/trust';
import { Works } from '@/components/works';

export default function Page() {
  return (
    <main>
      <Opening />
      <Gap />
      <Reel />
      <Works />
      <Prices />
      <Trust />
      <Contact />
    </main>
  );
}
