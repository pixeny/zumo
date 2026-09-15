-- Incremental migration for an existing Zumo project: adds multi-widget
-- support (create many embeddable widgets, each with its own assistant
-- identity) on top of a database that already has schema.sql applied.
-- Safe to run once against your existing Supabase project's SQL editor.

create table if not exists widgets (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users(id) on delete set null,
  name text not null default 'My Widget',
  assistant_name text not null default 'Nova',
  persona text,
  system_prompt text,
  created_at timestamptz not null default now()
);

alter table conversations add column if not exists widget_id uuid references widgets(id) on delete set null;

alter table widgets enable row level security;

do $$
begin
  if not exists (
    select 1 from pg_policies where tablename = 'widgets' and policyname = 'widgets: public read'
  ) then
    create policy "widgets: public read" on widgets for select using (true);
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'widgets' and policyname = 'widgets: agents insert'
  ) then
    create policy "widgets: agents insert" on widgets for insert with check (is_agent());
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'widgets' and policyname = 'widgets: agents update'
  ) then
    create policy "widgets: agents update" on widgets for update using (is_agent());
  end if;
  if not exists (
    select 1 from pg_policies where tablename = 'widgets' and policyname = 'widgets: agents delete'
  ) then
    create policy "widgets: agents delete" on widgets for delete using (is_agent());
  end if;
end $$;

-- ai_settings is superseded by per-widget assistant_name/persona/system_prompt.
-- Not dropped automatically — drop it yourself once you've moved any settings
-- you want to keep onto a widget: `drop table if exists ai_settings;`
