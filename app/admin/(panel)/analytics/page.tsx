import Link from 'next/link';
import { resetDemoViewsCount } from '@/lib/actions/admin/analytics';
import { getEditorialUser } from '@/lib/auth/editorial';
import { getViewsAnalytics } from '@/lib/data/admin/analytics';
import { formatDateShort } from '@/lib/format';

export const dynamic = 'force-dynamic';

/** Views acima disso indicam dados fictícios do seed antigo. */
const SEED_VIEWS_THRESHOLD = 500;

async function loadPortalAnalytics() {
  let portal = await getViewsAnalytics();
  const editor = await getEditorialUser();

  if (
    editor &&
    portal.rows.some((row) => row.views_count >= SEED_VIEWS_THRESHOLD)
  ) {
    await resetDemoViewsCount();
    portal = await getViewsAnalytics();
  }

  return portal;
}

export default async function AdminAnalyticsPage() {
  const { rows, totalViews, averageViews, top10 } = await loadPortalAnalytics();
  const maxViews = top10[0]?.views_count ?? 1;

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-gray-900">Acessos</h1>
      <p className="mb-8 text-sm text-gray-500">
        Visualizações registradas no portal — dados reais do Supabase.
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Total de visualizações</p>
          <p className="font-display text-3xl font-bold">
            {totalViews.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Média por matéria</p>
          <p className="font-display text-3xl font-bold">
            {averageViews.toLocaleString('pt-BR')}
          </p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">Matérias publicadas</p>
          <p className="font-display text-3xl font-bold">{rows.length}</p>
        </div>
      </div>

      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-display text-lg font-bold">Top 10 matérias</h2>
        {top10.length === 0 ? (
          <p className="text-sm text-gray-500">
            Nenhuma matéria publicada ainda. As views aparecem quando alguém abre uma
            matéria no site.
          </p>
        ) : (
          <div className="space-y-3">
            {top10.map((row) => (
              <div key={row.id} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{row.title}</p>
                  <p className="text-xs text-gray-500">{row.category.name}</p>
                </div>
                <div className="hidden w-32 sm:block">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{
                        width: `${maxViews > 0 ? (row.views_count / maxViews) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </div>
                <span className="w-16 text-right text-sm font-semibold text-brand-600">
                  {row.views_count.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <h2 className="border-b px-6 py-4 font-display text-lg font-bold">Todas as matérias</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-4 py-3 text-left">Matéria</th>
                <th className="px-4 py-3 text-left">Categoria</th>
                <th className="px-4 py-3 text-left">Views</th>
                <th className="px-4 py-3 text-left">Publicado em</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {rows.map((row) => (
                <tr key={row.id}>
                  <td className="max-w-xs truncate px-4 py-3">
                    <Link
                      href={`/${row.category.slug}/${row.slug}`}
                      target="_blank"
                      className="hover:text-brand-600"
                      title={row.title}
                    >
                      {row.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{row.category.name}</td>
                  <td className="px-4 py-3 font-medium">
                    {row.views_count.toLocaleString('pt-BR')}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                    {formatDateShort(row.published_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
