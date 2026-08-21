import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

/**
 * The one button on the site.
 *
 * `primary` is the accent fill and it means exactly one thing everywhere it
 * appears: book a call. Same label, same colour, same shape, every page.
 * `quiet` is for the rare secondary escape hatch and never competes.
 */

const base =
  'az-web t inline-flex items-center justify-center gap-2 rounded-sm px-6 py-3.5 text-body font-medium no-underline';

const variants = {
  primary: 'bg-accent text-white hover:bg-accent-ink active:translate-y-px',
  quiet: 'border border-line text-ink hover:border-ink active:translate-y-px',
} as const;

type Variant = keyof typeof variants;

export function ButtonLink({
  href,
  variant = 'primary',
  children,
  className = '',
  ...rest
}: { href: string; variant?: Variant; children: ReactNode; className?: string } & Omit<
  ComponentProps<typeof Link>,
  'href' | 'className' | 'children'
>) {
  const isExternal = href.startsWith('http');
  if (isExternal) {
    return (
      <a href={href} className={`${base} ${variants[variant]} ${className}`} rel="noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link href={href} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
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
