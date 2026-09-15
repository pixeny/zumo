-- Zumo schema: run this in the Supabase SQL editor for your project.

create extension if not exists "pgcrypto";

-- Agents/admins who can access the dashboard. One row per auth.users id.
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  role text not null default 'agent' check (role in ('admin', 'agent', 'customer')),
  avatar_url text,
  created_at timestamptz not null default now()
);

-- A widget is one embeddable chat assistant configuration. Agents create as
-- many as they need (one per site) from the dashboard's Widgets page; each
-- gets its own embed snippet carrying its id in `data-widget-id`.
create table if not exists widgets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null default 'My Widget',
  description text,
  logo_url text,
  accent_color text not null default '#4b60ff',
  greeting_message text,
  assistant_name text not null default 'Nova',
  persona text,
  system_prompt text,
  created_at timestamptz not null default now()
);

create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  customer_id uuid references auth.users(id) on delete set null,
  widget_id uuid references widgets(id) on delete set null,
  visitor_name text,
  visitor_phone text,
  status text not null default 'open' check (status in ('open', 'pending', 'closed')),
  assigned_agent_id uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  sender_type text not null check (sender_type in ('visitor', 'agent', 'ai')),
  sender_id uuid references auth.users(id) on delete set null,
  body text not null default '',
  attachment_url text,
  feedback text check (feedback in ('up', 'down')),
  created_at timestamptz not null default now()
);

create table if not exists contacts (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  notes text,
  created_at timestamptz not null default now()
);

create table if not exists files (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  size_bytes bigint,
  uploaded_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists demo_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  created_at timestamptz not null default now()
);

-- Helper: is the current user an agent/admin in `profiles`?
create or replace function is_agent()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from profiles
    where id = auth.uid() and role in ('agent', 'admin')
  );
$$;

-- Auto-create a `profiles` row (role 'agent') whenever a new auth user is
-- created — runs server-side (security definer) so it works even when the
-- client has no session yet, e.g. while email confirmation is pending.
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

alter table profiles enable row level security;
alter table widgets enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table contacts enable row level security;
alter table files enable row level security;
alter table demo_requests enable row level security;

-- profiles: a user can read/update their own profile; agents can read all
create policy "profiles: self read" on profiles for select using (auth.uid() = id);
create policy "profiles: agents read all" on profiles for select using (is_agent());
create policy "profiles: self upsert" on profiles for insert with check (auth.uid() = id);
create policy "profiles: self update" on profiles for update using (auth.uid() = id);

-- widgets: assistant identity + persona is public (the embed script running on
-- a third-party site needs to read it while anonymous); only agents can manage
create policy "widgets: public read" on widgets for select using (true);
create policy "widgets: agents insert" on widgets for insert with check (is_agent());
create policy "widgets: agents update" on widgets for update using (is_agent());
create policy "widgets: agents delete" on widgets for delete using (is_agent());

-- conversations: visitors see/create their own; agents see/update all
create policy "conversations: visitor read own" on conversations
  for select using (auth.uid() = customer_id);
create policy "conversations: visitor create own" on conversations
  for insert with check (auth.uid() = customer_id);
create policy "conversations: agents read all" on conversations
  for select using (is_agent());
create policy "conversations: agents update all" on conversations
  for update using (is_agent());

-- messages: visitor can read/insert messages only within their own conversation;
-- agents can read/insert into any conversation
create policy "messages: visitor read own conversation" on messages
  for select using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id and c.customer_id = auth.uid()
    )
  );
create policy "messages: visitor insert own conversation" on messages
  for insert with check (
    sender_type = 'visitor'
    and sender_id = auth.uid()
    and exists (
      select 1 from conversations c
      where c.id = messages.conversation_id and c.customer_id = auth.uid()
    )
  );
create policy "messages: agents read all" on messages
  for select using (is_agent());
create policy "messages: agents insert all" on messages
  for insert with check (is_agent() and sender_type = 'agent' and sender_id = auth.uid());
create policy "messages: visitor update feedback in own conversation" on messages
  for update using (
    exists (
      select 1 from conversations c
      where c.id = messages.conversation_id and c.customer_id = auth.uid()
    )
  );

-- contacts, files: agents only
create policy "contacts: agents all" on contacts for all using (is_agent()) with check (is_agent());
create policy "files: agents all" on files for all using (is_agent()) with check (is_agent());

-- demo_requests: anyone (including anonymous) can submit; only agents can read
create policy "demo_requests: anyone insert" on demo_requests for insert with check (true);
create policy "demo_requests: agents read" on demo_requests for select using (is_agent());

-- Realtime: enable for the tables the UI subscribes to
alter publication supabase_realtime add table messages;
alter publication supabase_realtime add table conversations;
