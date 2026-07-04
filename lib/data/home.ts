import { cache } from 'react';
import { createStaticClient } from '@/lib/supabase/static';
import type { PostSummary } from '@/lib/types';
import { getDevHomePostsData } from '@/lib/data/dev-fallback';
import { logSupabaseFetchIssue } from '@/lib/data/fetch-error';

const USE_DEV_FALLBACK =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_DEV_FALLBACK !== 'false';

const USE_DEV_ONLY = process.env.NEXT_PUBLIC_USE_DEV_ONLY === 'true';

const SUMMARY_SELECT = `
  id, title, subtitle, slug, cover_image, published_at, views_count, featured_position,
  category:categories!inner ( id, name, slug, color_code, display_order ),
  author:authors!inner ( id, name, slug, avatar_url, role )
`;

export interface HomePostsData {
  main: PostSummary | null;
  secondary: PostSummary[];
  carousel: PostSummary[];
  mostRead: PostSummary[];
  postsByCategorySlug: Record<string, PostSummary[]>;
}

const EMPTY_HOME: HomePostsData = {
  main: null,
  secondary: [],
  carousel: [],
  mostRead: [],
  postsByCategorySlug: {},
};

/**
 * Uma única consulta para montar a Home (em vez de 10+ requisições separadas).
 */
export const getHomePostsData = cache(async (): Promise<HomePostsData> => {
  if (USE_DEV_ONLY) {
    return getDevHomePostsData();
  }

  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('posts')
      .select(SUMMARY_SELECT)
      .order('published_at', { ascending: false })
      .limit(60)
      .returns<PostSummary[]>();

    if (error) throw error;
    const posts = data ?? [];

    const main =
      posts.find((post) => post.featured_position === 'main') ?? null;
    const secondary = posts
      .filter((post) => post.featured_position === 'secondary')
      .slice(0, 3);
    const carousel = posts
      .filter((post) => post.featured_position === 'carousel')
      .slice(0, 4);
    const mostRead = [...posts]
      .sort((a, b) => b.views_count - a.views_count)
      .slice(0, 5);

    const postsByCategorySlug: Record<string, PostSummary[]> = {};
    for (const post of posts) {
      const slug = post.category.slug;
      if (!postsByCategorySlug[slug]) {
        postsByCategorySlug[slug] = [];
      }
      if (postsByCategorySlug[slug].length < 4) {
        postsByCategorySlug[slug].push(post);
      }
    }

    return { main, secondary, carousel, mostRead, postsByCategorySlug };
  } catch (err) {
    if (USE_DEV_FALLBACK) {
      logSupabaseFetchIssue('data/home', err, { usingFallback: true });
      return getDevHomePostsData();
    }
    logSupabaseFetchIssue('data/home', err);
    return EMPTY_HOME;
  }
});
