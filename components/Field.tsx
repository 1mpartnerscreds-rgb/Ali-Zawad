import type { ComponentProps } from 'react';

const control =
  't w-full rounded-md border border-line bg-surface px-4 py-3.5 text-body text-ink placeholder:text-dim hover:border-muted focus:outline-none focus-visible:border-ember focus-visible:outline-none';

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
      <label htmlFor={id} className="eyebrow block">
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
