-- Adds per-space branding/customization columns to `widgets` (presented as
-- "Spaces" in the dashboard): logo, accent color, greeting message, and a
-- description shown on the space card. Safe to run once on your existing
-- Supabase project.

alter table widgets add column if not exists description text;
alter table widgets add column if not exists logo_url text;
alter table widgets add column if not exists accent_color text not null default '#4b60ff';
alter table widgets add column if not exists greeting_message text;
