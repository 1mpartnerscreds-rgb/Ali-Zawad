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
    <section aria-labelledby="work-heading" className="day scene-near px-6 pt-32 pb-32 lg:px-10">
      <div className="mx-auto max-w-full">
      <p className="eyebrow r-fade">{work.eyebrow}</p>
      <h2 id="work-heading" className="font-display mt-6 max-w-[16ch] text-display font-light">
        <Words text={work.headline} />
      </h2>
      <p className="r-up mt-8 max-w-[54ch] text-lead text-muted">{work.body}</p>

      <ul className="mt-24 space-y-28">
        {PROJECTS.map((project, index) => (
          <li key={project.name} className={index % 2 === 1 ? 'd-plate-alt' : 'd-plate'}>
            <a
              href={project.href}
              rel="noreferrer"
              className="t group grid items-center gap-8 no-underline lg:grid-cols-12"
            >
              <div
                className={`overflow-hidden rounded-lg border border-line lg:col-span-8 ${
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
                <p className="r-up font-display text-title text-ink">{project.name}</p>
                <p className="r-up mt-3 text-body text-muted">{project.caption}</p>
                <p className="r-fade mt-5 font-data text-small text-ember">
                  {new URL(project.href).host.replace(/^www\./, '')}
                </p>
              </div>
            </a>
          </li>
        ))}
      </ul>
      </div>
    </section>
  );
}
