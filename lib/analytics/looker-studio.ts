const ALLOWED_HOSTS = new Set(['lookerstudio.google.com', 'datastudio.google.com']);

/** Valida e normaliza a URL de incorporação do Looker Studio. */
export function getLookerStudioEmbedUrl(): string | null {
  const raw = process.env.LOOKER_STUDIO_EMBED_URL?.trim();
  if (!raw) return null;

  try {
    const url = new URL(raw);
    if (!ALLOWED_HOSTS.has(url.hostname)) return null;
    if (!url.pathname.startsWith('/embed/')) return null;
    url.hostname = 'lookerstudio.google.com';
    return url.toString();
  } catch {
    return null;
  }
}

export function isLookerStudioConfigured(): boolean {
  return getLookerStudioEmbedUrl() !== null;
}
