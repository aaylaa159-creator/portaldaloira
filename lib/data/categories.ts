import { cache } from 'react';
import { createStaticClient } from '@/lib/supabase/static';
import type { Category } from '@/lib/types';
import { DEV_CATEGORIES } from '@/lib/data/dev-fallback';
import { logSupabaseFetchIssue } from '@/lib/data/fetch-error';

const USE_DEV_FALLBACK =
  process.env.NODE_ENV === 'development' &&
  process.env.NEXT_PUBLIC_USE_DEV_FALLBACK !== 'false';

/** Se true, não tenta Supabase — útil com internet fraca (`.env.local`). */
const USE_DEV_ONLY = process.env.NEXT_PUBLIC_USE_DEV_ONLY === 'true';

/** Todas as editorias ordenadas para o menu de navegação. */
export const getCategories = cache(async (): Promise<Category[]> => {
  if (USE_DEV_ONLY) {
    return DEV_CATEGORIES;
  }

  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('categories')
      .select('id, name, slug, color_code, display_order')
      .order('display_order', { ascending: true })
      .returns<Category[]>();

    if (error) throw error;
    return data;
  } catch (err) {
    if (USE_DEV_FALLBACK) {
      logSupabaseFetchIssue('data/categories', err, { usingFallback: true });
      return DEV_CATEGORIES;
    }
    logSupabaseFetchIssue('data/categories', err);
    return [];
  }
});

/** Editoria específica pelo slug. */
export const getCategoryBySlug = cache(
  async (slug: string): Promise<Category | null> => {
    try {
      const supabase = createStaticClient();
      const { data, error } = await supabase
        .from('categories')
        .select('id, name, slug, color_code, display_order')
        .eq('slug', slug)
        .limit(1)
        .returns<Category[]>();

      if (error) throw error;
      return data[0] ?? null;
    } catch (err) {
      console.error('[data/categories] getCategoryBySlug:', err);
      return null;
    }
  }
);
