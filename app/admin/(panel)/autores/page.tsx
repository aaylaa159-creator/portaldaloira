import Link from 'next/link';
import { listAllAuthors } from '@/lib/data/admin/authors';

export default async function AdminAuthorsPage() {
  const authors = await listAllAuthors();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">Autores</h1>
        <Link
          href="/admin/autores/novo"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white"
        >
          + Novo autor
        </Link>
      </div>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3 text-left">Nome</th>
              <th className="px-4 py-3 text-left">Função</th>
              <th className="px-4 py-3 text-left">Slug</th>
              <th className="px-4 py-3 text-left">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {authors.map((a) => (
              <tr key={a.id}>
                <td className="px-4 py-3 font-medium">{a.name}</td>
                <td className="px-4 py-3 capitalize">{a.role}</td>
                <td className="px-4 py-3 text-gray-500">{a.slug}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/autores/${a.id}/editar`} className="text-brand-600 hover:underline">
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
