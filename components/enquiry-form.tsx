'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE } from '@/content/site';

type State = 'idle' | 'sending' | 'sent' | 'error';
type Errors = Partial<Record<'name' | 'contact' | 'email', string>>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * The enquiry form.
 *
 * Phone is the field that matters — this buyer rings people — so either a
 * phone number or an email is enough to submit. Demanding both loses
 * enquiries from someone standing in a customer's kitchen.
 *
 * Validation runs on blur, not only on submit: a man filling this in
 * one-handed between jobs should find out the email is wrong while he is
 * still looking at that field, not after he has pressed send and scrolled
 * away. A failed submit also renders a focusable summary at the top of the
 * form, linked to each bad field — inline errors alone are easy to miss on
 * a small screen, and a summary alone strands a screen-reader user.
 *
 * On success the form is replaced by a single line of confirmation rather
 * than a modal: the person is finished, and putting a close button in front
 * of them is one more thing to do for no reason.
 */
export function EnquiryForm() {
  const [state, setState] = useState<State>('idle');
  const [sendError, setSendError] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const done = useRef<HTMLParagraphElement>(null);
  const summary = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state === 'sent') done.current?.focus();
  }, [state]);

  function validate(data: Record<string, string>): Errors {
    const next: Errors = {};
    if (!data.name?.trim()) next.name = 'Enter your name.';
    if (!data.phone?.trim() && !data.email?.trim()) {
      next.contact = 'Enter a phone number or an email address.';
    }
    if (data.email?.trim() && !EMAIL.test(data.email.trim())) {
      next.email = 'That email address does not look right.';
    }
    return next;
  }

  function currentData() {
    const f = formRef.current;
    if (!f) return {};
    return Object.fromEntries(
      Array.from(new FormData(f).entries()).map(([k, v]) => [k, String(v)]),
    );
  }

  /** Re-check on blur, but only surface errors for fields already touched. */
  function onBlur(field: string) {
    setTouched((t) => ({ ...t, [field]: true }));
    const found = validate(currentData());
    setErrors((prev) => {
      const next: Errors = { ...prev };
      // Contact is a pair — clear or set it whenever either half blurs.
      if (field === 'phone' || field === 'email') {
        if (found.contact) next.contact = found.contact;
        else delete next.contact;
      }
      const key = field as keyof Errors;
      if (found[key]) next[key] = found[key];
      else delete next[key];
      return next;
    });
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'sending') return;

    const data = currentData();
    const found = validate(data);
    setErrors(found);
    setTouched({ name: true, phone: true, email: true });

    if (Object.keys(found).length > 0) {
      // Move focus to the summary so a keyboard or screen-reader user is
      // taken to the problem rather than left where they pressed send.
      requestAnimationFrame(() => summary.current?.focus());
      return;
    }

    setState('sending');
    setSendError('');

    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const json = (await res.json().catch(() => ({}))) as { error?: string };

      if (!res.ok) {
        setSendError(json.error ?? 'Something went wrong. Please email us directly.');
        setState('error');
        return;
      }
      setState('sent');
    } catch {
      setSendError('No connection. Please email us directly.');
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
    'w-full border bg-transparent px-4 py-3.5 text-[16px] md:text-[0.98rem] text-bone ' +
    'placeholder:text-grey focus:border-bone focus:outline-none transition-colors duration-300';
  const ok = 'border-rule';
  const bad = 'border-bone';

  const show = (k: keyof Errors) => (touched[k] || state === 'error' ? errors[k] : undefined);
  const list = Object.entries(errors) as Array<[keyof Errors, string]>;

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="max-w-measure">
      {list.length > 0 ? (
        <div
          ref={summary}
          tabIndex={-1}
          role="alert"
          aria-labelledby="enquiry-problem"
          className="mb-8 border-l-2 border-bone pl-5 outline-none"
        >
          <h3 id="enquiry-problem" className="display display-wide text-[1.05rem] text-bone">
            There is a problem
          </h3>
          <ul className="mt-3">
            {list.map(([key, message]) => (
              <li key={key} className="text-[0.95rem]">
                <a
                  href={`#enq-${key === 'contact' ? 'phone' : key}`}
                  className="text-bone underline underline-offset-4"
                >
                  {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mark mb-2 block">Your name</span>
          <input
            id="enq-name"
            name="name"
            autoComplete="name"
            placeholder="Dave Wilson"
            onBlur={() => onBlur('name')}
            aria-invalid={show('name') ? true : undefined}
            aria-describedby={show('name') ? 'err-name' : undefined}
            className={`${field} ${show('name') ? bad : ok}`}
          />
          {show('name') ? (
            <span id="err-name" className="mt-2 block text-[0.9rem] text-bone">
              {errors.name}
            </span>
          ) : null}
        </label>

        <label className="block">
          <span className="mark mb-2 block">Business</span>
          <input name="business" autoComplete="organization" placeholder="Wilson Plumbing"
                 className={`${field} ${ok}`} />
        </label>

        <label className="block">
          <span className="mark mb-2 block">Phone</span>
          <input
            id="enq-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder="07700 900000"
            onBlur={() => onBlur('phone')}
            aria-invalid={show('contact') ? true : undefined}
            aria-describedby={show('contact') ? 'err-contact' : undefined}
            className={`${field} ${show('contact') ? bad : ok}`}
          />
        </label>

        <label className="block">
          <span className="mark mb-2 block">Email</span>
          <input
            id="enq-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@business.co.uk"
            onBlur={() => onBlur('email')}
            aria-invalid={show('email') || show('contact') ? true : undefined}
            aria-describedby={show('email') ? 'err-email' : undefined}
            className={`${field} ${show('email') || show('contact') ? bad : ok}`}
          />
          {show('email') ? (
            <span id="err-email" className="mt-2 block text-[0.9rem] text-bone">
              {errors.email}
            </span>
          ) : null}
        </label>
      </div>

      {show('contact') ? (
        <p id="err-contact" className="mt-3 text-[0.9rem] text-bone">
          {errors.contact}
        </p>
      ) : null}

      <label className="mt-4 block">
        <span className="mark mb-2 block">What do you need?</span>
        <textarea name="message" rows={4} placeholder="A few lines is plenty."
                  className={`${field} ${ok} resize-y`} />
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

        {state === 'error' && sendError ? (
          <p role="alert" className="text-[0.92rem] text-bone">
            {sendError}{' '}
            <a href={`mailto:${SITE.email}`} className="underline">
              {SITE.email}
            </a>
          </p>
        ) : null}
      </div>
    </form>
  );
}
