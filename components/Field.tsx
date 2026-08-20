import type { ComponentProps } from 'react';

const control =
  't w-full rounded-sm border border-line bg-white px-4 py-3 text-body text-ink placeholder:text-muted hover:border-muted focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2';

export function Field({
  id,
  label,
  error,
  hint,
  textarea,
  ...rest
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  textarea?: boolean;
} & ComponentProps<'input'> &
  ComponentProps<'textarea'>) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(' ');

  return (
    <div>
      <label htmlFor={id} className="block text-small text-muted">
        {label}
      </label>
      {textarea ? (
        <textarea
          id={id}
          rows={4}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={`${control} mt-2 resize-y`}
          {...(rest as ComponentProps<'textarea'>)}
        />
      ) : (
        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy || undefined}
          className={`${control} mt-2`}
          {...(rest as ComponentProps<'input'>)}
        />
      )}
      {hint ? (
        <p id={`${id}-hint`} className="mt-2 text-small text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-small text-band-poor">
          {error}
        </p>
      ) : null}
    </div>
  );
}
