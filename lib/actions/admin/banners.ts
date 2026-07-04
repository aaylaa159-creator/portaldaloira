'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { requireEditorialUser } from '@/lib/auth/editorial';
import type { AdPlacement, AdType } from '@/lib/types';

export interface BannerFormInput {
  placement: AdPlacement;
  type: AdType;
  image_url?: string;
  target_url?: string;
  script_code?: string;
  active: boolean;
  expires_at?: string;
}

export async function createBanner(input: BannerFormInput) {
  await requireEditorialUser();
  const supabase = await createClient();

  const { error } = await supabase.from('ad_banners').insert({
    placement: input.placement,
    type: input.type,
    image_url: input.image_url || null,
    target_url: input.target_url || null,
    script_code: input.script_code || null,
    active: input.active,
    expires_at: input.expires_at || null,
  });

  if (error) return { error: error.message };
  revalidatePath('/admin/banners');
  revalidatePath('/');
  return { ok: true };
}

export async function updateBanner(id: string, input: BannerFormInput) {
  await requireEditorialUser();
  const supabase = await createClient();

  const { error } = await supabase
    .from('ad_banners')
    .update({
      placement: input.placement,
      type: input.type,
      image_url: input.image_url || null,
      target_url: input.target_url || null,
      script_code: input.script_code || null,
      active: input.active,
      expires_at: input.expires_at || null,
    })
    .eq('id', id);

  if (error) return { error: error.message };
  revalidatePath('/admin/banners');
  revalidatePath('/');
  return { ok: true };
}

export async function deleteBanner(id: string) {
  await requireEditorialUser();
  const supabase = await createClient();
  const { error } = await supabase.from('ad_banners').delete().eq('id', id);
  if (error) return { error: error.message };
  revalidatePath('/admin/banners');
  revalidatePath('/');
  return { ok: true };
}
