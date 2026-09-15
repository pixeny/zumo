-- Adds: the widget's pre-chat lead form (visitor name/phone) and message
-- feedback (thumbs up/down). Safe to run once on your existing project.

alter table conversations add column if not exists visitor_name text;
alter table conversations add column if not exists visitor_phone text;
alter table messages add column if not exists feedback text check (feedback in ('up', 'down'));

do $$
begin
  if not exists (
    select 1 from pg_policies
    where tablename = 'messages' and policyname = 'messages: visitor update feedback in own conversation'
  ) then
    create policy "messages: visitor update feedback in own conversation" on messages
      for update using (
        exists (
          select 1 from conversations c
          where c.id = messages.conversation_id and c.customer_id = auth.uid()
        )
      );
  end if;
end $$;
