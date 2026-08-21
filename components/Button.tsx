import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

/**
 * One button, three surfaces.
 *
 * `primary` is the ember fill and means exactly one thing wherever it appears:
 * this is the action. `quiet` is a hairline outline for the secondary way out.
 * `ghost` is a text button for tertiary moves that should not compete at all.
 *
 * The web strands still draw across on hover — they inherit currentColor, so
 * the gesture survives the palette change without being restyled per surface.
 */

const base =
  'az-web t group relative inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5 text-small font-medium tracking-[0.01em] no-underline';

const variants = {
  primary:
    'bg-ember text-canvas hover:bg-ember-soft active:translate-y-px shadow-[0_0_40px_-12px_var(--color-ember)] hover:shadow-[0_0_60px_-10px_var(--color-ember)]',
  quiet: 'border border-line text-ink hover:border-muted hover:bg-surface active:translate-y-px',
  ghost: 'px-0 text-muted hover:text-ink',
} as const;

type Variant = keyof typeof variants;

/** A hairline arrow that steps forward on hover. Cheaper than an icon font. */
function Arrow() {
  return (
    <span aria-hidden="true" className="t inline-block translate-x-0 group-hover:translate-x-1">
      →
    </span>
  );
}

export function ButtonLink({
  href,
  variant = 'primary',
  arrow = true,
  children,
  className = '',
  ...rest
}: {
  href: string;
  variant?: Variant;
  arrow?: boolean;
  children: ReactNode;
  className?: string;
} & Omit<ComponentProps<typeof Link>, 'href' | 'className' | 'children'>) {
  const content = (
    <>
      {children}
      {arrow ? <Arrow /> : null}
    </>
  );

  if (href.startsWith('http')) {
    return (
      <a href={href} rel="noreferrer" className={`${base} ${variants[variant]} ${className}`}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {content}
    </Link>
  );
}

export function Button({
  variant = 'primary',
  className = '',
  children,
  ...rest
}: { variant?: Variant } & ComponentProps<'button'>) {
  return (
    <button className={`${base} ${variants[variant]} disabled:opacity-60 ${className}`} {...rest}>
      {children}
    </button>
  );
}
