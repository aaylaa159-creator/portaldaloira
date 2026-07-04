import Image from 'next/image';
import Link from 'next/link';
import { MobileMenu } from '@/components/common/MobileMenu';
import { getCategories } from '@/lib/data/categories';
import { formatToday } from '@/lib/format';

export async function Header() {
  const categories = await getCategories();

  return (
    <header className="relative bg-gradient-to-r from-brand-900 via-brand-800 to-brand-900 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
        <Link href="/" aria-label="Portal da Loira - Página inicial">
          <Image
            src="/logo.png"
            alt="Portal da Loira - Onde a notícia ganha voz"
            width={1024}
            height={1024}
            priority
            loading="eager"
            className="h-14 w-auto rounded bg-white px-2 py-1 sm:h-16"
          />
        </Link>

        <p className="hidden text-sm capitalize text-brand-100 md:block">
          {formatToday()}
        </p>

        <MobileMenu categories={categories} />
      </div>

      <nav
        aria-label="Editorias"
        className="hidden border-t border-white/10 bg-brand-950/60 lg:block"
      >
        <ul className="mx-auto flex max-w-7xl items-center gap-1 px-4">
          {categories.map((category) => (
            <li key={category.id}>
              <Link
                href={`/editoria/${category.slug}`}
                className="block px-4 py-3 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors hover:bg-white/10 hover:text-accent-400"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
