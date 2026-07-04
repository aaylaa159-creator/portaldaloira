'use server';

import { getEditorialUser } from '@/lib/auth/editorial';
import { createClient } from '@/lib/supabase/server';

/** Zera views_count de todas as matérias (remove números fictícios do seed). */
export async function resetDemoViewsCount(): Promise<{ updated: number }> {
  const user = await getEditorialUser();
  if (!user) {
    throw new Error('Acesso editorial necessário.');
  }
  const supabase = await createClient();

  const { data: posts, error: selectError } = await supabase
    .from('posts')
    .select('id, views_count')
    .returns<{ id: string; views_count: number }[]>();

  if (selectError) throw new Error(selectError.message);

  const rows = posts ?? [];
  let updated = 0;

  for (const post of rows) {
    if (post.views_count === 0) continue;
    const { error } = await supabase
      .from('posts')
      .update({ views_count: 0 })
      .eq('id', post.id);
    if (error) throw new Error(error.message);
    updated += 1;
  }

  return { updated };
}
