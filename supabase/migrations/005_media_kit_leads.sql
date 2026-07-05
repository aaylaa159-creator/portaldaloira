-- ============================================================================
-- PORTAL DA LOIRA - Solicitações de mídia kit (formulário comercial)
-- Execute no SQL Editor do Supabase após 002_editorial_auth.sql
-- ============================================================================

create table if not exists public.media_kit_leads (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  company text not null check (char_length(company) between 2 and 160),
  email text not null check (char_length(email) between 5 and 254),
  phone text check (phone is null or char_length(phone) <= 30),
  message text check (message is null or char_length(message) <= 2000),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists idx_media_kit_leads_created_at
  on public.media_kit_leads (created_at desc);

create index if not exists idx_media_kit_leads_status
  on public.media_kit_leads (status, created_at desc);

alter table public.media_kit_leads enable row level security;

-- Visitantes enviam solicitações (somente insert)
drop policy if exists "media_kit_leads_public_insert" on public.media_kit_leads;
create policy "media_kit_leads_public_insert" on public.media_kit_leads
  for insert to anon, authenticated
  with check (true);

-- Equipe editorial gerencia no painel
drop policy if exists "media_kit_leads_team_select" on public.media_kit_leads;
create policy "media_kit_leads_team_select" on public.media_kit_leads
  for select to authenticated
  using (public.is_editorial_staff());

drop policy if exists "media_kit_leads_team_update" on public.media_kit_leads;
create policy "media_kit_leads_team_update" on public.media_kit_leads
  for update to authenticated
  using (public.is_editorial_staff())
  with check (public.is_editorial_staff());

drop policy if exists "media_kit_leads_team_delete" on public.media_kit_leads;
create policy "media_kit_leads_team_delete" on public.media_kit_leads
  for delete to authenticated
  using (public.is_editorial_staff());
