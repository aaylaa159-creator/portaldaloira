import Link from 'next/link';
import { FieldLabel } from '@/components/admin/FieldLabel';
import {
  LookerStudioEmbed,
  LookerStudioSetupGuide,
} from '@/components/admin/LookerStudioPanel';
import { getLookerStudioEmbedUrl } from '@/lib/analytics/looker-studio';
import { getViewsAnalytics } from '@/lib/data/admin/analytics';
import { formatDateShort } from '@/lib/format';

export const revalidate = 300;

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const LOOKER_RAW = process.env.LOOKER_STUDIO_EMBED_URL?.trim();
const lookerEmbedUrl = getLookerStudioEmbedUrl();
const lookerInvalid = Boolean(LOOKER_RAW && !lookerEmbedUrl);

export default async function AdminAnalyticsPage() {
  const portal = await getViewsAnalytics();
  const { rows, totalViews, averageViews, top10 } = portal;
  const maxPortalViews = top10[0]?.views_count ?? 1;

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-gray-900">Acessos</h1>
      <p className="mb-8 text-sm text-gray-500">
        Relatório do Google Analytics 4 incorporado para a redação acompanhar o portal.
      </p>

      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="font-display text-lg font-bold">Google Analytics (Looker Studio)</h2>
          {GA_MEASUREMENT_ID ? (
            <span className="text-xs text-gray-500">
              Measurement ID:{' '}
              <code className="rounded bg-gray-100 px-1">{GA_MEASUREMENT_ID}</code>
            </span>
          ) : null}
        </div>

        {lookerEmbedUrl ? (
          <LookerStudioEmbed embedUrl={lookerEmbedUrl} />
        ) : (
          <LookerStudioSetupGuide
            measurementId={GA_MEASUREMENT_ID}
            invalidUrl={lookerInvalid}
          />
        )}
      </section>

      <details className="mb-8 rounded-xl border border-gray-200 bg-white">
        <summary className="cursor-pointer px-6 py-4 font-display text-lg font-bold text-gray-800">
          Contador interno do portal (Supabase)
        </summary>
        <div className="border-t px-6 pb-6 pt-4">
          <p className="mb-4 text-xs text-gray-500">
            Views por matéria registradas pelo portal a cada abertura de notícia. Matérias do{' '}
            <code className="rounded bg-gray-100 px-1">seed.sql</code> incluem números fictícios de
            demonstração.
          </p>

          <div className="mb-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <FieldLabel
                inline
                tooltip="Soma do contador interno views_count no Supabase."
                className="text-sm text-gray-500"
              >
                Total de views (interno)
              </FieldLabel>
              <p className="font-display text-2xl font-bold">{totalViews.toLocaleString('pt-BR')}</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <FieldLabel
                inline
                tooltip="Média de views por matéria publicada (contador interno)."
                className="text-sm text-gray-500"
              >
                Média por matéria
              </FieldLabel>
              <p className="font-display text-2xl font-bold">{averageViews.toLocaleString('pt-BR')}</p>
            </div>
            <div className="rounded-lg border border-gray-100 bg-gray-50 p-4">
              <FieldLabel
                inline
                tooltip="Quantidade de matérias com status publicado."
                className="text-sm text-gray-500"
              >
                Matérias publicadas
              </FieldLabel>
              <p className="font-display text-2xl font-bold">{rows.length}</p>
            </div>
          </div>

          <h3 className="mb-3 text-sm font-bold text-gray-700">Top 10 (contador interno)</h3>
          <div className="space-y-2">
            {top10.map((row) => (
              <div key={row.id} className="flex items-center gap-3 text-sm">
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{row.title}</p>
                  <p className="text-xs text-gray-500">{row.category.name}</p>
                </div>
                <div className="hidden w-24 sm:block">
                  <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
                    <div
                      className="h-full rounded-full bg-gray-400"
                      style={{ width: `${(row.views_count / maxPortalViews) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="w-14 text-right text-gray-600">
                  {row.views_count.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </details>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <h2 className="border-b px-6 py-4 font-display text-lg font-bold">
          Todas as matérias (contador interno)
        </h2>
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Matéria</th>
              <th className="px-4 py-3 text-left">Editoria</th>
              <th className="px-4 py-3 text-left">Views</th>
              <th className="px-4 py-3 text-left">Publicada</th>
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
                  >
                    {row.title}
                  </Link>
                </td>
                <td className="px-4 py-3">{row.category.name}</td>
                <td className="px-4 py-3 font-medium">{row.views_count.toLocaleString('pt-BR')}</td>
                <td className="px-4 py-3 text-gray-500">{formatDateShort(row.published_at)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
