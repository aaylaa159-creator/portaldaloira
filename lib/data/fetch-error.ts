/** Extrai mensagem legível de erros do Supabase ou de rede (evita `{}` no console). */
export function getFetchErrorMessage(err: unknown): string {
  if (err && typeof err === 'object') {
    const record = err as Record<string, unknown>;
    if (typeof record.message === 'string' && record.message.length > 0) {
      return record.message;
    }
  }

  if (err instanceof Error) {
    const cause = err.cause;
    if (cause instanceof Error) {
      return `${err.message}: ${cause.message}`;
    }
    if (cause && typeof cause === 'object' && 'message' in cause) {
      return `${err.message}: ${String((cause as { message: unknown }).message)}`;
    }
    return err.message;
  }

  return String(err);
}

export function logSupabaseFetchIssue(
  scope: string,
  err: unknown,
  options?: { usingFallback?: boolean }
): void {
  const message = getFetchErrorMessage(err);
  const prefix = `[${scope}] Supabase indisponível (${message})`;

  if (options?.usingFallback) {
    console.warn(`${prefix} — usando dados locais.`);
    return;
  }

  console.warn(prefix);
}
