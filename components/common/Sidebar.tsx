import Image from 'next/image';
import Link from 'next/link';
import { AdBanner } from '@/components/features/AdBanner';
import { getCarouselPosts, getMostRead } from '@/lib/data/posts';
import type { PostSummary } from '@/lib/types';

interface SidebarProps {
  /** Dados pré-carregados na Home (evita consultas extras). */
  mostRead?: PostSummary[];
  opinion?: PostSummary[];
}

/** Barra lateral: mais lidas, colunistas/opinião e anúncio vertical. */
export async function Sidebar({ mostRead, opinion }: SidebarProps) {
  const [mostReadPosts, opinionPosts] = await Promise.all([
    mostRead ?? getMostRead(5),
    opinion ?? getCarouselPosts(4),
  ]);

  return (
    <aside className="flex flex-col gap-8" aria-label="Barra lateral">
      <AdBanner placement="sidebar_right" />

      {mostReadPosts.length > 0 ? (
        <section aria-label="Mais lidas">
          <h2 className="mb-4 border-b-4 border-accent-600 pb-2 font-display text-lg font-extrabold uppercase tracking-wide text-brand-800">
            Mais lidas
          </h2>
          <ol className="flex flex-col gap-4">
            {mostReadPosts.map((post, index) => (
              <li key={post.id} className="flex gap-3">
                <span className="font-display text-3xl font-black leading-none text-accent-500">
                  {index + 1}
                </span>
                <Link
                  href={`/${post.category.slug}/${post.slug}`}
                  className="group min-w-0"
                >
                  <h3 className="font-display text-sm font-bold leading-snug text-foreground group-hover:text-brand-700">
                    {post.title}
                  </h3>
                </Link>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      {opinionPosts.length > 0 ? (
        <section aria-label="Opinião e colunistas">
          <h2 className="mb-4 border-b-4 border-brand-700 pb-2 font-display text-lg font-extrabold uppercase tracking-wide text-brand-800">
            Opinião
          </h2>
          <ul className="flex flex-col gap-5">
            {opinionPosts.map((post) => (
              <li key={post.id}>
                <Link
                  href={`/${post.category.slug}/${post.slug}`}
                  className="group flex items-center gap-3"
                >
                  {post.author.avatar_url ? (
                    <Image
                      src={post.author.avatar_url}
                      alt={post.author.name}
                      width={48}
                      height={48}
                      className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-brand-200"
                    />
                  ) : (
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-100 font-display font-bold text-brand-700">
                      {post.author.name.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">
                      {post.author.name}
                    </p>
                    <h3 className="font-display text-sm font-bold leading-snug text-foreground group-hover:text-brand-700">
                      {post.title}
                    </h3>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </aside>
  );
}
