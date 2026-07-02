import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Atualiza a sessão do Supabase a cada requisição (renova tokens expirados)
 * e propaga os cookies atualizados para os Server Components e o navegador.
 * Chamado pelo proxy.ts na raiz do projeto.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          // Headers anti-cache: impedem que CDNs sirvam a sessão de um
          // usuário para outro quando os cookies de auth são gravados.
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  // Não execute lógica entre createServerClient e getClaims:
  // isso pode causar bugs difíceis de depurar com logout aleatório.
  await supabase.auth.getClaims();

  return supabaseResponse;
}
