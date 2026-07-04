import Link from 'next/link';
import { FieldLabel } from '@/components/admin/FieldLabel';
import { getViewsAnalytics } from '@/lib/data/admin/analytics';
import { formatDateShort } from '@/lib/format';

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default async function AdminAnalyticsPage() {
  const { rows, totalViews, averageViews, top10 } = await getViewsAnalytics();
  const maxViews = top10[0]?.views_count ?? 1;

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-gray-900">Acessos</h1>
      <p className="mb-8 text-sm text-gray-500">
        Visualizações registradas no portal e integração com Google Analytics
      </p>

      <div className="mb-8 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <FieldLabel
            inline
            tooltip="Contagem total de visualizações de páginas de matérias registradas internamente pelo portal."
            className="text-sm text-gray-500"
          >
            Total de views (portal)
          </FieldLabel>
          <p className="font-display text-3xl font-bold">{totalViews.toLocaleString('pt-BR')}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <FieldLabel
            inline
            tooltip="Média de visualizações por matéria publicada. Útil para comparar desempenho entre editorias."
            className="text-sm text-gray-500"
          >
            Média por matéria
          </FieldLabel>
          <p className="font-display text-3xl font-bold">{averageViews.toLocaleString('pt-BR')}</p>
        </div>
        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <FieldLabel
            inline
            tooltip="Quantidade de matérias publicadas consideradas no cálculo de views e médias desta página."
            className="text-sm text-gray-500"
          >
            Matérias publicadas
          </FieldLabel>
          <p className="font-display text-3xl font-bold">{rows.length}</p>
        </div>
      </div>

      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-display text-lg font-bold">Top 10 mais lidas</h2>
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
                    style={{ width: `${(row.views_count / maxViews) * 100}%` }}
                  />
                </div>
              </div>
              <span className="w-16 text-right text-sm font-semibold text-brand-600">
                {row.views_count.toLocaleString('pt-BR')}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-8 rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 font-display text-lg font-bold">Google Analytics 4</h2>
        {GA_ID ? (
          <div className="space-y-3 text-sm">
            <p>
              Measurement ID configurado:{' '}
              <code className="rounded bg-gray-100 px-2 py-0.5">{GA_ID}</code>
            </p>
            <p className="text-gray-600">
              O site público envia pageviews automaticamente. Acompanhe em tempo real no painel do
              Google.
            </p>
            <a
              href="https://analytics.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
            >
              Abrir painel GA4 ↗
            </a>
          </div>
        ) : (
          <div className="space-y-4 text-sm text-gray-600">
            <p>
              O código do portal já está pronto para enviar pageviews ao GA4. Falta criar a
              propriedade no Google e informar o Measurement ID aqui.
            </p>

            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-900">
              <p className="font-medium">O que já funciona sem o GA4</p>
              <p className="mt-1">
                As views acima vêm do banco do portal (Supabase), registradas a cada leitura de
                matéria. O Google Analytics é complementar — traz visitantes, origem do tráfego,
                dispositivos, tempo real etc.
              </p>
            </div>

            <div>
              <p className="mb-2 font-medium text-gray-900">Passo a passo (primeira vez)</p>
              <ol className="list-inside list-decimal space-y-2">
                <li>
                  Acesse{' '}
                  <a
                    href="https://analytics.google.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:underline"
                  >
                    analytics.google.com
                  </a>{' '}
                  com a conta Google da redação.
                </li>
                <li>
                  Clique em <strong>Administrar</strong> (ícone de engrenagem) →{' '}
                  <strong>Criar</strong> → <strong>Conta</strong> (ex.: &quot;Portal da
                  Loira&quot;).
                </li>
                <li>
                  Crie uma <strong>Propriedade</strong> (ex.: &quot;Portal da Loira — Site&quot;) e
                  escolha fuso horário Brasil e moeda BRL.
                </li>
                <li>
                  Em <strong>Fluxos de dados</strong>, adicione um fluxo <strong>Web</strong> com a
                  URL do site (produção ou <code className="rounded bg-gray-100 px-1">localhost</code>{' '}
                  para testes locais).
                </li>
                <li>
                  Copie o <strong>Measurement ID</strong> (formato{' '}
                  <code className="rounded bg-gray-100 px-1">G-XXXXXXXXXX</code>) na tela do fluxo
                  de dados.
                </li>
                <li>
                  No arquivo <code className="rounded bg-gray-100 px-1">.env.local</code>, descomente
                  e preencha:
                  <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">
                    NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
                  </pre>
                </li>
                <li>
                  Na Vercel (produção):{' '}
                  <strong>Settings → Environment Variables</strong> → adicione a mesma variável em
                  Production e Preview.
                </li>
                <li>Reinicie <code className="rounded bg-gray-100 px-1">npm run dev</code>.</li>
                <li>
                  Confirme em GA4: <strong>Relatórios → Tempo real</strong> enquanto navega no site
                  público.
                </li>
              </ol>
            </div>

            <p className="text-xs text-gray-500">
              Quando configurado, esta seção mostrará o ID ativo e um atalho para o painel do
              Google.
            </p>
          </div>
        )}
      </section>

      <section className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <h2 className="border-b px-6 py-4 font-display text-lg font-bold">Todas as matérias</h2>
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">
                <FieldLabel inline tooltip="Título da matéria publicada no portal.">
                  Matéria
                </FieldLabel>
              </th>
              <th className="px-4 py-3 text-left">
                <FieldLabel inline tooltip="Editoria (categoria) à qual a matéria pertence.">
                  Editoria
                </FieldLabel>
              </th>
              <th className="px-4 py-3 text-left">
                <FieldLabel inline tooltip="Número de visualizações registradas pelo portal para esta matéria.">
                  Views
                </FieldLabel>
              </th>
              <th className="px-4 py-3 text-left">
                <FieldLabel inline tooltip="Data em que a matéria foi publicada no site.">
                  Publicada
                </FieldLabel>
              </th>
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
