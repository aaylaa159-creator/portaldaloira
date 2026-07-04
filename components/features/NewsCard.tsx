import Image from 'next/image';
import Link from 'next/link';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { formatDateShort } from '@/lib/format';
import type { PostSummary } from '@/lib/types';

interface NewsCardProps {
  post: PostSummary;
  variant?: 'default' | 'horizontal' | 'compact';
  priority?: boolean;
}

export function NewsCard({
  post,
  variant = 'default',
  priority = false,
}: NewsCardProps) {
  const href = `/${post.category.slug}/${post.slug}`;

  if (variant === 'compact') {
    return (
      <article>
        <Link href={href} className="group block">
          <CategoryBadge category={post.category} linked={false} />
          <h3 className="mt-1.5 font-display text-base font-bold leading-snug text-foreground group-hover:text-brand-700">
            {post.title}
          </h3>
          <time
            dateTime={post.published_at}
            className="mt-1 block text-xs text-gray-500"
          >
            {formatDateShort(post.published_at)}
          </time>
        </Link>
      </article>
    );
  }

  if (variant === 'horizontal') {
    return (
      <article>
        <Link href={href} className="group flex gap-4">
          <div className="relative aspect-[16/10] w-36 shrink-0 overflow-hidden rounded-lg sm:w-44">
            <Image
              src={post.cover_image}
              alt={post.title}
              fill
              sizes="176px"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          <div className="min-w-0">
            <CategoryBadge category={post.category} linked={false} />
            <h3 className="mt-1.5 font-display text-base font-bold leading-snug text-foreground group-hover:text-brand-700">
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
    );
  }

  return (
    <article>
      <Link href={href} className="group block">
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={post.cover_image}
            alt={post.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <div className="mt-3">
          <CategoryBadge category={post.category} linked={false} />
          <h3 className="mt-2 font-display text-lg font-bold leading-snug text-foreground group-hover:text-brand-700">
            {post.title}
          </h3>
          {post.subtitle ? (
            <p className="mt-1.5 line-clamp-2 text-sm text-gray-600">
              {post.subtitle}
            </p>
          ) : null}
          <time
            dateTime={post.published_at}
            className="mt-2 block text-xs text-gray-500"
          >
            {formatDateShort(post.published_at)}
          </time>
        </div>
      </Link>
    </article>
  );
}
