import { cache } from 'react';
import { createStaticClient } from '@/lib/supabase/static';
import type { AdBanner } from '@/lib/types';
import { logSupabaseFetchIssue } from '@/lib/data/fetch-error';

const USE_DEV_ONLY = process.env.NEXT_PUBLIC_USE_DEV_ONLY === 'true';

/** Todos os banners ativos (uma única consulta, reutilizada por posição). */
export const getActiveAds = cache(async (): Promise<AdBanner[]> => {
  if (USE_DEV_ONLY) {
    return [];
  }

  try {
    const supabase = createStaticClient();
    const { data, error } = await supabase
      .from('ad_banners')
      .select(
        'id, placement, type, image_url, target_url, script_code, active, expires_at'
      )
      .order('created_at', { ascending: true })
      .returns<AdBanner[]>();

    if (error) throw error;
    return data;
  } catch (err) {
    logSupabaseFetchIssue('data/ads', err);
    return [];
  }
});
