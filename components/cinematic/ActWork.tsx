import { Words } from '@/components/cinematic/Words';
import { ACTS, PROJECTS } from '@/content/site';

/**
 * The work, shown at scale.
 *
 * Each project holds a full frame and the screenshot drifts against its caption
 * as the frame passes, so the images have depth rather than sitting flat in a
 * grid. Alternating sides stops it becoming a rhythm you can predict.
 *
 * Real screenshots of real sites, as the brief demanded from the start. The
 * motion is the only thing added — nothing here is a mockup in a device frame.
 */
export function ActWork() {
  const { work } = ACTS;

  return (
    <section aria-labelledby="work-heading" className="mx-auto max-w-wide px-6 pt-32">
      <p className="r-fade text-small font-medium tracking-[0.14em] text-muted uppercase">{work.eyebrow}</p>
      <h2 id="work-heading" className="display-lg mt-6 max-w-[18ch] font-regular">
        <Words text={work.headline} />
      </h2>
      <p className="r-up mt-8 max-w-[52ch] text-body text-muted">{work.body}</p>

      <ul className="scene-near mt-24 space-y-32">
        {PROJECTS.map((project, index) => (
          <li key={project.name} className={index % 2 === 1 ? 'd-plate-alt' : 'd-plate'}>
            <a
              href={project.href}
              rel="noreferrer"
              className="t group grid items-center gap-8 no-underline lg:grid-cols-12"
            >
              <div
                className={`overflow-hidden border border-line lg:col-span-8 ${
                  index % 2 === 1 ? 'lg:order-2 lg:col-start-5' : ''
                }`}
              >
                <img
                  src={project.image}
                  srcSet={`${project.imageSmall} 400w, ${project.imageMedium} 600w, ${project.image} 800w`}
                  sizes="(min-width: 1024px) 66vw, 100vw"
                  alt={`The ${project.name} website homepage`}
                  width={800}
                  height={600}
                  loading="lazy"
                  decoding="async"
                  className="r-slow t w-full scale-110 bg-surface group-hover:opacity-90"
                />
              </div>

              <div className={`lg:col-span-4 ${index % 2 === 1 ? 'lg:order-1' : ''}`}>
                <p className="r-up text-body font-medium">{project.name}</p>
                <p className="r-up mt-3 text-small text-muted">{project.caption}</p>
                <p className="r-fade mt-4 text-small text-[color:var(--color-accent-ink)]">
                  {new URL(project.href).host.replace(/^www\./, '')}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
