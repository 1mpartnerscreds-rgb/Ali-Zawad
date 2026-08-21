import { AuditForm } from '@/components/AuditForm';
import { Words } from '@/components/cinematic/Words';
import { ACTS } from '@/content/site';

/**
 * The last frame gives the screen back to the input.
 *
 * A visitor who has scrolled this far has been persuaded of the argument and is
 * now furthest from the one thing the page wants them to do. Making them scroll
 * back up to act on it would be the whole sequence undoing its own work.
 */
export function ActClose() {
  const { close } = ACTS;

  return (
    <section className="grain scene relative isolate overflow-hidden" aria-labelledby="close-heading">
      <div className="relative mx-auto flex min-h-[88vh] max-w-full flex-col justify-center px-6 py-32 lg:px-10">
        <h2 id="close-heading" className="font-display max-w-[12ch] text-hero font-light">
          <Words text={close.headline} />
        </h2>
        <p className="r-up mt-8 max-w-[48ch] text-lead text-muted">{close.body}</p>
        <div className="r-up max-w-form">
          <AuditForm variant="night" />
        </div>
      </div>
    </section>
  );
}
