-- Canned responses: reusable reply templates operators can insert into the
-- inbox composer with one click.
create table if not exists canned_responses (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table canned_responses enable row level security;

create policy "canned_responses: agents all" on canned_responses
  for all using (is_agent()) with check (is_agent());

-- Internal notes: agent-only notes attached to a conversation, never exposed
-- to the visitor (separate table from `messages`, which the visitor can read).
create table if not exists conversation_notes (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references conversations(id) on delete cascade,
  author_id uuid references auth.users(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table conversation_notes enable row level security;

create policy "conversation_notes: agents all" on conversation_notes
  for all using (is_agent()) with check (is_agent());
