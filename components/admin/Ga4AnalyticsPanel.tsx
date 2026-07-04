import Link from 'next/link';
import { FieldLabel } from '@/components/admin/FieldLabel';

interface Ga4SetupGuideProps {
  measurementId: string | undefined;
  apiConfigured: boolean;
}

/** Instruções para conectar a GA4 Data API ao painel de Acessos. */
export function Ga4SetupGuide({ measurementId, apiConfigured }: Ga4SetupGuideProps) {
  return (
    <div className="space-y-4 text-sm text-gray-600">
      {!measurementId ? (
        <p>
          Configure <code className="rounded bg-gray-100 px-1">NEXT_PUBLIC_GA_MEASUREMENT_ID</code>{' '}
          para o site enviar pageviews ao GA4.
        </p>
      ) : (
        <p>
          Measurement ID (site público):{' '}
          <code className="rounded bg-gray-100 px-2 py-0.5">{measurementId}</code>
        </p>
      )}

      {!apiConfigured ? (
        <>
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
            <p className="font-medium">Falta conectar a API de leitura do GA4</p>
            <p className="mt-1">
              O site já pode enviar dados ao Google, mas este painel precisa de uma conta de
              serviço com permissão de leitura na propriedade GA4.
            </p>
          </div>

          <div>
            <p className="mb-2 font-medium text-gray-900">Passo a passo</p>
            <ol className="list-inside list-decimal space-y-2">
              <li>
                No{' '}
                <a
                  href="https://console.cloud.google.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-600 hover:underline"
                >
                  Google Cloud Console
                </a>
                , crie um projeto (ou use o existente) e ative a{' '}
                <strong>Google Analytics Data API</strong>.
              </li>
              <li>
                Crie uma <strong>conta de serviço</strong> → chaves → JSON. Guarde o arquivo com
                segurança (não commite no Git).
              </li>
              <li>
                No GA4: <strong>Administrar → Acesso à propriedade → + → Usuários</strong> → adicione
                o e-mail da conta de serviço (<code className="rounded bg-gray-100 px-1">...@...iam.gserviceaccount.com</code>)
                como <strong>Leitor</strong>.
              </li>
              <li>
                Copie o <strong>ID da propriedade</strong> (número, ex.:{' '}
                <code className="rounded bg-gray-100 px-1">123456789</code>) em Administrar →
                Configurações da propriedade. <em>Não</em> é o Measurement ID{' '}
                <code className="rounded bg-gray-100 px-1">G-...</code>.
              </li>
              <li>
                Converta o JSON da chave em Base64 (PowerShell):
                <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">
                  {`[Convert]::ToBase64String([IO.File]::ReadAllBytes("caminho\\ga4-key.json"))`}
                </pre>
              </li>
              <li>
                Adicione no <code className="rounded bg-gray-100 px-1">.env.local</code> e na Vercel:
                <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">
                  {`GA4_PROPERTY_ID=123456789\nGA_SERVICE_KEY_BASE64=ewogICJ0eXBlIjog...`}
                </pre>
              </li>
              <li>Reinicie o deploy ou <code className="rounded bg-gray-100 px-1">npm run dev</code>.</li>
            </ol>
          </div>

          <p className="text-xs text-gray-500">
            Alternativa local: use <code className="rounded bg-gray-100 px-1">GA4_CLIENT_EMAIL</code>{' '}
            e <code className="rounded bg-gray-100 px-1">GA4_PRIVATE_KEY</code> em vez do Base64.
          </p>
        </>
      ) : null}

      <a
        href="https://analytics.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Abrir painel completo do GA4 ↗
      </a>
    </div>
  );
}

interface Ga4DashboardPanelProps {
  summary: {
    activeUsers: number;
    sessions: number;
    pageViews: number;
    periodLabel: string;
  };
  realtimeUsers: number;
  topPages: { path: string; pageViews: number; title: string | null }[];
}

export function Ga4DashboardPanel({ summary, realtimeUsers, topPages }: Ga4DashboardPanelProps) {
  const maxViews = topPages[0]?.pageViews ?? 1;

  return (
    <>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-5">
          <FieldLabel inline className="text-sm text-gray-600" tooltip="Usuários únicos no período (GA4).">
            Usuários ativos
          </FieldLabel>
          <p className="font-display text-3xl font-bold text-brand-900">
            {summary.activeUsers.toLocaleString('pt-BR')}
          </p>
          <p className="mt-1 text-xs text-gray-500">{summary.periodLabel}</p>
        </div>
        <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-5">
          <FieldLabel inline className="text-sm text-gray-600" tooltip="Total de sessões no site (GA4).">
            Sessões
          </FieldLabel>
          <p className="font-display text-3xl font-bold text-brand-900">
            {summary.sessions.toLocaleString('pt-BR')}
          </p>
          <p className="mt-1 text-xs text-gray-500">{summary.periodLabel}</p>
        </div>
        <div className="rounded-xl border border-brand-200 bg-brand-50/50 p-5">
          <FieldLabel inline className="text-sm text-gray-600" tooltip="Visualizações de página (GA4).">
            Pageviews
          </FieldLabel>
          <p className="font-display text-3xl font-bold text-brand-900">
            {summary.pageViews.toLocaleString('pt-BR')}
          </p>
          <p className="mt-1 text-xs text-gray-500">{summary.periodLabel}</p>
        </div>
        <div className="rounded-xl border border-green-200 bg-green-50/50 p-5">
          <FieldLabel inline className="text-sm text-gray-600" tooltip="Usuários ativos nos últimos 30 minutos (GA4).">
            Agora no site
          </FieldLabel>
          <p className="font-display text-3xl font-bold text-green-800">
            {realtimeUsers.toLocaleString('pt-BR')}
          </p>
          <p className="mt-1 text-xs text-gray-500">Tempo real</p>
        </div>
      </div>

      <section className="mb-2">
        <h3 className="mb-1 font-display text-base font-bold">Top matérias (GA4)</h3>
        <p className="mb-4 text-xs text-gray-500">{summary.periodLabel} — por visualizações de página</p>
        {topPages.length === 0 ? (
          <p className="text-sm text-gray-500">
            Ainda não há pageviews de matérias no GA4. Navegue no site público e aguarde alguns
            minutos.
          </p>
        ) : (
          <div className="space-y-3">
            {topPages.map((row) => (
              <div key={row.path} className="flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <Link
                    href={row.path}
                    target="_blank"
                    className="truncate text-sm font-medium hover:text-brand-600"
                  >
                    {row.title ?? row.path}
                  </Link>
                  <p className="truncate text-xs text-gray-500">{row.path}</p>
                </div>
                <div className="hidden w-32 sm:block">
                  <div className="h-2 overflow-hidden rounded-full bg-gray-100">
                    <div
                      className="h-full rounded-full bg-brand-600"
                      style={{ width: `${(row.pageViews / maxViews) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="w-16 text-right text-sm font-semibold text-brand-600">
                  {row.pageViews.toLocaleString('pt-BR')}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
