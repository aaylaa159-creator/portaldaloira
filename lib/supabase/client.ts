import { createBrowserClient } from '@supabase/ssr';

/**
 * Cliente Supabase para Client Components (roda no navegador).
 * `createBrowserClient` usa singleton internamente — pode ser chamado
 * quantas vezes for necessário sem custo adicional.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
  );
}
