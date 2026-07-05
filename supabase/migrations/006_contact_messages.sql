-- ============================================================================
-- PORTAL DA LOIRA - Mensagens de contato (redação e comercial)
-- Execute no SQL Editor do Supabase após 005_media_kit_leads.sql
-- ============================================================================

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('redacao', 'comercial')),
  name text not null check (char_length(name) between 2 and 120),
  email text not null check (char_length(email) between 5 and 254),
  phone text check (phone is null or char_length(phone) <= 30),
  subject text not null check (char_length(subject) between 2 and 200),
  message text not null check (char_length(message) between 10 and 2000),
  status text not null default 'new'
    check (status in ('new', 'contacted', 'archived')),
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_messages_created_at
  on public.contact_messages (created_at desc);

create index if not exists idx_contact_messages_channel_status
  on public.contact_messages (channel, status, created_at desc);

alter table public.contact_messages enable row level security;

drop policy if exists "contact_messages_public_insert" on public.contact_messages;
create policy "contact_messages_public_insert" on public.contact_messages
  for insert to anon, authenticated
  with check (channel in ('redacao', 'comercial'));

drop policy if exists "contact_messages_team_select" on public.contact_messages;
create policy "contact_messages_team_select" on public.contact_messages
  for select to authenticated
  using (public.is_editorial_staff());

drop policy if exists "contact_messages_team_update" on public.contact_messages;
create policy "contact_messages_team_update" on public.contact_messages
  for update to authenticated
  using (public.is_editorial_staff())
  with check (public.is_editorial_staff());

drop policy if exists "contact_messages_team_delete" on public.contact_messages;
create policy "contact_messages_team_delete" on public.contact_messages
  for delete to authenticated
  using (public.is_editorial_staff());
