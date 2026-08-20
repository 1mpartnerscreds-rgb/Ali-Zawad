import { ButtonLink } from '@/components/Button';
import { NOT_FOUND } from '@/content/site';

export default function NotFound() {
  return (
    <div className="mx-auto max-w-text px-6 py-28">
      <h1 className="text-display font-regular">{NOT_FOUND.title}</h1>
      <p className="mt-6 text-body text-muted">{NOT_FOUND.body}</p>
      <div className="mt-10">
        <ButtonLink href="/" variant="quiet">
          {NOT_FOUND.cta}
        </ButtonLink>
      </div>
    </div>
  );
}
