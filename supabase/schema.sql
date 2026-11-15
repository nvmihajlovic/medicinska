create extension if not exists pgcrypto;

create table if not exists public.school_admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.content_entries (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('news', 'page', 'program', 'gallery', 'document', 'event')),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  title text not null check (length(trim(title)) between 1 and 200),
  excerpt text not null default '',
  body text not null default '',
  media_path text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists content_entries_public_listing
  on public.content_entries (kind, status, published_at desc);

alter table public.content_entries add column if not exists category text;
update public.content_entries set category = 'obavestenja' where kind = 'news' and category is null;
alter table public.content_entries drop constraint if exists content_entries_news_category;
alter table public.content_entries add constraint content_entries_news_category
  check ((kind <> 'news' and category is null) or (kind = 'news' and category is not null and category in (
    'obavestenja', 'nastava-i-ispiti', 'takmicenja-i-uspesi',
    'projekti-i-saradnja', 'humanitarne-akcije', 'skolski-zivot'
  )));

create table if not exists public.news_engagement (
  news_key text primary key check (news_key ~ '^(archive-[0-9]+|entry-[0-9a-f-]{36})$'),
  views bigint not null default 0 check (views >= 0),
  likes bigint not null default 0 check (likes >= 0)
);

create table if not exists public.news_visits (
  news_key text not null references public.news_engagement (news_key) on delete cascade,
  visitor_id uuid not null,
  viewed_at timestamptz not null default now(),
  primary key (news_key, visitor_id)
);

create table if not exists public.news_likes (
  news_key text not null references public.news_engagement (news_key) on delete cascade,
  visitor_id uuid not null,
  primary key (news_key, visitor_id)
);

alter table public.news_engagement enable row level security;
alter table public.news_visits enable row level security;
alter table public.news_likes enable row level security;
revoke all on public.news_engagement, public.news_visits, public.news_likes from public, anon, authenticated;
grant select, insert, update, delete on public.news_engagement, public.news_visits, public.news_likes to service_role;

create or replace function public.record_news_view(p_news_key text, p_visitor_id uuid)
returns void
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  insert into public.news_engagement (news_key) values (p_news_key) on conflict do nothing;
  perform 1 from public.news_engagement where news_key = p_news_key for update;
  insert into public.news_visits (news_key, visitor_id, viewed_at)
    values (p_news_key, p_visitor_id, now())
    on conflict (news_key, visitor_id) do update set viewed_at = excluded.viewed_at
    where public.news_visits.viewed_at <= now() - interval '30 minutes';
  if found then
    update public.news_engagement set views = views + 1 where news_key = p_news_key;
  end if;
end;
$$;

create or replace function public.toggle_news_like(p_news_key text, p_visitor_id uuid)
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  liked boolean;
begin
  insert into public.news_engagement (news_key) values (p_news_key) on conflict do nothing;
  perform 1 from public.news_engagement where news_key = p_news_key for update;
  delete from public.news_likes where news_key = p_news_key and visitor_id = p_visitor_id;
  if found then
    update public.news_engagement set likes = likes - 1 where news_key = p_news_key;
    liked := false;
  else
    insert into public.news_likes (news_key, visitor_id) values (p_news_key, p_visitor_id);
    update public.news_engagement set likes = likes + 1 where news_key = p_news_key;
    liked := true;
  end if;
  return liked;
end;
$$;

revoke all on function public.record_news_view(text, uuid) from public, anon, authenticated;
revoke all on function public.toggle_news_like(text, uuid) from public, anon, authenticated;
grant execute on function public.record_news_view(text, uuid) to service_role;
grant execute on function public.toggle_news_like(text, uuid) to service_role;

create table if not exists public.contact_message_limit (
  id boolean primary key default true check (id),
  window_start timestamptz not null,
  attempts integer not null check (attempts >= 0)
);

alter table public.contact_message_limit enable row level security;
revoke all on public.contact_message_limit from public, anon, authenticated;

create or replace function public.reserve_contact_message()
returns boolean
language plpgsql
security definer
set search_path = public, pg_temp
as $$
declare
  current_attempts integer;
begin
  insert into public.contact_message_limit (id, window_start, attempts)
    values (true, now(), 0) on conflict (id) do nothing;
  select attempts into current_attempts from public.contact_message_limit where id = true for update;
  update public.contact_message_limit
    set window_start = case when window_start <= now() - interval '1 hour' then now() else window_start end,
        attempts = case when window_start <= now() - interval '1 hour' then 1 else attempts + 1 end
    where id = true and (window_start <= now() - interval '1 hour' or current_attempts < 20);
  return found;
end;
$$;

revoke all on function public.reserve_contact_message() from public, anon, authenticated;
grant execute on function public.reserve_contact_message() to service_role;

create or replace function public.delete_news_engagement()
returns trigger
language plpgsql
security definer
set search_path = public, pg_temp
as $$
begin
  delete from public.news_engagement where news_key = 'entry-' || old.id::text;
  return old;
end;
$$;

revoke all on function public.delete_news_engagement() from public, anon, authenticated;

drop trigger if exists delete_news_engagement on public.content_entries;
create trigger delete_news_engagement after delete on public.content_entries
  for each row execute function public.delete_news_engagement();

create or replace function public.is_school_admin()
returns boolean
language sql
stable
security definer
set search_path = public, pg_temp
as $$
  select exists (
    select 1
    from public.school_admins
    where user_id = (select auth.uid())
  );
$$;

revoke all on function public.is_school_admin() from public;
grant execute on function public.is_school_admin() to anon, authenticated;

alter table public.school_admins enable row level security;
alter table public.content_entries enable row level security;

drop policy if exists "Admins can view their own role" on public.school_admins;
create policy "Admins can view their own role"
  on public.school_admins for select
  to authenticated
  using (user_id = (select auth.uid()));

drop policy if exists "Published content is public" on public.content_entries;
create policy "Published content is public"
  on public.content_entries for select
  to anon, authenticated
  using (status = 'published' or public.is_school_admin());

drop policy if exists "Admins can create content" on public.content_entries;
create policy "Admins can create content"
  on public.content_entries for insert
  to authenticated
  with check (public.is_school_admin());

drop policy if exists "Admins can update content" on public.content_entries;
create policy "Admins can update content"
  on public.content_entries for update
  to authenticated
  using (public.is_school_admin())
  with check (public.is_school_admin());

drop policy if exists "Admins can delete content" on public.content_entries;
create policy "Admins can delete content"
  on public.content_entries for delete
  to authenticated
  using (public.is_school_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('school-media', 'school-media', true, 10485760, array['image/jpeg', 'image/png', 'image/webp', 'application/pdf'])
on conflict (id) do update set
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "School media is publicly readable" on storage.objects;
create policy "School media is publicly readable"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'school-media');

drop policy if exists "School admins can upload media" on storage.objects;
create policy "School admins can upload media"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'school-media' and public.is_school_admin());

drop policy if exists "School admins can update media" on storage.objects;
create policy "School admins can update media"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'school-media' and public.is_school_admin())
  with check (bucket_id = 'school-media' and public.is_school_admin());

drop policy if exists "School admins can delete media" on storage.objects;
create policy "School admins can delete media"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'school-media' and public.is_school_admin());
