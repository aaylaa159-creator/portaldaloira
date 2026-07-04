'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireEditorialUser } from '@/lib/auth/editorial';
import { slugify } from '@/lib/slug';
import { getCategoryPostCount } from '@/lib/data/admin/categories';

export interface CategoryFormInput {
  name: string;
  slug: string;
  color_code: string;
  display_order: number;
}

export async function createCategory(input: CategoryFormInput) {
  await requireEditorialUser();
  const supabase = await createClient();

  const { error } = await supabase.from('categories').insert({
    name: input.name,
    slug: input.slug || slugify(input.name),
    color_code: input.color_code,
    display_order: input.display_order,
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/categorias');
  revalidatePath('/');
  return { ok: true };
}

export async function updateCategory(id: string, input: CategoryFormInput) {
  await requireEditorialUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from('categories')
    .update({
      name: input.name,
      slug: input.slug,
      color_code: input.color_code,
      display_order: input.display_order,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/categorias');
  revalidatePath('/');
  revalidatePath(`/editoria/${input.slug}`);
  return { ok: true };
}

export async function deleteCategory(id: string) {
  await requireEditorialUser();
  const count = await getCategoryPostCount(id);
  if (count > 0) {
    return { error: `Esta editoria possui ${count} notícia(s). Remova ou mova antes de excluir.` };
  }

  const supabase = await createClient();
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/categorias');
  revalidatePath('/');
  return { ok: true };
}
