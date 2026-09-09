-- Run after schema.sql (or add-item-variants.sql for an older database).
-- Preserve existing descriptions; do not generate or replace product copy.
begin;
alter table public.menu_items
  add column if not exists description text not null default '';
alter table public.item_variants
  add column if not exists description text;
commit;
