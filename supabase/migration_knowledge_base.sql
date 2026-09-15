-- Per-space knowledge base entries. Fed into the AI's system prompt for that
-- widget's replies (see server/src/routes/chat.js), so operators can teach
-- the assistant facts (pricing, policies, hours) without editing the prompt.
create table if not exists knowledge_base (
  id uuid primary key default gen_random_uuid(),
  widget_id uuid not null references widgets(id) on delete cascade,
  question text not null,
  answer text not null,
  created_at timestamptz not null default now()
);

alter table knowledge_base enable row level security;

create policy "knowledge_base: agents all" on knowledge_base
  for all using (is_agent()) with check (is_agent());
