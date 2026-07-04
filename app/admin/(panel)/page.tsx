import Link from 'next/link';
import { getPostStats } from '@/lib/data/admin/posts';
import { getTopPosts } from '@/lib/data/admin/analytics';

export default async function AdminDashboardPage() {
  const [stats, topPosts] = await Promise.all([getPostStats(), getTopPosts(5)]);

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500">Resumo do Portal da Loira</p>
        </div>
        <Link
          href="/admin/posts/novo"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Nova notícia
        </Link>
      </div>

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Publicadas" value={stats.published} />
        <StatCard label="Rascunhos" value={stats.drafts} />
        <StatCard label="Total de notícias" value={stats.total} />
        <StatCard label="Visualizações" value={stats.totalViews.toLocaleString('pt-BR')} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-lg font-bold">Mais lidas</h2>
            <Link href="/admin/analytics" className="text-sm text-brand-600 hover:underline">
              Ver tudo →
            </Link>
          </div>
          <ul className="space-y-3">
            {topPosts.map((post, i) => (
              <li key={post.id} className="flex items-start gap-3 text-sm">
                <span className="mt-0.5 font-bold text-brand-600">{i + 1}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium text-gray-900">{post.title}</p>
                  <p className="text-xs text-gray-500">
                    {post.views_count.toLocaleString('pt-BR')} views
                  </p>
                </div>
              </li>
            ))}
            {topPosts.length === 0 ? (
              <p className="text-sm text-gray-500">Nenhuma notícia publicada ainda.</p>
            ) : null}
          </ul>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="mb-4 font-display text-lg font-bold">Atalhos</h2>
          <div className="grid gap-2">
            <QuickLink href="/admin/posts" label="Gerenciar notícias" />
            <QuickLink href="/admin/categorias" label="Editorias" />
            <QuickLink href="/admin/autores" label="Autores" />
            <QuickLink href="/admin/banners" label="Banners publicitários" />
            <QuickLink href="/admin/analytics" label="Relatório de acessos" />
          </div>
        </section>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-1 font-display text-3xl font-bold text-gray-900">{value}</p>
    </div>
  );
}

function QuickLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="rounded-lg border border-gray-100 px-4 py-3 text-sm font-medium text-gray-700 hover:border-brand-200 hover:bg-brand-50"
    >
      {label}
    </Link>
  );
}
