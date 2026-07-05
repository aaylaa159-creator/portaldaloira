import { MediaKitLeadActions, MediaKitLeadStatusBadge } from '@/components/admin/MediaKitLeadActions';
import { listMediaKitLeads } from '@/lib/data/admin/media-kit-leads';
import { formatDateShort } from '@/lib/format';

export const dynamic = 'force-dynamic';

export default async function AdminComercialPage() {
  const leads = await listMediaKitLeads();
  const newCount = leads.filter((lead) => lead.status === 'new').length;

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-gray-900">
        Solicitações comerciais
      </h1>
      <p className="mb-8 text-sm text-gray-500">
        Pedidos de mídia kit enviados pela página Anuncie conosco.
        {newCount > 0 ? (
          <span className="ml-2 font-medium text-accent-700">
            {newCount} nova{newCount > 1 ? 's' : ''} pendente{newCount > 1 ? 's' : ''}
          </span>
        ) : null}
      </p>

      {leads.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white px-6 py-12 text-center">
          <p className="text-sm text-gray-500">
            Nenhuma solicitação ainda. Elas aparecem aqui quando alguém preenche o
            formulário em /anuncie.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3 text-left">Data</th>
                  <th className="px-4 py-3 text-left">Nome</th>
                  <th className="px-4 py-3 text-left">Empresa</th>
                  <th className="px-4 py-3 text-left">Contato</th>
                  <th className="px-4 py-3 text-left">Mensagem</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map((lead) => (
                  <tr key={lead.id} className="align-top">
                    <td className="whitespace-nowrap px-4 py-3 text-gray-500">
                      {formatDateShort(lead.created_at)}
                    </td>
                    <td className="px-4 py-3 font-medium">{lead.name}</td>
                    <td className="px-4 py-3">{lead.company}</td>
                    <td className="px-4 py-3">
                      <a
                        href={`mailto:${lead.email}`}
                        className="block text-brand-600 hover:underline"
                      >
                        {lead.email}
                      </a>
                      {lead.phone ? (
                        <a
                          href={`tel:${lead.phone.replace(/\D/g, '')}`}
                          className="mt-1 block text-gray-600 hover:text-brand-600"
                        >
                          {lead.phone}
                        </a>
                      ) : null}
                    </td>
                    <td className="max-w-xs px-4 py-3 text-gray-600">
                      {lead.message ? (
                        <p className="whitespace-pre-wrap break-words">{lead.message}</p>
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <MediaKitLeadStatusBadge status={lead.status} />
                    </td>
                    <td className="px-4 py-3">
                      <MediaKitLeadActions lead={lead} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
