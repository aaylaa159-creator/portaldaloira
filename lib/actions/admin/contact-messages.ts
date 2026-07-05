'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { requireEditorialUser } from '@/lib/auth/editorial';
import { createClient } from '@/lib/supabase/server';
import type {
  ContactMessageChannel,
  ContactMessageStatus,
} from '@/lib/types/contact-message';

const statusSchema = z.enum(['new', 'contacted', 'archived']);

const REVALIDATE_PATHS: Record<ContactMessageChannel, string[]> = {
  redacao: ['/admin/redacao', '/admin'],
  comercial: ['/admin/comercial', '/admin'],
};

export async function updateContactMessageStatus(
  id: string,
  channel: ContactMessageChannel,
  status: ContactMessageStatus
): Promise<{ ok: true } | { error: string }> {
  await requireEditorialUser();

  const parsedStatus = statusSchema.safeParse(status);
  if (!parsedStatus.success) {
    return { error: 'Status inválido.' };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from('contact_messages')
    .update({ status: parsedStatus.data })
    .eq('id', id)
    .eq('channel', channel);

  if (error) return { error: error.message };

  for (const path of REVALIDATE_PATHS[channel]) {
    revalidatePath(path);
  }
  return { ok: true };
}

export async function deleteContactMessage(
  id: string,
  channel: ContactMessageChannel
): Promise<{ ok: true } | { error: string }> {
  await requireEditorialUser();

  const supabase = await createClient();
  const { error } = await supabase
    .from('contact_messages')
    .delete()
    .eq('id', id)
    .eq('channel', channel);

  if (error) return { error: error.message };

  for (const path of REVALIDATE_PATHS[channel]) {
    revalidatePath(path);
  }
  return { ok: true };
}
