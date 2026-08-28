import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { OPENING, SITE } from '@/content/site';

export const runtime = 'nodejs';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const alt = OPENING.statement.join(' ');

const font = (file: string) => readFileSync(join(process.cwd(), 'app/fonts', file));

/**
 * The share card. These links get pasted into cold email, so this is often the
 * first frame anyone sees — it carries the statement and nothing else.
 *
 * Satori cannot read woff2, so both faces are static TTF cuts instanced from
 * the same subset the site ships. The card is type on Ink, like everything else.
 */
export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#14161A',
          padding: '72px 76px',
        }}
      >
        <div style={{ display: 'flex', fontFamily: 'Mono', fontSize: 20, letterSpacing: 4, color: '#828892' }}>
          AZ STUDIO
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            fontFamily: 'Display',
            fontSize: 104,
            lineHeight: 0.92,
            letterSpacing: -3,
            color: '#E8E4DC',
          }}
        >
          {OPENING.statement.map((line) => (
            <div key={line} style={{ display: 'flex' }}>
              {line}
            </div>
          ))}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontFamily: 'Mono',
            fontSize: 20,
            letterSpacing: 2,
            color: '#828892',
          }}
        >
          <span>FRONT-END + MOTION, WHITE LABEL</span>
          <span>{SITE.domain}</span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: 'Display', data: font('og-display.ttf'), style: 'normal', weight: 400 },
        { name: 'Mono', data: font('og-mono.ttf'), style: 'normal', weight: 400 },
      ],
    },
  );
}
