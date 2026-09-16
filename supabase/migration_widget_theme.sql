alter table widgets
  add column if not exists widget_theme text not null default 'dark'
    check (widget_theme in ('dark', 'light'));
