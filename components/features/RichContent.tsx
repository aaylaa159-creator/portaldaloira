import { Fragment } from 'react';
import { AdBanner } from '@/components/features/AdBanner';
import { sanitizeContent, splitContentForAds } from '@/lib/content';
import type { AdPlacement } from '@/lib/types';

interface RichContentProps {
  html: string;
}

const IN_CONTENT_PLACEMENTS: AdPlacement[] = ['in_content_1', 'in_content_2'];

/**
 * Renderiza o corpo da matéria com HTML higienizado (anti-XSS) e injeta
 * blocos de anúncio após o 3º e o 7º parágrafo.
 */
export function RichContent({ html }: RichContentProps) {
  const segments = splitContentForAds(sanitizeContent(html));

  return (
    <div className="prose prose-slate max-w-none lg:prose-lg prose-a:text-brand-700 prose-headings:font-display">
      {segments.map((segment, index) => (
        <Fragment key={index}>
          <div dangerouslySetInnerHTML={{ __html: segment }} />
          {index < segments.length - 1 && index < IN_CONTENT_PLACEMENTS.length ? (
            <div className="not-prose my-6">
              <AdBanner placement={IN_CONTENT_PLACEMENTS[index]} />
            </div>
          ) : null}
        </Fragment>
      ))}
    </div>
  );
}
