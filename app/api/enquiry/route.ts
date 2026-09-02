import { NextResponse } from 'next/server';
import { SITE } from '@/content/site';

/** Node runtime: this talks to an outbound API and must not be edge-cached. */
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type Body = {
  name?: string; business?: string; phone?: string; email?: string;
  message?: string; company?: string; // `company` is the honeypot
};

const clean = (v: unknown, max: number) =>
  typeof v === 'string' ? v.trim().slice(0, max) : '';

export async function POST(request: Request) {
  let body: Body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Could not read that submission.' }, { status: 400 });
  }

  // Bots fill every field they find. A real person never sees this one.
  if (clean(body.company, 80)) return NextResponse.json({ ok: true });

  const name = clean(body.name, 120);
  const business = clean(body.business, 160);
  const phone = clean(body.phone, 40);
  const email = clean(body.email, 200);
  const message = clean(body.message, 4000);

  // Phone is the field that matters for this buyer, so either route back is
  // enough — but one of them has to be there or the enquiry is unanswerable.
  if (!name || (!phone && !email)) {
    return NextResponse.json(
      { error: 'Please give your name and either a phone number or an email address.' },
      { status: 422 },
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ error: 'That email address does not look right.' }, { status: 422 });
  }

  const key = process.env.RESEND_API_KEY;
  const to = process.env.ENQUIRY_TO ?? SITE.email;
  const from = process.env.ENQUIRY_FROM ?? 'AIMS Studio <onboarding@resend.dev>';

  if (!key) {
    // Never pretend it was sent. A silent success here loses real work.
    console.error('[enquiry] RESEND_API_KEY is not set — enquiry not delivered', {
      name, business, phone, email,
    });
    return NextResponse.json(
      { error: 'We could not send that just now. Please email us directly.' },
      { status: 503 },
    );
  }

  const lines = [
    `Name:     ${name}`,
    business ? `Business: ${business}` : null,
    phone ? `Phone:    ${phone}` : null,
    email ? `Email:    ${email}` : null,
    '',
    message || '(no message)',
  ].filter(Boolean).join('\n');

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Enquiry — ${business || name}`,
        text: lines,
        // So hitting reply in the inbox goes to the customer, not to us.
        ...(email ? { reply_to: email } : {}),
      }),
    });

    if (!res.ok) {
      console.error('[enquiry] provider rejected', res.status, await res.text().catch(() => ''));
      return NextResponse.json(
        { error: 'We could not send that just now. Please email us directly.' },
        { status: 502 },
      );
    }
  } catch (cause) {
    console.error('[enquiry] send failed', cause);
    return NextResponse.json(
      { error: 'We could not send that just now. Please email us directly.' },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
