import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { CategoryForm } from '@/components/admin/CategoryForm';
import type { Category } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('categories').select('*').eq('id', id).single<Category>();
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Editar editoria</h1>
      <CategoryForm category={data} />
    </div>
  );
}
