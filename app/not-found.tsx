import { ButtonLink } from '@/components/Button';
import { NOT_FOUND } from '@/content/site';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-text px-6 py-32 lg:px-10">
      <h1 className="font-display text-hero font-light">{NOT_FOUND.title}</h1>
      <p className="mt-7 text-lead text-muted">{NOT_FOUND.body}</p>
      <div className="mt-10">
        <ButtonLink href="/" variant="quiet">
          {NOT_FOUND.cta}
        </ButtonLink>
      </div>
    </div>
  );
}
