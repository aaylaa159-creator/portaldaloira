'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireEditorialUser } from '@/lib/auth/editorial';
import { createClient } from '@/lib/supabase/server';
import type { MediaKitLeadStatus } from '@/lib/types/media-kit';

const statusSchema = z.enum(['new', 'contacted', 'archived']);

export async function updateMediaKitLeadStatus(
  id: string,
  status: MediaKitLeadStatus
): Promise<{ ok: true } | { error: string }> {
  await requireEditorialUser();

  const parsedStatus = statusSchema.safeParse(status);
  if (!parsedStatus.success) {
    return { error: 'Status inválido.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('media_kit_leads')
    .update({ status: parsedStatus.data })
    .eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/comercial');
  revalidatePath('/admin');
  return { ok: true };
}

export async function deleteMediaKitLead(
  id: string
): Promise<{ ok: true } | { error: string }> {
  await requireEditorialUser();

  const supabase = await createClient();
  const { error } = await supabase.from('media_kit_leads').delete().eq('id', id);

  if (error) return { error: error.message };

  revalidatePath('/admin/comercial');
  revalidatePath('/admin');
  return { ok: true };
}
