import { createClient } from '@/lib/supabase/server';

export interface PostViewRow {
  id: string;
  title: string;
  slug: string;
  views_count: number;
  published_at: string;
  category: { name: string; slug: string };
}

export async function getViewsAnalytics() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select(
      'id, title, slug, views_count, published_at, category:categories!inner ( name, slug )'
    )
    .eq('status', 'published')
    .order('views_count', { ascending: false })
    .returns<PostViewRow[]>();

  if (error) throw error;
  const rows = data ?? [];
  const totalViews = rows.reduce((sum, row) => sum + row.views_count, 0);
  const averageViews = rows.length > 0 ? Math.round(totalViews / rows.length) : 0;

  return {
    rows,
    totalViews,
    averageViews,
    top10: rows.slice(0, 10),
  };
}

export async function getTopPosts(limit = 5) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('posts')
    .select('id, title, slug, views_count, category:categories!inner ( slug )')
    .eq('status', 'published')
    .order('views_count', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data ?? [];
}
