import { notFound } from 'next/navigation';
import { getPostById } from '@/lib/data/admin/posts';
import { listAllCategories } from '@/lib/data/admin/categories';
import { listAllAuthors } from '@/lib/data/admin/authors';
import { PostForm } from '@/components/admin/PostForm';

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const [post, categories, authors] = await Promise.all([
    getPostById(id),
    listAllCategories(),
    listAllAuthors(),
  ]);

  if (!post) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-gray-900">Editar notícia</h1>
      <PostForm post={post} categories={categories} authors={authors} />
    </div>
  );
}
