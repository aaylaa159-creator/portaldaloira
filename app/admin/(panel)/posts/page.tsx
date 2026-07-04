import Link from 'next/link';
import { listAllPosts } from '@/lib/data/admin/posts';
import { formatDate } from '@/lib/format';

export default async function AdminPostsPage() {
  const posts = await listAllPosts();

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-gray-900">Notícias</h1>
        <Link
          href="/admin/posts/novo"
          className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-700"
        >
          + Nova notícia
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gray-200 bg-gray-50 text-xs uppercase text-gray-500">
            <tr>
              <th className="px-4 py-3">Título</th>
              <th className="hidden px-4 py-3 md:table-cell">Editoria</th>
              <th className="px-4 py-3">Status</th>
              <th className="hidden px-4 py-3 sm:table-cell">Views</th>
              <th className="hidden px-4 py-3 lg:table-cell">Atualizado</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {posts.map((post) => (
              <tr key={post.id} className="hover:bg-gray-50">
                <td className="max-w-xs truncate px-4 py-3 font-medium">{post.title}</td>
                <td className="hidden px-4 py-3 md:table-cell">{post.category.name}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={post.status} />
                </td>
                <td className="hidden px-4 py-3 sm:table-cell">
                  {post.views_count.toLocaleString('pt-BR')}
                </td>
                <td className="hidden px-4 py-3 text-gray-500 lg:table-cell">
                  {formatDate(post.updated_at)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link
                      href={`/admin/posts/${post.id}/editar`}
                      className="text-brand-600 hover:underline"
                    >
                      Editar
                    </Link>
                    {post.status === 'published' ? (
                      <Link
                        href={`/${post.category.slug}/${post.slug}`}
                        target="_blank"
                        className="text-gray-500 hover:underline"
                      >
                        Ver
                      </Link>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">Nenhuma notícia cadastrada.</p>
        ) : null}
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    published: 'bg-green-100 text-green-800',
    draft: 'bg-gray-100 text-gray-700',
    scheduled: 'bg-amber-100 text-amber-800',
  };
  const labels: Record<string, string> = {
    published: 'Publicado',
    draft: 'Rascunho',
    scheduled: 'Agendado',
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${styles[status] ?? styles.draft}`}
    >
      {labels[status] ?? status}
    </span>
  );
}
