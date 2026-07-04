import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { AuthorForm } from '@/components/admin/AuthorForm';
import type { Author } from '@/lib/types';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditAuthorPage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.from('authors').select('*').eq('id', id).single<Author>();
  if (!data) notFound();

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Editar autor</h1>
      <AuthorForm author={data} />
    </div>
  );
}
