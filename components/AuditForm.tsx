'use client';

import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { AUDIT, AUDIT_ERRORS, HOME } from '@/content/site';
import { normalizeInput } from '@/lib/audit/normalize';
import type { AuditStreamEvent } from '@/lib/audit/types';

/**
 * The visual centre of the homepage, and the only client component on it.
 *
 * Without JavaScript this is a plain form that POSTs to /api/audit/run, which
 * runs the audit server-side and redirects to the result. With JavaScript we
 * intercept so we can show the status lines while the work happens.
 *
 * The status lines are real events streamed from the server as each check
 * finishes. Nothing here is on a timer. If the result is already cached the
 * server answers immediately and the visitor never sees a line — a staged delay
 * to make cached work "feel authentic" would be a lie about our own product.
 */
export function AuditForm() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  const [lines, setLines] = useState<string[]>([]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    const raw = inputRef.current?.value ?? '';
    const parsed = normalizeInput(raw);

    if (!parsed.ok) {
      event.preventDefault();
      setError(HOME.errors[parsed.reason]);
      inputRef.current?.focus();
      return;
    }

    // Everything past here needs fetch + streams. If the browser lacks either,
    // fall through to the native form POST rather than breaking.
    if (typeof window === 'undefined' || !window.fetch) return;
    event.preventDefault();

    setError(null);
    setRunning(true);
    setLines([]);

    try {
      const response = await fetch('/api/audit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url: parsed.domain }),
      });

      if (!response.ok || !response.body) {
        const reason = response.status === 429 ? 'rate-limited' : 'upstream';
        router.push(`/audit/${encodeURIComponent(parsed.domain)}?e=${reason}`);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let newline: number;
        while ((newline = buffer.indexOf('\n')) !== -1) {
          const chunk = buffer.slice(0, newline).trim();
          buffer = buffer.slice(newline + 1);
          if (!chunk) continue;

          const event = JSON.parse(chunk) as AuditStreamEvent;
          if (event.type === 'progress') {
            setLines((prev) => (prev.includes(event.label) ? prev : [...prev, event.label]));
          } else if (event.type === 'done' || event.type === 'error') {
            const query = event.type === 'error' ? `?e=${event.reason}` : '';
            router.push(`/audit/${encodeURIComponent(parsed.domain)}${query}`);
            return;
          }
        }
      }

      // Stream ended without a terminal event. The result page re-runs or reads
      // the cache, so sending them there is still correct.
      router.push(`/audit/${encodeURIComponent(parsed.domain)}`);
    } catch {
      setRunning(false);
      setError(AUDIT_ERRORS.upstream!.body);
    }
  }

  if (running) {
    return (
      <div className="mt-12">
        <p className="text-small text-muted">{AUDIT.runningTitle}</p>
        <ul
          className="mt-4 space-y-2"
          aria-live="polite"
          aria-relevant="additions"
          aria-label={AUDIT.liveRegionLabel}
        >
          {lines.map((line) => (
            <li key={line} className="az-status-line text-body text-ink">
              <span aria-hidden="true" className="mr-3 text-muted">
                —
              </span>
              {line}
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <form
      method="POST"
      action="/api/audit/run"
      onSubmit={onSubmit}
      noValidate
      className="mt-12"
      aria-describedby={error ? 'audit-error' : undefined}
    >
      <label htmlFor="audit-url" className="sr-only">
        {HOME.inputLabel}
      </label>

      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          ref={inputRef}
          id="audit-url"
          name="url"
          type="text"
          inputMode="url"
          autoComplete="url"
          autoCapitalize="none"
          spellCheck={false}
          placeholder={HOME.placeholder}
          aria-invalid={error ? true : undefined}
          onInput={() => error && setError(null)}
          className="t min-w-0 flex-1 rounded-sm border-2 border-accent bg-white px-5 py-4 text-body text-ink placeholder:text-muted focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        />
        <button
          type="submit"
          className="az-web t shrink-0 rounded-sm bg-accent px-7 py-4 text-body font-medium text-white hover:bg-accent-ink active:translate-y-px"
        >
          {HOME.submit}
        </button>
      </div>

      {error ? (
        <p id="audit-error" role="alert" className="mt-3 text-small text-band-poor">
          {error}
        </p>
      ) : null}
    </form>
  );
}
