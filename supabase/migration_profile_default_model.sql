alter table profiles
  add column if not exists default_ai_model text not null default 'claude-sonnet-5'
    check (default_ai_model in ('claude-opus-5', 'claude-sonnet-5', 'claude-haiku-4-5-20251001'));
