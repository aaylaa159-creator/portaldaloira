interface LookerStudioEmbedProps {
  embedUrl: string;
}

/** Relatório GA4 incorporado via Looker Studio. */
export function LookerStudioEmbed({ embedUrl }: LookerStudioEmbedProps) {
  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
      <iframe
        title="Relatório Google Analytics — Looker Studio"
        src={embedUrl}
        className="h-[min(720px,80vh)] w-full border-0"
        allowFullScreen
        sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
      />
    </div>
  );
}

interface LookerStudioSetupGuideProps {
  measurementId: string | undefined;
  invalidUrl: boolean;
}

/** Passo a passo para conectar GA4 via Looker Studio (só colar 1 URL depois). */
export function LookerStudioSetupGuide({
  measurementId,
  invalidUrl,
}: LookerStudioSetupGuideProps) {
  return (
    <div className="space-y-4 text-sm text-gray-600">
      {invalidUrl ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
          <p className="font-medium">URL de incorporação inválida</p>
          <p className="mt-1">
            Use um link que comece com{' '}
            <code className="rounded bg-red-100 px-1">
              https://lookerstudio.google.com/embed/reporting/...
            </code>
          </p>
        </div>
      ) : null}

      {measurementId ? (
        <p>
          O site já envia dados ao GA4 (
          <code className="rounded bg-gray-100 px-1">{measurementId}</code>). Falta incorporar o
          relatório abaixo.
        </p>
      ) : (
        <p>
          Configure também <code className="rounded bg-gray-100 px-1">NEXT_PUBLIC_GA_MEASUREMENT_ID</code>{' '}
          para o site enviar pageviews ao GA4.
        </p>
      )}

      <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-amber-950">
        <p className="font-medium">Você só precisa colar 1 URL quando terminar</p>
        <p className="mt-1">
          Variável: <code className="rounded bg-amber-100 px-1">LOOKER_STUDIO_EMBED_URL</code> no{' '}
          <code className="rounded bg-amber-100 px-1">.env.local</code> e na Vercel.
        </p>
      </div>

      <ol className="list-inside list-decimal space-y-3">
        <li>
          Abra{' '}
          <a
            href="https://lookerstudio.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:underline"
          >
            lookerstudio.google.com
          </a>{' '}
          com a conta Google da redação.
        </li>
        <li>
          Clique em <strong>Criar</strong> → <strong>Relatório</strong>.
        </li>
        <li>
          Em <strong>Criar origem de dados</strong>, escolha <strong>Google Analytics</strong> →
          selecione a propriedade do Portal da Loira.
        </li>
        <li>Monte o painel (usuários, pageviews, páginas mais vistas — como preferir).</li>
        <li>
          Menu <strong>Arquivo → Incorporar relatório</strong> (ou ícone de compartilhar →{' '}
          <strong>Incorporar</strong>).
        </li>
        <li>
          Copie a URL que começa com{' '}
          <code className="rounded bg-gray-100 px-1">https://lookerstudio.google.com/embed/...</code>
        </li>
        <li>
          Cole em <code className="rounded bg-gray-100 px-1">.env.local</code>:
          <pre className="mt-2 overflow-x-auto rounded-lg bg-gray-900 p-3 text-xs text-gray-100">
            LOOKER_STUDIO_EMBED_URL=https://lookerstudio.google.com/embed/reporting/SEU-ID/page/SEU-ID
          </pre>
        </li>
        <li>
          Na Vercel: <strong>Settings → Environment Variables</strong> → mesma variável →{' '}
          <strong>Redeploy</strong>.
        </li>
      </ol>

      <a
        href="https://analytics.google.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
      >
        Abrir GA4 (tempo real) ↗
      </a>
    </div>
  );
}
