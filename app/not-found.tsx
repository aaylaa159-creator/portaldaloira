import Link from 'next/link';
import { Header } from '@/components/common/Header';
import { Footer } from '@/components/common/Footer';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center px-4 py-24 text-center">
        <p className="font-display text-7xl font-black text-brand-200">404</p>
        <h1 className="mt-4 font-display text-2xl font-extrabold text-brand-900">
          Página não encontrada
        </h1>
        <p className="mt-2 max-w-md text-gray-600">
          A notícia que você procura pode ter sido removida ou o endereço está
          incorreto.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-full bg-accent-600 px-6 py-2.5 font-semibold text-white hover:bg-accent-700"
        >
          Voltar à página inicial
        </Link>
      </main>
      <Footer />
    </>
  );
}
