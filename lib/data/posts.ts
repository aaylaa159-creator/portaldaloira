import { cache } from 'react';
import { createStaticClient } from '@/lib/supabase/static';
import type { PostSummary, PostWithRelations } from '@/lib/types';

const SUMMARY_SELECT = `
  id, title, subtitle, slug, cover_image, published_at, views_count, featured_position,
  category:categories!inner ( id, name, slug, color_code, display_order ),
  author:authors!inner ( id, name, slug, avatar_url, role )
`;

const FULL_SELECT = `
  *,
  category:categories!inner ( id, name, slug, color_code, display_order ),
  author:authors!inner ( id, name, slug, avatar_url, bio, role, instagram, twitter, email )
`;

/** Manchete principal da Home. */
export const getMainHeadline = cache(async (): Promise<PostSummary | null> => {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('posts')
      .select(SUMMARY_SELECT)
      .eq('featured_position', 'main')
      .order('published_at', { ascending: false })
      .limit(1)
      .returns<PostSummary[]>();

    if (error) throw error;
    return data[0] ?? null;
  } catch (err) {
    console.error('[data/posts] getMainHeadline:', err);
    return null;
  }
});

/** Destaques secundários ao lado da manchete. */
export const getSecondaryHighlights = cache(async (limit = 3): Promise<PostSummary[]> => {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('posts')
      .select(SUMMARY_SELECT)
      .eq('featured_position', 'secondary')
      .order('published_at', { ascending: false })
      .limit(limit)
      .returns<PostSummary[]>();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[data/posts] getSecondaryHighlights:', err);
    return [];
  }
});

/** Posts do carrossel de opinião/colunistas. */
export const getCarouselPosts = cache(async (limit = 6): Promise<PostSummary[]> => {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('posts')
      .select(SUMMARY_SELECT)
      .eq('featured_position', 'carousel')
      .order('published_at', { ascending: false })
      .limit(limit)
      .returns<PostSummary[]>();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[data/posts] getCarouselPosts:', err);
    return [];
  }
});

/** Últimas notícias de uma editoria (bloco da Home e página da editoria). */
export const getPostsByCategory = cache(async (
  categorySlug: string,
  limit = 4,
  offset = 0
): Promise<PostSummary[]> => {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('posts')
      .select(SUMMARY_SELECT)
      .eq('category.slug', categorySlug)
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1)
      .returns<PostSummary[]>();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[data/posts] getPostsByCategory:', err);
    return [];
  }
});

/** Ranking de mais lidas (sidebar). */
export const getMostRead = cache(async (limit = 5): Promise<PostSummary[]> => {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('posts')
      .select(SUMMARY_SELECT)
      .order('views_count', { ascending: false })
      .limit(limit)
      .returns<PostSummary[]>();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[data/posts] getMostRead:', err);
    return [];
  }
});

/** Últimas notícias gerais (fallback e listagens). */
export const getLatestPosts = cache(async (limit = 10): Promise<PostSummary[]> => {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('posts')
      .select(SUMMARY_SELECT)
      .order('published_at', { ascending: false })
      .limit(limit)
      .returns<PostSummary[]>();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[data/posts] getLatestPosts:', err);
    return [];
  }
});

/** Notícia completa para a página interna. */
export const getPostBySlug = cache(async (
  slug: string
): Promise<PostWithRelations | null> => {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('posts')
      .select(FULL_SELECT)
      .eq('slug', slug)
      .limit(1)
      .returns<PostWithRelations[]>();

    if (error) throw error;
    return data[0] ?? null;
  } catch (err) {
    console.error('[data/posts] getPostBySlug:', err);
    return null;
  }
});

/** Notícias relacionadas (mesma editoria, exclui a atual). */
export const getRelatedPosts = cache(async (
  categorySlug: string,
  excludeId: string,
  limit = 4
): Promise<PostSummary[]> => {
  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('posts')
      .select(SUMMARY_SELECT)
      .eq('category.slug', categorySlug)
      .neq('id', excludeId)
      .order('published_at', { ascending: false })
      .limit(limit)
      .returns<PostSummary[]>();

    if (error) throw error;
    return data;
  } catch (err) {
    console.error('[data/posts] getRelatedPosts:', err);
    return [];
  }
});

/** Incrementa o contador de visualizações via RPC (fire-and-forget). */
export async function incrementPostViews(slug: string): Promise<void> {
  try {
    const supabase = createStaticClient();
    const { error } = await supabase.rpc('increment_post_views', {
      post_slug: slug,
    });
    if (error) throw error;
  } catch (err) {
    console.error('[data/posts] incrementPostViews:', err);
  }
}
