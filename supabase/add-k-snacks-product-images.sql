-- Run this in Supabase SQL Editor after deploying the latest public/menu-products files.
-- It matches these photos to existing K-Snacks rows where possible, and inserts
-- missing K-Snacks rows only when no matching menu item exists yet.
--
-- Prices are starter defaults. Review and adjust them in the dashboard.

with snack_rows(
  target_name,
  description,
  image_url,
  price,
  spice_level,
  food_type,
  sort_order,
  aliases
) as (
  values
    ('Noriko Tofu Curd Skewer Snack', 'Ready-to-eat spicy tofu curd skewer snack.', '/menu-products/noriko-tofu-curd-skewer-snack.png', 49, 1, 'veg', 701, array['noriko tofu curd skewer snack', 'tofu curd skewer snack', 'noriko tofu skewer']::text[]),
    ('Noriko Braised Tofu Stick Snack', 'Ready-to-eat spicy braised tofu stick snack.', '/menu-products/noriko-braised-tofu-stick-snack.png', 49, 1, 'veg', 702, array['noriko braised tofu stick snack', 'noriko seafood tofu stick snack', 'seafood tofu stick snack', 'braised tofu stick snack']::text[]),
    ('Noriko Braised Lotus Root Snack', 'Ready-to-eat spicy braised lotus root snack.', '/menu-products/noriko-braised-lotus-root-snack.png', 49, 1, 'veg', 703, array['noriko braised lotus root snack', 'braised lotus root snack', 'lotus root snack']::text[]),
    ('Noriko Fried Squid Spicy Flavoured Snack', 'Ready-to-eat spicy fried squid snack.', '/menu-products/noriko-fried-squid-spicy-flavoured-snack.png', 49, 2, 'non_veg', 704, array['noriko fried squid spicy flavoured snack', 'fried squid spicy flavoured snack', 'fried squid spicy flavored snack', 'noriko fried squid']::text[]),
    ('Roasted Fried Fish Mala Flavoured Snack', 'Ready-to-eat mala flavoured fried fish snack.', '/menu-products/roasted-fried-fish-mala-flavoured-snack.png', 49, 2, 'non_veg', 705, array['roasted fried fish mala flavoured snack', 'rosted fried fish mala flavoured snack', 'fried fish mala flavoured snack', 'fried fish mala flavored snack']::text[]),
    ('Roasted Fried Fish Spicy Flavoured Snack', 'Ready-to-eat super spicy fried fish snack.', '/menu-products/roasted-fried-fish-spicy-flavoured-snack.png', 49, 3, 'non_veg', 706, array['roasted fried fish spicy flavoured snack', 'rosted fried fish spicy flavoured snack', 'fried fish spicy flavoured snack', 'fried fish spicy flavored snack']::text[]),
    ('Noriko Fermented Tofu', 'Ready-to-eat spicy fermented tofu snack.', '/menu-products/noriko-fermented-tofu.png', 49, 2, 'veg', 707, array['noriko fermented tofu', 'fermented tofu spicy flavoured snack', 'fermented tofu spicy flavored snack']::text[]),
    ('Big Sheet', 'Assorted seaweed big sheet snack.', '/menu-products/big-sheet.png', 49, 0, 'veg', 708, array['big sheet', 'big sheet seaweed', 'seaweed big sheet']::text[]),
    ('Stir-Fried Kimchi', 'Korean-style stir-fried kimchi.', '/menu-products/stir-fried-kimchi.png', 99, 1, 'veg', 709, array['stir-fried kimchi', 'stir fried kimchi', 'kimchi stir fry', 'stir-fried kimchi snack']::text[])
),
updated_items as (
  update public.menu_items item
  set
    category_id = 'k_snacks_sides',
    image_url = snack_rows.image_url,
    description = coalesce(nullif(item.description, ''), snack_rows.description),
    price = coalesce(nullif(item.price, 0), snack_rows.price),
    packet_only_price = null,
    self_cook_price = null,
    price_type = 'single',
    spice_level = snack_rows.spice_level,
    food_type = snack_rows.food_type,
    status = 'available',
    updated_at = now()
  from snack_rows
  where lower(trim(item.name)) = any(snack_rows.aliases)
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
    'k_snacks_sides',
    image_url,
    price,
    null,
    null,
    'single',
    'single',
    false,
    true,
    spice_level,
    food_type,
    'available',
    sort_order,
    now()
  from snack_rows
  where not exists (
    select 1
    from public.menu_items item
    where lower(trim(item.name)) = any(snack_rows.aliases)
      or item.image_url = snack_rows.image_url
  )
  on conflict do nothing
  returning name, image_url
)
select
  'updated_existing_snacks' as action,
  count(*)::text as row_count,
  string_agg(name, ', ' order by name) as items
from updated_items

union all

select
  'inserted_missing_snacks' as action,
  count(*)::text as row_count,
  string_agg(name, ', ' order by name) as items
from inserted_items;
