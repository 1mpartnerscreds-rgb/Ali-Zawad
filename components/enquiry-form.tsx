'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE } from '@/content/site';

type State = 'idle' | 'sending' | 'sent' | 'error';

/**
 * The enquiry form.
 *
 * Phone is the field that matters — this buyer rings people — so either a
 * phone number or an email is enough to submit. Demanding both loses
 * enquiries from someone standing in a customer's kitchen.
 *
 * On success the form is replaced by a single line of confirmation rather
 * than a modal that has to be dismissed: the person is finished, and putting
 * a close button in front of them is one more thing to do for no reason. The
 * line is announced to screen readers and takes focus, so it is not a change
 * only sighted users notice.
 */
export function EnquiryForm() {
  const [state, setState] = useState<State>('idle');
  const [error, setError] = useState('');
  const done = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (state === 'sent') done.current?.focus();
  }, [state]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;

    const data = Object.fromEntries(new FormData(event.currentTarget));
    setState('sending');
    setError('');

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setError(json.error ?? 'Something went wrong. Please email us directly.');
        setState('error');
        return;
      }
      setState('sent');
    } catch {
      setError('No connection. Please email us directly.');
      setState('error');
    }
  }

  if (state === 'sent') {
    return (
      <p
        ref={done}
        tabIndex={-1}
        role="status"
        className="display display-wide max-w-[30ch] text-say text-bone outline-none"
      >
        Thank you — we have got that, and we will come back to you within one working day.
      </p>
    );
  }

  const field =
    'w-full border border-rule bg-transparent px-4 py-3.5 text-[0.98rem] text-bone ' +
    'placeholder:text-grey focus:border-bone focus:outline-none transition-colors duration-300';

  return (
    <form onSubmit={onSubmit} noValidate className="max-w-measure">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mark mb-2 block">Your name</span>
          <input name="name" required autoComplete="name" className={field} placeholder="Dave Wilson" />
        </label>
        <label className="block">
          <span className="mark mb-2 block">Business</span>
          <input name="business" autoComplete="organization" className={field} placeholder="Wilson Plumbing" />
        </label>
        <label className="block">
          <span className="mark mb-2 block">Phone</span>
          <input name="phone" type="tel" autoComplete="tel" className={field} placeholder="07700 900000" />
        </label>
        <label className="block">
          <span className="mark mb-2 block">Email</span>
          <input name="email" type="email" autoComplete="email" className={field} placeholder="you@business.co.uk" />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mark mb-2 block">What do you need?</span>
        <textarea name="message" rows={4} className={`${field} resize-y`} placeholder="A few lines is plenty." />
      </label>

      {/* Not shown to anyone. Bots fill it; people never see it. */}
      <div aria-hidden="true" className="sr-only">
        <label>
          Company
          <input name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <p className="mark mt-4">Give us a phone number or an email — either is enough.</p>

      <div className="mt-6 flex flex-wrap items-center gap-5">
        <button type="submit" disabled={state === 'sending'} className="btn btn--solid disabled:opacity-60">
          <span className="btn-lab">
            <i>{state === 'sending' ? 'Sending…' : 'Send enquiry'}</i>
            <i aria-hidden="true">{state === 'sending' ? 'Sending…' : 'Send enquiry'}</i>
          </span>
        </button>

        {state === 'error' ? (
          <p role="alert" className="text-[0.92rem] text-bone">
            {error}{' '}
            <a href={`mailto:${SITE.email}`} className="underline">
              {SITE.email}
            </a>
          </p>
        ) : null}
      </div>
    </form>
  );
}
