import type { PostStatus } from '@/lib/types';

/** Indica se a matéria é visível para visitantes (regra espelha o RLS do Supabase). */
export function isPostPubliclyVisible(
  status: PostStatus,
  publishedAt: string
): boolean {
  if (status !== 'published') return false;
  const date = new Date(publishedAt);
  return !Number.isNaN(date.getTime()) && date.getTime() <= Date.now();
}

/**
 * Normaliza status e data antes de salvar.
 * - Publicado com data futura → usa agora (evita matéria “invisível”).
 * - Agendado com data passada → vira publicado.
 */
export function normalizePostPublication(
  status: PostStatus,
  publishedAt: string
): { status: PostStatus; published_at: string } {
  const parsed = new Date(publishedAt);
  const safeIso = Number.isNaN(parsed.getTime())
    ? new Date().toISOString()
    : parsed.toISOString();
  const now = Date.now();
  const pubMs = new Date(safeIso).getTime();

  if (status === 'published' && pubMs > now) {
    return { status, published_at: new Date(now).toISOString() };
  }

  if (status === 'scheduled' && pubMs <= now) {
    return { status: 'published', published_at: safeIso };
  }

  return { status, published_at: safeIso };
}
