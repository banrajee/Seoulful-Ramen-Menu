-- Run this in Supabase SQL Editor after deploying the latest public/ramen-products files.
-- It matches the new ramen photos to existing Ramen rows where possible, and inserts
-- a Ramen row only when no matching menu item exists yet.

with product_rows(
  target_name,
  description,
  image_url,
  price,
  packet_only_price,
  self_cook_price,
  spice_level,
  food_type,
  sort_order,
  aliases
) as (
  values
    ('Paldo Rabokki', 'Ramen and rice cake flavour.', '/ramen-products/paldo-rabokki-halal.png', 249, 209, 249, 2, 'veg', 505, array['paldo rabokki', 'paldo rabokki halal', 'paldo rabokki (halal)', 'rabokki noodle', 'rabokki noodle halal']::text[]),
    ('Paldo Samgyetang', 'Chicken soup-style ramen.', '/ramen-products/paldo-samgyetang.png', 219, 179, 219, 0, 'non_veg', 211, array['paldo samgyetang', 'paldo samgyetang noodles', 'samgyetang noodles']::text[]),
    ('KeeKoo Spicy Cheese', 'Spicy cheese Korean ramen.', '/ramen-products/keekoo-spicy-cheese.png', 219, 179, 219, 3, 'veg', 537, array['keekoo spicy cheese', 'keekoo spicy cheese ramen', 'keekoo korean ramen spicy cheese', 'keekoo cheese']::text[]),
    ('Paldo Lobster', 'Lobster-style seafood ramen.', '/ramen-products/paldo-lobster.png', 249, 209, 249, 1, 'non_veg', 508, array['paldo lobster', 'paldo lobster ramen', 'lobster flavor noodle soup', 'lobster flavour noodle soup']::text[]),
    ('Samyang Hot Chicken Stew', 'Stew-style spicy ramen.', '/ramen-products/samyang-hot-chicken-stew.png', 219, 179, 219, 3, 'non_veg', 208, array['samyang hot chicken stew', 'samyang hot chicken stew halal', 'samyang hot chicken stew (halal)', 'samyang stew', 'samyang stew type']::text[]),
    ('Ottogi Spicy Stir Fry', 'Spicy dry-style ramen.', '/ramen-products/ottogi-spicy-stir-fry.png', 249, 209, 249, 1, 'veg', 504, array['ottogi spicy stir fry', 'otogi spicy stir fry', 'ottogi stir-fry cheese ramen', 'ottogi spicy stir-fry', 'otogi spicy stir-fry']::text[]),
    ('Ottogi Cheese Ramen', 'Cheesy Korean ramen.', '/ramen-products/ottogi-cheese-ramen.png', 249, 209, 249, 0, 'veg', 503, array['ottogi cheese ramen', 'otogi cheese ramen', 'ottogi cheesy ramen', 'otogi cheesy ramen']::text[]),
    ('Samyang Rose', 'Rose-style creamy ramen.', '/ramen-products/samyang-rose.png', 219, 179, 219, 1, 'non_veg', 203, array['samyang rose', 'samyang rose halal', 'samyang rose (halal)', 'samyang buldak rose', 'samyang buldak rose halal']::text[]),
    ('Nongshim Shin Cheese Stir Fry', 'Cheese stir-fry noodles.', '/ramen-products/nongshim-shin-cheese-stir-fry.png', 249, 209, 249, 1, 'veg', 502, array['nongshim shin cheese stir fry', 'nongshim shin cheese stir-fry', 'shin cheese stir fry', 'shin cheese stir-fry']::text[]),
    ('Broad Noodles Spicy Hot', 'Broad noodles with spicy hot flavour.', '/ramen-products/broad-noodles-spicy-hot-halal.png', 249, 209, 249, 4, 'veg', 532, array['broad noodles spicy hot', 'broad noodles spicy hot halal', 'broad noodles spicy hot (halal)', 'broad noodle spicy hot flavor', 'a-kuan broad noodle spicy hot flavor', 'broad noodles spicy chicken halal', 'broad noodles spicy chicken (halal)']::text[]),
    ('Samyang Tangle Creamy Mushroom', 'Creamy mushroom pasta-style noodles.', '/ramen-products/samyang-tangle-creamy-mushroom-halal.png', 249, 209, 249, 0, 'veg', 530, array['samyang tangle creamy mushroom', 'samyang tangle creamy mushroom halal', 'samyang tangle creamy mushroom (halal)', 'tangle creamy mushroom']::text[]),
    ('Samyang Jjajang', 'Black bean spicy Buldak ramen.', '/ramen-products/samyang-jjajang-halal.png', 219, 150, 219, 2, 'non_veg', 206, array['samyang jjajang', 'samyang jjajang halal', 'samyang jjajang (halal)', 'samyang buldak jjajang', 'samyang buldak jjajang halal']::text[]),
    ('Samyang Buldak Habanero Lime', 'Buldak ramen with habanero lime flavour.', '/ramen-products/samyang-buldak-habanero-lime-halal.png', 219, 179, 219, 4, 'non_veg', 207, array['samyang buldak habanero lime', 'samyang buldak habanero lime halal', 'samyang buldak habanero lime (halal)', 'samyang habanero lime', 'samyang habanero lime halal']::text[]),
    ('Samyang Buldak 3x', '3x spicy Buldak ramen.', '/ramen-products/samyang-buldak-3x-halal.png', 219, 179, 219, 5, 'non_veg', 209, array['samyang buldak 3x', 'samyang buldak 3x halal', 'samyang buldak 3x (halal)', 'samyang 3x', 'samyang 3x halal']::text[]),
    ('Samyang Buldak 2x', '2x spicy Buldak ramen.', '/ramen-products/samyang-buldak-2x-halal.png', 219, 179, 219, 5, 'non_veg', 520, array['samyang buldak 2x', 'samyang buldak 2x halal', 'samyang buldak 2x (halal)', 'samyang 2x', 'samyang 2x halal']::text[]),
    ('Paldo Volcano Chicken', 'Volcano chicken noodle.', '/ramen-products/paldo-volcano-chicken-halal.png', 219, 179, 219, 4, 'non_veg', 518, array['paldo volcano chicken', 'paldo volcano chicken halal', 'paldo volcano chicken (halal)', 'volcano chicken noodle']::text[]),
    ('Paldo Volcano Carbonara', 'Creamy volcano-style spicy ramen.', '/ramen-products/paldo-volcano-carbonara-halal.png', 219, 179, 219, 4, 'non_veg', 210, array['paldo volcano carbonara', 'paldo volcano carbonara halal', 'paldo volcano carbonara (halal)', 'volcano carbonara chicken noodle']::text[])
),
updated_items as (
  update public.menu_items item
  set
    category_id = 'ramen',
    image_url = product_rows.image_url,
    description = coalesce(nullif(item.description, ''), product_rows.description),
    price = coalesce(nullif(item.price, 0), product_rows.price),
    packet_only_price = coalesce(item.packet_only_price, product_rows.packet_only_price),
    self_cook_price = coalesce(item.self_cook_price, product_rows.self_cook_price),
    price_type = 'dual',
    spice_level = product_rows.spice_level,
    food_type = product_rows.food_type,
    status = 'available',
    updated_at = now()
  from product_rows
  where lower(trim(item.name)) = any(product_rows.aliases)
  returning item.name, item.image_url
),
inserted_items as (
  insert into public.menu_items (
    name,
    description,
    category_id,
    image_url,
    price,
    packet_only_price,
    self_cook_price,
    price_type,
    drink_price_type,
    has_cup_ice_option,
    cup_ice_available,
    spice_level,
    food_type,
    status,
    sort_order,
    updated_at
  )
  select
    target_name,
    description,
    'ramen',
    image_url,
    price,
    packet_only_price,
    self_cook_price,
    'dual',
    'single',
    false,
    true,
    spice_level,
    food_type,
    'available',
    sort_order,
    now()
  from product_rows
  where not exists (
    select 1
    from public.menu_items item
    where lower(trim(item.name)) = any(product_rows.aliases)
      or item.image_url = product_rows.image_url
  )
  on conflict do nothing
  returning name, image_url
)
select
  'updated_existing_items' as action,
  count(*)::text as row_count,
  string_agg(name, ', ' order by name) as items
from updated_items

union all

select
  'inserted_missing_items' as action,
  count(*)::text as row_count,
  string_agg(name, ', ' order by name) as items
from inserted_items;
