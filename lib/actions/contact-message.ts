'use server';

import { z } from 'zod';
import { createStaticClient } from '@/lib/supabase/static';
import type { ContactMessageChannel } from '@/lib/types/contact-message';

const channelSchema = z.enum(['redacao', 'comercial']);

const contactMessageSchema = z.object({
  channel: channelSchema,
  name: z.string().trim().min(2, 'Informe seu nome.').max(120),
  email: z.string().trim().email('E-mail inválido.').max(254),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .transform((v) => v || undefined),
  subject: z.string().trim().min(2, 'Informe o assunto.').max(200),
  message: z.string().trim().min(10, 'A mensagem deve ter pelo menos 10 caracteres.').max(2000),
  /** Honeypot anti-spam — deve permanecer vazio. */
  website: z.string().optional().default(''),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

const FALLBACK_EMAIL: Record<ContactMessageChannel, string> = {
  redacao: 'redacao@portaldaloira.com.br',
  comercial: 'comercial@portaldaloira.com.br',
};

export async function submitContactMessage(
  input: ContactMessageInput
): Promise<{ ok: true } | { error: string }> {
  const parsed = contactMessageSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return { error: first ?? 'Verifique os campos e tente novamente.' };
  }

  if (parsed.data.website.trim()) {
    return { ok: true };
  }

  const supabase = createStaticClient();
  const { error } = await supabase.from('contact_messages').insert({
    channel: parsed.data.channel,
    name: parsed.data.name,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    subject: parsed.data.subject,
    message: parsed.data.message,
  });

  if (error) {
    console.error('[contact-message] submit:', error.message);
    return {
      error: `Não foi possível enviar agora. Tente novamente ou escreva para ${FALLBACK_EMAIL[parsed.data.channel]}.`,
    };
  }

  return { ok: true };
}
