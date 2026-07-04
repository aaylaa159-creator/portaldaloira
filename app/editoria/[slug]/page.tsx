import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Sidebar } from '@/components/common/Sidebar';
import { AdBanner } from '@/components/features/AdBanner';
import { NewsCard } from '@/components/features/NewsCard';
import { getCategories, getCategoryBySlug } from '@/lib/data/categories';
import { getPostsByCategory } from '@/lib/data/posts';

export const revalidate = 60;
export const dynamicParams = true;

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  try {
    const categories = await getCategories();
    return categories.map((category) => ({ slug: category.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: 'Editoria não encontrada' };
  }

  return {
    title: category.name,
    description: `Últimas notícias de ${category.name} no Portal da Loira.`,
    alternates: { canonical: `/editoria/${category.slug}` },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(slug, 12);

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="mb-6">
          <AdBanner placement="header_top" />
        </div>

        <div
          className="mb-6 border-b-4 pb-3"
          style={{ borderColor: category.color_code ?? '#7C22B8' }}
        >
          <h1
            className="font-display text-3xl font-extrabold uppercase tracking-wide"
            style={{ color: category.color_code ?? '#7C22B8' }}
          >
            {category.name}
          </h1>
        </div>

        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-3">
            {posts.length > 0 ? (
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {posts.map((post, index) => (
                  <NewsCard key={post.id} post={post} priority={index < 3} />
                ))}
              </div>
            ) : (
              <p className="py-12 text-center text-gray-500">
                Nenhuma notícia publicada nesta editoria ainda.
              </p>
            )}
          </div>

          <div className="lg:col-span-1">
            <Sidebar />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
