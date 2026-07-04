import { createClient } from '@/lib/supabase/server';
import type { Post, PostWithRelations } from '@/lib/types';

const ADMIN_POST_SELECT = `
  *,
  category:categories!inner ( id, name, slug, color_code, display_order ),
  author:authors!inner ( id, name, slug, avatar_url, role )
`;

export async function listAllPosts() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select(ADMIN_POST_SELECT)
    .order('updated_at', { ascending: false })
    .returns<PostWithRelations[]>();

  if (error) throw error;
  return data ?? [];
}

export async function getPostById(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select(ADMIN_POST_SELECT)
    .eq('id', id)
    .limit(1)
    .returns<PostWithRelations[]>();

  if (error) throw error;
  return data[0] ?? null;
}

export async function getPostStats() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('id, status, views_count')
    .returns<Pick<Post, 'id' | 'status' | 'views_count'>[]>();

  if (error) throw error;
  const posts = data ?? [];
  const published = posts.filter((p) => p.status === 'published').length;
  const drafts = posts.filter((p) => p.status === 'draft').length;
  const totalViews = posts.reduce((sum, p) => sum + p.views_count, 0);

  return { published, drafts, total: posts.length, totalViews };
}
