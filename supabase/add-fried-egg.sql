-- Run this in the Supabase SQL Editor when Fried Egg is ready to be published.

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
  'Fried Egg',
  'Fried egg add-on.',
  19,
  'addons',
  '/addon-fried-egg.png',
  'available',
  3,
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
