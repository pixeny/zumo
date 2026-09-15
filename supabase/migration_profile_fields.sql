alter table profiles
  add column if not exists first_name text,
  add column if not exists last_name text,
  add column if not exists birthday date,
  add column if not exists gender text,
  add column if not exists phone text;
