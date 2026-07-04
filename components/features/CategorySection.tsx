import Link from 'next/link';
import { NewsCard } from '@/components/features/NewsCard';
import type { Category, PostSummary } from '@/lib/types';

interface CategorySectionProps {
  category: Category;
  posts: PostSummary[];
}

/** Bloco horizontal de editoria na Home (4 últimas notícias). */
export function CategorySection({ category, posts }: CategorySectionProps) {
  if (posts.length === 0) return null;

  return (
    <section aria-label={`Editoria ${category.name}`}>
      <div
        className="mb-4 flex items-center justify-between border-b-4 pb-2"
        style={{ borderColor: category.color_code ?? '#7C22B8' }}
      >
        <h2
          className="font-display text-xl font-extrabold uppercase tracking-wide"
          style={{ color: category.color_code ?? '#7C22B8' }}
        >
          {category.name}
        </h2>
        <Link
          href={`/editoria/${category.slug}`}
          className="text-sm font-semibold text-gray-500 hover:text-brand-700"
        >
          Ver todas →
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  );
}
