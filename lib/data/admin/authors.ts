import { createClient } from '@/lib/supabase/server';
import type { Author } from '@/lib/types';

export async function listAllAuthors() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('authors')
    .select('*')
    .order('name', { ascending: true })
    .returns<Author[]>();

  if (error) throw error;
  return data ?? [];
}
