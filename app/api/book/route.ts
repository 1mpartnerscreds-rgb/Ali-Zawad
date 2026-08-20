import { redirect } from 'next/navigation';
import { deliver, validate, type Booking } from '@/lib/booking';
import { clientIp, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const BOOK_LIMIT = { limit: 6, windowMs: 10 * 60 * 1000 };

function readBooking(form: FormData): Booking {
  const str = (key: string) => String(form.get(key) ?? '').trim().slice(0, 2000);
  return {
    name: str('name'),
    email: str('email'),
    whatsapp: str('whatsapp'),
    message: str('message'),
    domain: str('domain') || null,
    score: str('score') || null,
    tier: str('tier') || null,
  };
}

export async function POST(request: Request) {
  const verdict = rateLimit(`book:${clientIp(request.headers)}`, BOOK_LIMIT);
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');

  if (!verdict.ok) {
    if (wantsJson) return Response.json({ error: 'rate-limited' }, { status: 429 });
    redirect('/book?error=rate-limited');
  }

  const form = await request.formData();
  const booking = readBooking(form);
  const errors = validate(booking);

  if (Object.keys(errors).length > 0) {
    if (wantsJson) return Response.json({ errors }, { status: 400 });
    redirect('/book?error=fields');
  }

  let delivery;
  try {
    delivery = await deliver(booking);
  } catch {
    if (wantsJson) return Response.json({ error: 'server' }, { status: 502 });
    redirect('/book?error=server');
  }

  if (wantsJson) return Response.json(delivery);

  // No-JavaScript path. WhatsApp delivery needs the browser to follow the link,
  // so we send them straight there rather than claiming it was sent.
  if (delivery.via === 'whatsapp') redirect(delivery.href);
  redirect('/book?sent=1');
}
