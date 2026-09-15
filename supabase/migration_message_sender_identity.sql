-- Denormalize the agent's display name/avatar onto the message row at send
-- time, so the visitor's widget can show "who's replying" without needing to
-- read the (agent-only) profiles table, which visitor RLS policies block.
alter table messages
  add column if not exists sender_name text,
  add column if not exists sender_avatar_url text;
