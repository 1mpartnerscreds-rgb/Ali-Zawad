import { AUDIT } from '@/content/site';
import type { Finding } from '@/lib/audit/types';

/**
 * Consequence first, always. The measurement sits underneath in small type for
 * the visitor who wants to verify it — or forward it to whoever built the site.
 */

const RULE: Record<Finding['severity'], string> = {
  high: 'border-band-poor',
  medium: 'border-band-fair',
  low: 'border-line',
  good: 'border-band-good',
};

export function Findings({ findings }: { findings: Finding[] }) {
  return (
    <section aria-labelledby="findings-heading">
      <h2 id="findings-heading" className="text-small font-medium text-muted">
        {AUDIT.findingsTitle}
      </h2>
      <ul className="mt-8 space-y-10">
        {findings.map((finding) => (
          <li key={finding.id} className={`border-l-2 pl-6 ${RULE[finding.severity]}`}>
            <p className="text-body">{finding.headline}</p>
            <p className="mt-2 text-small text-muted">{finding.metric}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
