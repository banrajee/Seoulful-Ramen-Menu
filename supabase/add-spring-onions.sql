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
  'Spring Onions',
  'Fresh spring onion garnish.',
  5,
  'addons',
  null,
  'available',
  7,
  'single',
  'single',
  false,
  true
)
on conflict (category_id, lower(trim(name))) do update set
  description = excluded.description,
  price = excluded.price,
  status = excluded.status,
  sort_order = excluded.sort_order,
  price_type = excluded.price_type,
  drink_price_type = excluded.drink_price_type,
  has_cup_ice_option = excluded.has_cup_ice_option,
  cup_ice_available = excluded.cup_ice_available;
