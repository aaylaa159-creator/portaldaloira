import Link from 'next/link';
import { FieldLabel } from '@/components/admin/FieldLabel';
import { listAllBanners } from '@/lib/data/admin/banners';

export default async function AdminBannersPage() {
  const banners = await listAllBanners();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Anúncios</h1>
        <Link
          href="/admin/banners/novo"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Novo anúncio
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">
                <FieldLabel inline tooltip="Espaço do site onde o anúncio é exibido (topo, sidebar, conteúdo, popup).">
                  Posição
                </FieldLabel>
              </th>
              <th className="px-4 py-3 text-left">
                <FieldLabel inline tooltip="Formato do anúncio: imagem com link ou código script (AdSense, etc.).">
                  Tipo
                </FieldLabel>
              </th>
              <th className="px-4 py-3 text-left">
                <FieldLabel inline tooltip="Indica se o anúncio está sendo exibido no site neste momento.">
                  Ativo
                </FieldLabel>
              </th>
              <th className="px-4 py-3 text-left">
                <FieldLabel inline tooltip="Editar ou excluir o anúncio selecionado.">
                  Ações
                </FieldLabel>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {banners.map((b) => (
              <tr key={b.id}>
                <td className="px-4 py-3 font-medium">{b.placement}</td>
                <td className="px-4 py-3">{b.type}</td>
                <td className="px-4 py-3">{b.active ? 'Sim' : 'Não'}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/banners/${b.id}/editar`} className="text-brand-600 hover:underline">
                    Editar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
