import { ImageResponse } from 'next/og';
import { AUDIT, SITE } from '@/content/site';
import { displayDomain, idToDomain } from '@/lib/audit/normalize';
import { getAudit } from '@/lib/audit/run';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = 'Website audit result';

/**
 * The link preview.
 *
 * These URLs get pasted into WhatsApp and cold emails, where the preview card is
 * doing most of the persuading before anyone clicks. So it shows the two things
 * that make someone open it: their own domain, and their number.
 */

const BAND_COLOR = { poor: '#9f3d2f', fair: '#7e6210', good: '#3f6b45' } as const;

export default async function Image({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const domain = idToDomain(id);
  const name = domain ? displayDomain(domain) : id;
  const result = domain ? await getAudit(domain) : null;

  const complete = result?.status === 'complete' ? result : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#faf9f7',
          color: '#1a1917',
          padding: '72px 80px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', fontSize: 30, color: '#5b5952' }}>
          {AUDIT.metaPrefix} {name}
        </div>

        {complete ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                display: 'flex',
                fontSize: 230,
                lineHeight: 1,
                letterSpacing: '-0.05em',
                color: BAND_COLOR[complete.band],
              }}
            >
              {complete.score}
            </div>
            <div style={{ display: 'flex', marginTop: 24, fontSize: 44, letterSpacing: '-0.02em' }}>
              {AUDIT.verdicts[complete.band]}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', fontSize: 54, letterSpacing: '-0.02em', maxWidth: 900 }}>
            {result?.status === 'partial' ? AUDIT.partialTitle : 'We could not complete this audit'}
          </div>
        )}

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 28, color: '#5b5952' }}>
          <span>{SITE.name}</span>
          <span>{SITE.domain}</span>
        </div>
      </div>
    ),
    size,
  );
}
