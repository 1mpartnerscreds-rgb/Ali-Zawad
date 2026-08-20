'use client';

import { useState } from 'react';
import { Button, ButtonLink } from '@/components/Button';
import { Field } from '@/components/Field';
import { BOOK } from '@/content/site';
import { validate, type BookingErrors } from '@/lib/booking';

type State =
  | { kind: 'editing'; errors: BookingErrors; failed?: boolean }
  | { kind: 'sending' }
  | { kind: 'sent' }
  | { kind: 'handoff'; href: string };

export function BookForm({ domain, score, tier }: { domain?: string; score?: string; tier?: string }) {
  const [state, setState] = useState<State>({ kind: 'editing', errors: {} });

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    const data = new FormData(form);

    const errors = validate({
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      message: String(data.get('message') ?? ''),
    });

    if (Object.keys(errors).length > 0) {
      event.preventDefault();
      setState({ kind: 'editing', errors });
      return;
    }

    if (typeof window === 'undefined' || !window.fetch) return;
    event.preventDefault();
    setState({ kind: 'sending' });

    try {
      const response = await fetch('/api/book', {
        method: 'POST',
        headers: { accept: 'application/json' },
        body: data,
      });
      if (!response.ok) {
        setState({ kind: 'editing', errors: {}, failed: true });
        return;
      }
      const result = (await response.json()) as { via: string; href?: string };
      if (result.via === 'whatsapp' && result.href) {
        setState({ kind: 'handoff', href: result.href });
      } else {
        setState({ kind: 'sent' });
      }
    } catch {
      setState({ kind: 'editing', errors: {}, failed: true });
    }
  }

  if (state.kind === 'sent') {
    return (
      <div role="status" className="mt-12">
        <p className="text-display font-regular">{BOOK.success.title}</p>
        <p className="mt-6 text-body text-muted">{BOOK.success.body}</p>
      </div>
    );
  }

  if (state.kind === 'handoff') {
    return (
      <div role="status" className="mt-12">
        <p className="text-display font-regular">{BOOK.handoff.title}</p>
        <p className="mt-6 text-body text-muted">{BOOK.handoff.body}</p>
        <div className="mt-10">
          <ButtonLink href={state.href}>{BOOK.handoff.cta}</ButtonLink>
        </div>
      </div>
    );
  }

  const errors = state.kind === 'editing' ? state.errors : {};

  return (
    <form method="POST" action="/api/book" onSubmit={onSubmit} noValidate className="mt-12 space-y-8">
      {domain ? <input type="hidden" name="domain" value={domain} /> : null}
      {score ? <input type="hidden" name="score" value={score} /> : null}
      {tier ? <input type="hidden" name="tier" value={tier} /> : null}

      <Field id="name" label={BOOK.fields.name} name="name" autoComplete="name" error={errors.name && BOOK.errors.name} />
      <Field
        id="email"
        label={BOOK.fields.email}
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        error={errors.email && BOOK.errors.email}
      />
      <Field
        id="whatsapp"
        label={BOOK.fields.whatsapp}
        name="whatsapp"
        type="tel"
        inputMode="tel"
        autoComplete="tel"
      />
      <Field
        id="message"
        label={BOOK.fields.message}
        name="message"
        textarea
        placeholder={BOOK.fields.messagePlaceholder}
        error={errors.message && BOOK.errors.message}
      />

      {state.kind === 'editing' && state.failed ? (
        <p role="alert" className="text-small text-band-poor">
          {BOOK.errors.server}
        </p>
      ) : null}

      <Button type="submit" disabled={state.kind === 'sending'}>
        {state.kind === 'sending' ? BOOK.submitting : BOOK.submit}
      </Button>
    </form>
  );
}
