-- Run this once in Supabase SQL Editor if the menu shows repeated sample items.
-- It keeps the oldest copy of each item name inside each category and removes the extras.

with ranked_menu_items as (
  select
    id,
    row_number() over (
      partition by category_id, lower(trim(name))
      order by created_at asc, updated_at desc, id asc
    ) as duplicate_rank
  from public.menu_items
)
delete from public.menu_items
using ranked_menu_items
where public.menu_items.id = ranked_menu_items.id
  and ranked_menu_items.duplicate_rank > 1;

-- This prevents the same item name from being inserted again in the same category
-- if the schema/sample SQL is accidentally run more than once.
create unique index if not exists menu_items_category_name_unique
on public.menu_items (category_id, lower(trim(name)));
