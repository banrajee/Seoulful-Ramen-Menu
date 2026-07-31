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
values
  ('Raw Egg', 'Fresh egg add-on.', 15, 'addons', null, 'available', 1, 'single', 'single', false, true),
  ('Boiled Egg', 'Boiled egg add-on.', 19, 'addons', null, 'available', 2, 'single', 'single', false, true),
  ('Corn', 'Sweet corn add-on.', 19, 'addons', null, 'available', 3, 'single', 'single', false, true),
  ('Corn Dog', 'Crispy corn dog add-on.', 49, 'addons', null, 'available', 4, 'single', 'single', false, true),
  ('Sliced Cheese', 'Sliced cheese add-on.', 19, 'addons', null, 'available', 5, 'single', 'single', false, true),
  ('Shredded Chicken', 'Shredded chicken add-on.', 29, 'addons', null, 'available', 6, 'single', 'single', false, true),
  ('Spring Onions', 'Fresh spring onion garnish.', 5, 'addons', null, 'available', 7, 'single', 'single', false, true),
  ('Sausage', 'Sausage add-on.', 29, 'addons', null, 'available', 8, 'single', 'single', false, true)
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
