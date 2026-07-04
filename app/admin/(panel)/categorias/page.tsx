import Link from 'next/link';
import { FieldLabel } from '@/components/admin/FieldLabel';
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
              <th className="px-4 py-3 text-left">
                <FieldLabel inline tooltip="Nome da editoria exibido no menu e nos badges das matérias.">
                  Nome
                </FieldLabel>
              </th>
              <th className="px-4 py-3 text-left">
                <FieldLabel inline tooltip="Parte da URL das notícias desta editoria (ex: /politica/...).">
                  Slug
                </FieldLabel>
              </th>
              <th className="px-4 py-3 text-left">
                <FieldLabel inline tooltip="Cor de identificação visual da editoria no site.">
                  Cor
                </FieldLabel>
              </th>
              <th className="px-4 py-3 text-left">
                <FieldLabel inline tooltip="Posição no menu principal. Números menores aparecem primeiro.">
                  Ordem
                </FieldLabel>
              </th>
              <th className="px-4 py-3 text-left">
                <FieldLabel inline tooltip="Editar configurações da editoria ou excluí-la.">
                  Ações
                </FieldLabel>
              </th>
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
