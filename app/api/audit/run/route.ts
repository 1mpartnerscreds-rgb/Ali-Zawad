import { redirect } from 'next/navigation';
import { normalizeInput } from '@/lib/audit/normalize';
import { getAudit } from '@/lib/audit/run';
import { AUDIT_LIMIT, clientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 30;

/**
 * The no-JavaScript path.
 *
 * The homepage form posts here natively. We run the audit, which warms the cache,
 * then redirect to the result page — so the visitor sees a browser loading
 * indicator for the length of a real measurement and then a fully server-rendered
 * result. Slower than the streamed version, but it works with scripting off.
 */
export async function POST(request: Request) {
  const form = await request.formData();
  const parsed = normalizeInput(String(form.get('url') ?? ''));

  // Nothing usable to audit. /audit/invalid renders the honest 'that address
  // didn't work' page, which is the same one the scripted path lands on.
  if (!parsed.ok) redirect('/audit/invalid');

  const verdict = rateLimit(clientIp(request.headers), AUDIT_LIMIT);
  if (!verdict.ok) redirect(`/audit/${encodeURIComponent(parsed.domain)}?e=rate-limited`);

  // Warm the 24h cache so the result page renders from it rather than re-running.
  await getAudit(parsed.domain);
  redirect(`/audit/${encodeURIComponent(parsed.domain)}`);
}
