import { createClient as createSupabaseClient } from '@supabase/supabase-js';

const FETCH_TIMEOUT_MS =
  process.env.NODE_ENV === 'development' ? 30000 : 8000;

function isRetryableFetchError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const message = err.message.toLowerCase();
  return (
    message.includes('fetch failed') ||
    message.includes('timeout') ||
    message.includes('aborted')
  );
}

/**
 * Fetch com timeout ampliado em dev e uma nova tentativa em falhas de rede.
 */
async function fetchWithTimeout(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  const run = () =>
    fetch(input, {
      ...init,
      signal: init?.signal ?? AbortSignal.timeout(FETCH_TIMEOUT_MS),
    });

  try {
    return await run();
  } catch (err) {
    if (init?.signal || !isRetryableFetchError(err)) {
      throw err;
    }
    return run();
  }
}

/**
 * Cliente Supabase anônimo, sem vínculo com cookies/sessão.
 * Uso exclusivo para leitura de conteúdo público em páginas estáticas (ISR).
 */
export function createStaticClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
      global: {
        fetch: fetchWithTimeout,
      },
    }
  );
}
