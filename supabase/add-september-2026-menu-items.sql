-- Adds the September 2026 ramen and K-Snacks products supplied by the shop owner.
-- Prices are temporary example values and should be reviewed in the owner dashboard.

with product_rows(
  target_name,
  description,
  category_id,
  image_url,
  price,
  packet_only_price,
  self_cook_price,
  price_type,
  spice_level,
  food_type,
  sort_order,
  aliases
) as (
  values
    ('Nongshim Shin Ramyun Spicy Chicken', 'Spicy chicken-flavoured Shin Ramyun.', 'ramen', '/menu-products/nongshim-shin-spicy-chicken.png', 189, 149, 189, 'dual', 3, 'non_veg', 610, array['nongshim shin ramyun spicy chicken', 'nongshim shin spicy chicken', 'shin ramyun spicy chicken']::text[]),
    ('Good Seoul Rapokki Carbonara', 'Carbonara rapokki with ramen and Korean rice cakes.', 'ramen', '/menu-products/good-seoul-rapokki-carbonara.png', 249, 209, 249, 'dual', 1, null, 611, array['good seoul rapokki carbonara', 'rapokki carbonara', 'good seoul carbonara rapokki']::text[]),
    ('Wei Long Big Latiao Hot & Spicy (106g)', 'Hot and spicy big latiao snack.', 'k_snacks_sides', '/menu-products/weilong-big-latiao-hot-spicy-white.png', 99, null, null, 'single', 1, null, 710, array['wei long big latiao hot & spicy (106g)', 'weilong big latiao 106g', 'wei long big latiao 106g']::text[]),
    ('Tao Kae Noi Big Roll Spicy Grilled Squid', 'Grilled seaweed roll with spicy grilled squid flavour.', 'k_snacks_sides', '/menu-products/tao-kae-noi-big-roll-spicy-grilled-squid.png', 49, null, null, 'single', 1, 'non_veg', 711, array['tao kae noi big roll spicy grilled squid', 'big roll spicy grilled squid', 'tao kae noi spicy grilled squid']::text[]),
    ('Wei Long Big Latiao Hot & Spicy (102g)', 'Hot and spicy big latiao snack.', 'k_snacks_sides', '/menu-products/weilong-big-latiao-hot-spicy-102g.png', 99, null, null, 'single', 3, null, 712, array['wei long big latiao hot & spicy (102g)', 'weilong big latiao 102g', 'wei long big latiao 102g']::text[])
),
updated_items as (
  update public.menu_items item
  set
    name = product_rows.target_name,
    description = product_rows.description,
    category_id = product_rows.category_id,
    image_url = product_rows.image_url,
    price = product_rows.price,
    packet_only_price = product_rows.packet_only_price,
    self_cook_price = product_rows.self_cook_price,
    price_type = product_rows.price_type,
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
    category_id,
    image_url,
    price,
    packet_only_price,
    self_cook_price,
    price_type,
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
select 'updated_existing_items' as action, count(*)::text as row_count,
  string_agg(name, ', ' order by name) as items
from updated_items
union all
select 'inserted_missing_items' as action, count(*)::text as row_count,
  string_agg(name, ', ' order by name) as items
from inserted_items;
