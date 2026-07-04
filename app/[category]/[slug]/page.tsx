import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Sidebar } from '@/components/common/Sidebar';
import { AdBanner } from '@/components/features/AdBanner';
import { NewsCard } from '@/components/features/NewsCard';
import { RichContent } from '@/components/features/RichContent';
import { ShareButtons } from '@/components/features/ShareButtons';
import { ViewTracker } from '@/components/features/ViewTracker';
import { CategoryBadge } from '@/components/ui/CategoryBadge';
import { getLatestPosts, getPostBySlug, getRelatedPosts } from '@/lib/data/posts';
import { formatDate } from '@/lib/format';

export const revalidate = 60;
export const dynamicParams = true;

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

interface PostPageProps {
  params: Promise<{ category: string; slug: string }>;
}

export async function generateStaticParams() {
  try {
    const posts = await getLatestPosts(20);
    return posts.map((post) => ({
      category: post.category.slug,
      slug: post.slug,
    }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: 'Notícia não encontrada' };
  }

  const canonical = `/${post.category.slug}/${post.slug}`;

  return {
    title: post.title,
    description: post.subtitle ?? post.title,
    alternates: { canonical },
    openGraph: {
      title: post.title,
      description: post.subtitle ?? post.title,
      type: 'article',
      publishedTime: post.published_at,
      authors: [post.author.name],
      url: canonical,
      images: [{ url: post.cover_image, width: 1200, height: 675 }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.subtitle ?? post.title,
      images: [post.cover_image],
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { category: categorySlug, slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post || post.category.slug !== categorySlug) {
    notFound();
  }

  const related = await getRelatedPosts(post.category.slug, post.id, 4);
  const postUrl = `${SITE_URL}/${post.category.slug}/${post.slug}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: post.title,
    description: post.subtitle ?? undefined,
    image: [post.cover_image],
    datePublished: post.published_at,
    dateModified: post.updated_at,
    author: [{ '@type': 'Person', name: post.author.name }],
    publisher: {
      '@type': 'Organization',
      name: 'Portal da Loira',
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.png` },
    },
    mainEntityOfPage: postUrl,
  };

  return (
    <>
      <Header />
      <ViewTracker slug={post.slug} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="mb-6">
          <AdBanner placement="header_top" />
        </div>

        <div className="grid gap-10 lg:grid-cols-4">
          <article className="lg:col-span-3">
            <CategoryBadge category={post.category} size="md" />

            <h1 className="mt-3 font-display text-3xl font-extrabold leading-tight text-foreground sm:text-4xl">
              {post.title}
            </h1>

            {post.subtitle ? (
              <p className="mt-3 text-lg text-gray-600 sm:text-xl">
                {post.subtitle}
              </p>
            ) : null}

            <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-y border-gray-200 py-3">
              <div className="flex items-center gap-3">
                {post.author.avatar_url ? (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.name}
                    width={44}
                    height={44}
                    className="h-11 w-11 rounded-full object-cover ring-2 ring-brand-200"
                  />
                ) : null}
                <div>
                  <p className="text-sm font-bold text-foreground">
                    {post.author.name}
                  </p>
                  <time
                    dateTime={post.published_at}
                    className="text-xs text-gray-500"
                  >
                    {formatDate(post.published_at)}
                  </time>
                </div>
              </div>
              <ShareButtons title={post.title} url={postUrl} />
            </div>

            <figure className="mt-6">
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src={post.cover_image}
                  alt={post.cover_caption ?? post.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 75vw"
                  priority
                  loading="eager"
                  className="object-cover"
                />
              </div>
              {post.cover_caption ? (
                <figcaption className="mt-2 text-xs text-gray-500">
                  {post.cover_caption}
                </figcaption>
              ) : null}
            </figure>

            <div className="mt-8">
              <RichContent html={post.content} />
            </div>

            {post.tags.length > 0 ? (
              <ul className="mt-8 flex flex-wrap gap-2" aria-label="Tags">
                {post.tags.map((tag) => (
                  <li
                    key={tag}
                    className="rounded-full bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            ) : null}

            <section className="mt-10 rounded-xl bg-brand-50 p-6">
              <div className="flex items-center gap-4">
                {post.author.avatar_url ? (
                  <Image
                    src={post.author.avatar_url}
                    alt={post.author.name}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-full object-cover ring-2 ring-brand-300"
                  />
                ) : null}
                <div>
                  <p className="font-display font-bold text-brand-900">
                    {post.author.name}
                  </p>
                  {post.author.bio ? (
                    <p className="mt-1 text-sm text-gray-600">
                      {post.author.bio}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>

            {related.length > 0 ? (
              <section className="mt-12" aria-label="Notícias relacionadas">
                <h2 className="mb-5 border-b-4 border-accent-600 pb-2 font-display text-xl font-extrabold uppercase tracking-wide text-brand-800">
                  Leia também
                </h2>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {related.map((relatedPost) => (
                    <NewsCard key={relatedPost.id} post={relatedPost} />
                  ))}
                </div>
              </section>
            ) : null}

            <div className="mt-10">
              <Link
                href={`/editoria/${post.category.slug}`}
                className="font-semibold text-brand-700 hover:underline"
              >
                ← Mais notícias de {post.category.name}
              </Link>
            </div>
          </article>

          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
