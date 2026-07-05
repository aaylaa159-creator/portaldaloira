import { createClient } from '@/lib/supabase/server';
import type { ContactMessage, ContactMessageChannel } from '@/lib/types/contact-message';

const SELECT_FIELDS =
  'id, channel, name, email, phone, subject, message, status, created_at';

export async function listContactMessages(
  channel: ContactMessageChannel
): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('contact_messages')
    .select(SELECT_FIELDS)
    .eq('channel', channel)
    .order('created_at', { ascending: false })
    .returns<ContactMessage[]>();

  if (error) throw error;
  return data ?? [];
}

export async function countNewContactMessages(
  channel: ContactMessageChannel
): Promise<number> {
  try {
    const supabase = await createClient();
    const { count, error } = await supabase
      .from('contact_messages')
      .select('id', { count: 'exact', head: true })
      .eq('channel', channel)
      .eq('status', 'new');

    if (error) return 0;
    return count ?? 0;
  } catch {
    return 0;
  }
}
