import Link from 'next/link';
import { listAllCategories } from '@/lib/data/admin/categories';

export default async function AdminCategoriesPage() {
  const categories = await listAllCategories();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Editorias</h1>
        <Link
          href="/admin/categorias/novo"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Nova editoria
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Cor</th>
              <th className="px-4 py-3 text-left">Ordem</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {categories.map((c) => (
              <tr key={c.id}>
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-gray-500">{c.slug}</td>
                <td className="px-4 py-3">
                  <span
                    className="inline-block h-5 w-5 rounded"
                    style={{ backgroundColor: c.color_code ?? '#ccc' }}
                  />
                </td>
                <td className="px-4 py-3">{c.display_order}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/categorias/${c.id}/editar`} className="text-brand-600 hover:underline">
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
