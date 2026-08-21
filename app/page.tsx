import Link from 'next/link';
import { AuditForm } from '@/components/AuditForm';
import { Typewriter } from '@/components/Typewriter';
import { HOME, PROJECTS } from '@/content/site';

/**
 * Three things above the fold: the headline, the input, one escape hatch.
 *
 * There is deliberately no services menu, no tier grid and no pricing table on
 * this page. Showing a visitor three options and asking them to self-diagnose is
 * the exact failure this site exists to fix. They get diagnosed, then they get
 * told which one.
 */
export default function HomePage() {
  return (
    <>
      <section className="mx-auto max-w-text px-6 pt-24 pb-28 sm:pt-32">
        <Typewriter text={HOME.headline} className="text-display font-regular text-balance" />

        <AuditForm />

        <p className="mt-5 text-small text-muted">{HOME.reassurance}</p>

        <p className="mt-6">
          <Link href="/services/launch" className="t text-small text-muted underline underline-offset-4 hover:text-ink">
            {HOME.noSiteLink}
          </Link>
        </p>
      </section>

      <section className="border-t border-line" aria-labelledby="proof-heading">
        <div className="mx-auto max-w-wide px-6 py-16">
          <h2 id="proof-heading" className="text-small font-medium text-muted">
            {HOME.proof.caption}
          </h2>

          <ul className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {PROJECTS.map((project) => (
              <li key={project.name}>
                <a href={project.href} rel="noreferrer" className="t group block no-underline">
                  <img
                    src={project.image}
                    srcSet={`${project.imageSmall} 400w, ${project.imageMedium} 600w, ${project.image} 800w`}
                    sizes="(min-width: 1024px) 248px, (min-width: 640px) 50vw, 100vw"
                    alt={`The ${project.name} website homepage`}
                    width={800}
                    height={600}
                    loading="lazy"
                    decoding="async"
                    className="t w-full rounded-sm border border-line bg-surface group-hover:opacity-85"
                  />
                  <p className="mt-3 text-small text-muted">{project.caption}</p>
                </a>
              </li>
            ))}
          </ul>

          <p className="mt-12 max-w-text text-small text-muted">{HOME.proof.credibility}</p>
        </div>
      </section>
    </>
  );
}
