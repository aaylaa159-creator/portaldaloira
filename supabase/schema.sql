-- ============================================================================
-- PORTAL DA LOIRA - SCHEMA DO BANCO DE DADOS (Supabase / PostgreSQL)
-- Cole este arquivo no SQL Editor do painel do Supabase e execute.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1. TABELAS
-- ---------------------------------------------------------------------------

create table if not exists public.authors (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  avatar_url text,
  bio text,
  role text not null default 'journalist'
    check (role in ('journalist', 'columnist', 'editor')),
  instagram text,
  twitter text,
  email text,
  -- vinculo opcional com o login do jornalista (painel admin)
  user_id uuid references auth.users (id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  color_code text,
  display_order integer not null default 0
);

create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  slug text not null unique,
  content text not null,
  cover_image text not null,
  cover_caption text,
  author_id uuid not null references public.authors (id),
  category_id uuid not null references public.categories (id),
  tags text[] not null default '{}',
  status text not null default 'draft'
    check (status in ('draft', 'published', 'scheduled')),
  published_at timestamptz not null default now(),
  views_count integer not null default 0,
  allow_comments boolean not null default true,
  featured_position text not null default 'none'
    check (featured_position in ('main', 'secondary', 'carousel', 'none')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ad_banners (
  id uuid primary key default gen_random_uuid(),
  placement text not null
    check (placement in ('header_top', 'sidebar_right', 'in_content_1', 'in_content_2', 'popup_overlay')),
  type text not null default 'image'
    check (type in ('image', 'script')),
  image_url text,
  target_url text,
  script_code text,
  active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- 2. INDICES (performance de listagens e joins)
-- ---------------------------------------------------------------------------

create index if not exists idx_posts_status_published_at
  on public.posts (status, published_at desc);

create index if not exists idx_posts_category_published
  on public.posts (category_id, published_at desc)
  where status = 'published';

create index if not exists idx_posts_featured
  on public.posts (featured_position)
  where status = 'published' and featured_position <> 'none';

create index if not exists idx_posts_views
  on public.posts (views_count desc)
  where status = 'published';

create index if not exists idx_posts_author on public.posts (author_id);
create index if not exists idx_authors_user on public.authors (user_id);
create index if not exists idx_ad_banners_placement
  on public.ad_banners (placement) where active = true;

-- ---------------------------------------------------------------------------
-- 3. TRIGGER updated_at automatico
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_posts_updated_at on public.posts;
create trigger trg_posts_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. FUNCAO RPC: contador de visualizacoes
-- (security definer com search_path fixo; incrementa apenas 1 coluna)
-- ---------------------------------------------------------------------------

create or replace function public.increment_post_views(post_slug text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.posts
  set views_count = views_count + 1
  where slug = post_slug and status = 'published';
$$;

revoke all on function public.increment_post_views(text) from public;
grant execute on function public.increment_post_views(text) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- 5. ROW LEVEL SECURITY
-- Leitura publica apenas do conteudo publicado; escrita somente para
-- usuarios autenticados (equipe da redacao).
-- ---------------------------------------------------------------------------

alter table public.authors enable row level security;
alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.ad_banners enable row level security;

-- Categorias: leitura livre, escrita da redacao
create policy "categories_public_read" on public.categories
  for select using (true);

create policy "categories_team_write" on public.categories
  for all to authenticated using (true) with check (true);

-- Autores: leitura livre, escrita da redacao
create policy "authors_public_read" on public.authors
  for select using (true);

create policy "authors_team_write" on public.authors
  for all to authenticated using (true) with check (true);

-- Posts: anonimos leem apenas publicados; redacao le e escreve tudo
create policy "posts_public_read_published" on public.posts
  for select using (status = 'published' and published_at <= now());

create policy "posts_team_read_all" on public.posts
  for select to authenticated using (true);

create policy "posts_team_insert" on public.posts
  for insert to authenticated with check (true);

create policy "posts_team_update" on public.posts
  for update to authenticated using (true) with check (true);

create policy "posts_team_delete" on public.posts
  for delete to authenticated using (true);

-- Banners: anonimos leem apenas ativos e nao expirados; redacao gerencia
create policy "ads_public_read_active" on public.ad_banners
  for select using (active = true and (expires_at is null or expires_at > now()));

create policy "ads_team_all" on public.ad_banners
  for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- 6. STORAGE: bucket publico para imagens das materias
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public)
values ('news-media', 'news-media', true)
on conflict (id) do nothing;

create policy "news_media_public_read" on storage.objects
  for select using (bucket_id = 'news-media');

create policy "news_media_team_insert" on storage.objects
  for insert to authenticated with check (bucket_id = 'news-media');

create policy "news_media_team_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'news-media') with check (bucket_id = 'news-media');

create policy "news_media_team_delete" on storage.objects
  for delete to authenticated using (bucket_id = 'news-media');
