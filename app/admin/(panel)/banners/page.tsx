import Link from 'next/link';
import { listAllBanners } from '@/lib/data/admin/banners';

export default async function AdminBannersPage() {
  const banners = await listAllBanners();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Banners</h1>
        <Link
          href="/admin/banners/novo"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Novo banner
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Posição</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Ativo</th>
              <th className="px-4 py-3 text-left">Ações</th>
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
