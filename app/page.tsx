import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';
import { Sidebar } from '@/components/common/Sidebar';
import { AdBanner } from '@/components/features/AdBanner';
import { CategorySection } from '@/components/features/CategorySection';
import { HeroGrid } from '@/components/features/HeroGrid';
import { getCategories } from '@/lib/data/categories';
import { getHomePostsData } from '@/lib/data/home';

export const revalidate = 60;

export default async function HomePage() {
  const [{ main, secondary, carousel, mostRead, postsByCategorySlug }, categories] =
    await Promise.all([getHomePostsData(), getCategories()]);

  return (
    <>
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6">
        <div className="mb-6">
          <AdBanner placement="header_top" />
        </div>

        <HeroGrid main={main} secondary={secondary} />

        <div className="mt-10 grid gap-10 lg:grid-cols-4">
          <div className="flex flex-col gap-12 lg:col-span-3">
            {categories.map((category) => (
              <CategorySection
                key={category.id}
                category={category}
                posts={postsByCategorySlug[category.slug] ?? []}
              />
            ))}
          </div>

          <div className="lg:col-span-1">
            <Sidebar mostRead={mostRead} opinion={carousel} />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
