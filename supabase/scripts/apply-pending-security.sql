-- ============================================================================
-- PORTAL DA LOIRA - Aplicar segurança pendente (002 + 004)
-- Cole no SQL Editor do Supabase e clique Run.
-- Idempotente: pode rodar mais de uma vez.
-- ============================================================================

-- --- 002_editorial_auth.sql ---

create or replace function public.is_editorial_staff()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(
    (auth.jwt() -> 'app_metadata' ->> 'role') in ('admin', 'editor'),
    false
  );
$$;

drop policy if exists "categories_team_write" on public.categories;
create policy "categories_team_write" on public.categories
  for all to authenticated
  using (public.is_editorial_staff())
  with check (public.is_editorial_staff());

drop policy if exists "authors_team_write" on public.authors;
create policy "authors_team_write" on public.authors
  for all to authenticated
  using (public.is_editorial_staff())
  with check (public.is_editorial_staff());

drop policy if exists "posts_team_read_all" on public.posts;
drop policy if exists "posts_team_insert" on public.posts;
drop policy if exists "posts_team_update" on public.posts;
drop policy if exists "posts_team_delete" on public.posts;

create policy "posts_team_read_all" on public.posts
  for select to authenticated
  using (public.is_editorial_staff());

create policy "posts_team_insert" on public.posts
  for insert to authenticated
  with check (public.is_editorial_staff());

create policy "posts_team_update" on public.posts
  for update to authenticated
  using (public.is_editorial_staff())
  with check (public.is_editorial_staff());

create policy "posts_team_delete" on public.posts
  for delete to authenticated
  using (public.is_editorial_staff());

drop policy if exists "ads_team_all" on public.ad_banners;
create policy "ads_team_all" on public.ad_banners
  for all to authenticated
  using (public.is_editorial_staff())
  with check (public.is_editorial_staff());

drop policy if exists "news_media_team_insert" on storage.objects;
drop policy if exists "news_media_team_update" on storage.objects;
drop policy if exists "news_media_team_delete" on storage.objects;

create policy "news_media_team_insert" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'news-media' and public.is_editorial_staff());

create policy "news_media_team_update" on storage.objects
  for update to authenticated
  using (bucket_id = 'news-media' and public.is_editorial_staff())
  with check (bucket_id = 'news-media' and public.is_editorial_staff());

create policy "news_media_team_delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'news-media' and public.is_editorial_staff());

-- --- 004_authors_public_columns.sql ---

revoke select on table public.authors from anon;

grant select (
  id,
  name,
  slug,
  avatar_url,
  bio,
  role,
  instagram,
  twitter
) on table public.authors to anon;
