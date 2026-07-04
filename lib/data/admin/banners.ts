import { createClient } from '@/lib/supabase/server';
import type { AdBanner } from '@/lib/types';

export async function listAllBanners() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('ad_banners')
    .select('*')
    .order('placement', { ascending: true })
    .returns<AdBanner[]>();

  if (error) throw error;
  return data ?? [];
}
