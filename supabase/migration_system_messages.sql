-- Allow a 'system' sender_type for messages, used for "an agent joined the
-- conversation" notices shown in the visitor's widget when an agent takes
-- over a chat.

alter table messages drop constraint if exists messages_sender_type_check;
alter table messages add constraint messages_sender_type_check
  check (sender_type in ('visitor', 'agent', 'ai', 'system'));

-- Agents may post a 'system' notice into any conversation (used when they
-- take it over), but may only post as 'agent' in a conversation already
-- assigned to them — enforced here, not just in the UI.
drop policy if exists "messages: agents insert all" on messages;
create policy "messages: agents insert all" on messages
  for insert with check (
    is_agent()
    and (
      (sender_type = 'system' and sender_id = auth.uid())
      or (
        sender_type = 'agent'
        and sender_id = auth.uid()
        and exists (
          select 1 from conversations c
          where c.id = messages.conversation_id and c.assigned_agent_id = auth.uid()
        )
      )
    )
  );
