-- ============================================================================
-- PORTAL DA LOIRA - Oculta email e user_id dos autores para visitantes (anon)
-- Execute no SQL Editor do Supabase após schema.sql e 002_editorial_auth.sql
-- ============================================================================

-- Visitantes anônimos só leem colunas públicas; email/user_id ficam para a equipe logada.
REVOKE SELECT ON TABLE public.authors FROM anon;

GRANT SELECT (
  id,
  name,
  slug,
  avatar_url,
  bio,
  role,
  instagram,
  twitter
) ON TABLE public.authors TO anon;
