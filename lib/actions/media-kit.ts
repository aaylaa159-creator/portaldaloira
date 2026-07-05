'use server';

import { z } from 'zod';
import { createStaticClient } from '@/lib/supabase/static';

const mediaKitLeadSchema = z.object({
  name: z.string().trim().min(2, 'Informe seu nome.').max(120),
  company: z.string().trim().min(2, 'Informe a empresa.').max(160),
  email: z.string().trim().email('E-mail inválido.').max(254),
  phone: z
    .string()
    .trim()
    .max(30)
    .optional()
    .transform((v) => v || undefined),
  message: z
    .string()
    .trim()
    .max(2000)
    .optional()
    .transform((v) => v || undefined),
  /** Honeypot anti-spam — deve permanecer vazio. */
  website: z.string().optional().default(''),
});

export type MediaKitLeadInput = z.infer<typeof mediaKitLeadSchema>;

export async function submitMediaKitLead(
  input: MediaKitLeadInput
): Promise<{ ok: true } | { error: string }> {
  const parsed = mediaKitLeadSchema.safeParse(input);
  if (!parsed.success) {
    const first = parsed.error.issues[0]?.message;
    return { error: first ?? 'Verifique os campos e tente novamente.' };
  }

  if (parsed.data.website.trim()) {
    return { ok: true };
  }

  const supabase = createStaticClient();
  const { error } = await supabase.from('media_kit_leads').insert({
    name: parsed.data.name,
    company: parsed.data.company,
    email: parsed.data.email,
    phone: parsed.data.phone ?? null,
    message: parsed.data.message ?? null,
  });

  if (error) {
    console.error('[media-kit] submit:', error.message);
    return {
      error:
        'Não foi possível enviar agora. Tente novamente ou escreva para comercial@portaldaloira.com.br.',
    };
  }

  return { ok: true };
}
