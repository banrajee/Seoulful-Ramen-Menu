-- Run this once in Supabase SQL Editor to rename the existing Cheese add-on.
-- It avoids duplicates if Sliced Cheese already exists.

delete from public.menu_items old_item
where old_item.category_id = 'addons'
  and lower(trim(old_item.name)) = 'cheese'
  and exists (
    select 1
    from public.menu_items existing_item
    where existing_item.category_id = 'addons'
      and lower(trim(existing_item.name)) = 'sliced cheese'
  );

update public.menu_items
set
  name = 'Sliced Cheese',
  description = 'Sliced cheese add-on.',
  price = 19,
  sort_order = 5,
  price_type = 'single',
  drink_price_type = 'single',
  has_cup_ice_option = false,
  cup_ice_available = true
where category_id = 'addons'
  and lower(trim(name)) = 'cheese';

insert into public.menu_items (
  name,
  description,
  price,
  category_id,
  image_url,
  status,
  sort_order,
  price_type,
  drink_price_type,
  has_cup_ice_option,
  cup_ice_available
)
values (
  'Sliced Cheese',
  'Sliced cheese add-on.',
  19,
  'addons',
  null,
  'available',
  5,
  'single',
  'single',
  false,
  true
)
on conflict (category_id, lower(trim(name))) do update set
  description = excluded.description,
  price = excluded.price,
  image_url = excluded.image_url,
  status = excluded.status,
  sort_order = excluded.sort_order,
  price_type = excluded.price_type,
  drink_price_type = excluded.drink_price_type,
  has_cup_ice_option = excluded.has_cup_ice_option,
  cup_ice_available = excluded.cup_ice_available;