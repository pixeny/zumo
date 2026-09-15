-- Fixes: signing up never created a `profiles` row when email confirmation
-- is required (the client-side upsert ran before any session existed, so RLS
-- silently rejected it) — which made every agent-only action (widgets,
-- contacts, files, closing conversations, etc.) fail with 403 Forbidden
-- forever, even after confirming the email.
--
-- This adds a database trigger that creates the `profiles` row automatically
-- server-side whenever a new auth user is created, and backfills any
-- existing accounts (like the one that just hit the 403) that are missing
-- one. Run this once in your Supabase SQL editor.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role)
  values (new.id, coalesce(new.raw_user_meta_data->>'name', new.email), 'agent')
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Backfill: give every existing auth user without a profile row agent access.
insert into public.profiles (id, name, role)
select u.id, coalesce(u.raw_user_meta_data->>'name', u.email), 'agent'
from auth.users u
left join public.profiles p on p.id = u.id
where p.id is null;
