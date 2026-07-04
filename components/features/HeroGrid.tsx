import Image from 'next/image';
import Link from 'next/link';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { formatDateShort } from '@/lib/format';
import type { PostSummary } from '@/lib/types';

interface HeroGridProps {
  main: PostSummary | null;
  secondary: PostSummary[];
}

/** Grade de destaques da Home: manchete principal + secundárias laterais. */
export function HeroGrid({ main, secondary }: HeroGridProps) {
  if (!main && secondary.length === 0) {
    return null;
  }

  return (
    <section aria-label="Destaques" className="grid gap-6 lg:grid-cols-5">
      {main ? (
        <article className="lg:col-span-3">
          <Link
            href={`/${main.category.slug}/${main.slug}`}
            className="group block"
          >
            <div className="relative aspect-video overflow-hidden rounded-xl">
              <Image
                src={main.cover_image}
                alt={main.title}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
                loading="eager"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-950/90 via-brand-950/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <CategoryBadge category={main.category} size="md" linked={false} />
                <h2 className="mt-3 font-display text-2xl font-extrabold leading-tight text-white sm:text-4xl">
                  {main.title}
                </h2>
                {main.subtitle ? (
                  <p className="mt-2 hidden text-sm text-gray-200 sm:block sm:text-base">
                    {main.subtitle}
                  </p>
                ) : null}
              </div>
            </div>
          </Link>
        </article>
      ) : null}

      <div className="flex flex-col gap-5 lg:col-span-2">
        {secondary.map((post) => (
          <article key={post.id}>
            <Link
              href={`/${post.category.slug}/${post.slug}`}
              className="group flex gap-4"
            >
              <div className="relative aspect-[16/10] w-32 shrink-0 overflow-hidden rounded-lg sm:w-40">
                <Image
                  src={post.cover_image}
                  alt={post.title}
                  fill
                  sizes="160px"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="min-w-0">
                <CategoryBadge category={post.category} linked={false} />
                <h3 className="mt-1.5 font-display text-base font-bold leading-snug text-foreground group-hover:text-brand-700 sm:text-lg">
                  {post.title}
                </h3>
                <time
                  dateTime={post.published_at}
                  className="mt-1 block text-xs text-gray-500"
                >
                  {formatDateShort(post.published_at)}
                </time>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
