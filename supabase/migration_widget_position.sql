alter table widgets
  add column if not exists widget_position text not null default 'right'
    check (widget_position in ('left', 'right'));
