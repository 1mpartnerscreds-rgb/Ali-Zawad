import { normalizeInput } from '@/lib/audit/normalize';
import { getAudit, openProgressChannel } from '@/lib/audit/run';
import type { AuditStreamEvent } from '@/lib/audit/types';
import { AUDIT_LIMIT, clientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * Streams the audit as newline-delimited JSON, one object per real event.
 *
 * A cached domain produces no progress events at all — the runner never executes,
 * so the client gets `done` in a few milliseconds and shows the result instantly.
 */
export async function POST(request: Request) {
  const verdict = rateLimit(clientIp(request.headers), AUDIT_LIMIT);
  if (!verdict.ok) {
    return Response.json(
      { error: 'rate-limited' },
      { status: 429, headers: { 'retry-after': String(verdict.retryAfterSeconds) } },
    );
  }

  let body: { url?: string };
  try {
    body = (await request.json()) as { url?: string };
  } catch {
    return Response.json({ error: 'invalid' }, { status: 400 });
  }

  const parsed = normalizeInput(body.url ?? '');
  if (!parsed.ok) return Response.json({ error: 'invalid' }, { status: 400 });
  const { domain } = parsed;

  const encoder = new TextEncoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      let closed = false;
      const send = (event: AuditStreamEvent) => {
        if (closed) return;
        controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
      };

      const close = openProgressChannel(domain, send);

      try {
        const result = await getAudit(domain);
        if (result.status === 'failed') {
          send({ type: 'error', reason: result.reason });
        } else {
          send({ type: 'done', id: domain, status: result.status });
        }
      } catch {
        send({ type: 'error', reason: 'upstream' });
      } finally {
        close();
        closed = true;
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'content-type': 'application/x-ndjson; charset=utf-8',
      'cache-control': 'no-store, no-transform',
      'x-accel-buffering': 'no',
    },
  });
}
