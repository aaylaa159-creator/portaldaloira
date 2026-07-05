import { createClient } from '@/lib/supabase/server';
import type { MediaKitLead } from '@/lib/types/media-kit';

export async function listMediaKitLeads(): Promise<MediaKitLead[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('media_kit_leads')
    .select('id, name, company, email, phone, message, status, created_at')
    .order('created_at', { ascending: false })
    .returns<MediaKitLead[]>();

  if (error) throw error;
  return data ?? [];
}

export async function countNewMediaKitLeads(): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('media_kit_leads')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'new');

    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
