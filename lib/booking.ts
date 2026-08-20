import { SITE } from '@/content/site';

export interface Booking {
  name: string;
  email: string;
  whatsapp: string;
  message: string;
  domain: string | null;
  score: string | null;
  tier: string | null;
}

export interface BookingErrors {
  name?: string;
  email?: string;
  message?: string;
}

export function validate(b: Partial<Booking>): BookingErrors {
  const errors: BookingErrors = {};
  if (!b.name || b.name.trim().length < 2) errors.name = 'name';
  if (!b.email || !/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(b.email.trim())) errors.email = 'email';
  if (!b.message || b.message.trim().length < 5) errors.message = 'message';
  return errors;
}

/** What actually lands in the inbox, or in the WhatsApp thread. */
export function formatBooking(b: Booking): string {
  const lines: (string | null)[] = [
    `New enquiry from ${SITE.domain}`,
    '',
    `Name: ${b.name}`,
    `Email: ${b.email}`,
    b.whatsapp ? `WhatsApp: ${b.whatsapp}` : null,
    b.tier ? `Interested in: ${b.tier}` : null,
    b.domain ? `Their site: ${b.domain}${b.score ? ` (scored ${b.score}/100)` : ''}` : null,
    '',
    b.message,
  ];
  // Drop only the absent fields — the empty strings are deliberate blank lines,
  // and filtering on truthiness would eat them along with the nulls.
  return lines.filter((line) => line !== null).join('\n');
}

/**
 * Delivery.
 *
 * Email if a key is configured, otherwise a webhook, otherwise WhatsApp. That
 * last one is not a fallback for show — a prefilled wa.me link genuinely
 * delivers the message with no credentials at all, and it is how most of these
 * conversations end up happening anyway. What we never do is show somebody a
 * "thanks, we'll be in touch" screen for a message that went nowhere.
 */
export type Delivery = { via: 'email' | 'webhook' } | { via: 'whatsapp'; href: string };

export async function deliver(booking: Booking): Promise<Delivery> {
  const body = formatBooking(booking);

  const resendKey = process.env.RESEND_API_KEY;
  const to = process.env.BOOKING_TO_EMAIL;
  if (resendKey && to) {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { authorization: `Bearer ${resendKey}`, 'content-type': 'application/json' },
      body: JSON.stringify({
        from: process.env.BOOKING_FROM_EMAIL ?? `AZ Studio <onboarding@resend.dev>`,
        to: [to],
        reply_to: booking.email,
        subject: `Enquiry from ${booking.name}${booking.domain ? ` — ${booking.domain}` : ''}`,
        text: body,
      }),
    });
    if (response.ok) return { via: 'email' };
  }

  const webhook = process.env.BOOKING_WEBHOOK_URL;
  if (webhook) {
    const response = await fetch(webhook, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...booking, text: body }),
    });
    if (response.ok) return { via: 'webhook' };
  }

  return { via: 'whatsapp', href: `${SITE.whatsapp}?text=${encodeURIComponent(body)}` };
}
