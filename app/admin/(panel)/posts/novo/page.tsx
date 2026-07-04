import { listAllCategories } from '@/lib/data/admin/categories';
import { listAllAuthors } from '@/lib/data/admin/authors';
import { PostForm } from '@/components/admin/PostForm';

export default async function NewPostPage() {
  const [categories, authors] = await Promise.all([
    listAllCategories(),
    listAllAuthors(),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-gray-900">Nova notícia</h1>
      <PostForm categories={categories} authors={authors} />
    </div>
  );
}
