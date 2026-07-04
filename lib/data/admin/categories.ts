import { createClient } from '@/lib/supabase/server';
import type { Category } from '@/lib/types';

export async function listAllCategories() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true })
    .returns<Category[]>();

  if (error) throw error;
  return data ?? [];
}

export async function getCategoryPostCount(categoryId: string) {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from('posts')
    .select('id', { count: 'exact', head: true })
    .eq('category_id', categoryId);

  if (error) throw error;
  return count ?? 0;
}
