import { Contact } from '@/components/contact';
import { Gap } from '@/components/gap';
import { Opening } from '@/components/opening';
import { Partnership } from '@/components/partnership';
import { Rates } from '@/components/rates';
import { Reel } from '@/components/reel';

export default function Page() {
  return (
    <main>
      <Opening />
      <Gap />
      <Reel />
      <Partnership />
      <Rates />
      <Contact />
    </main>
  );
}
