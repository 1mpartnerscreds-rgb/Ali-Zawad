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
    <section className="night grain relative isolate mt-32" aria-labelledby="close-heading">
      <div className="mx-auto flex min-h-[86vh] max-w-text flex-col justify-center px-6 py-32">
        <h2 id="close-heading" className="display-lg max-w-[14ch] font-regular">
          <Words text={close.headline} />
        </h2>
        <p className="r-up mt-8 text-body text-muted">{close.body}</p>
        <div className="r-up">
          <AuditForm variant="night" />
        </div>
      </div>
    </section>
  );
}
