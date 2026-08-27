-- Run this in Supabase SQL Editor after add-ramen-product-images.sql.
-- The first script only updates menu rows that already exist. This script adds
-- product rows for cleaned album images that are not attached to any menu item yet.
--
-- Starter prices, spice levels, and veg/non-veg labels are best-effort defaults.
-- After running, review the inserted products in the dashboard and adjust them.

with product_rows(
  name,
  description,
  category_id,
  image_url,
  price,
  packet_only_price,
  self_cook_price,
  price_type,
  spice_level,
  food_type,
  sort_order
) as (
  values
    ('Daebak Ghost Pepper', 'Dry black instant noodles with spicy chicken flavour.', 'ramen', '/ramen-products/40292351-1-daebak-ghost-pepper-dry-black-instant-noodles-with-spicy-chicken-flavour.png', 219, 179, 219, 'dual', 5, 'non_veg', 501),
    ('Paldo Volcano Carbonara', 'Creamy volcano-style spicy ramen.', 'ramen', '/ramen-products/40338886-1-paldo-volcano-carbonara-instant-korean-chicken-noodle.png', 219, 179, 219, 'dual', 4, 'non_veg', 502),
    ('Rapokki Cheese', 'Cheesy rice cake with ramen.', 'ramen', '/ramen-products/40351583-2-good-seoul-rapokki-cheesy-flavour-korean-ricecake-with-ramen.png', 249, 209, 249, 'dual', 1, 'veg', 503),
    ('Rapokki Spicy', 'Spicy rice cake with ramen.', 'ramen', '/ramen-products/40351584-2-good-seoul-rapokki-spicy-flavour-korean-ricecake-with-ramen.png', 249, 209, 249, 'dual', 3, 'veg', 504),
    ('Keekoo 2x Spicy', 'Korean ramen with extra spicy seasoning.', 'ramen', '/ramen-products/500-korean-raman-keekoo2x-spicy-5-instant-noodles-original-imahgfndz9uv6k7a.png', 219, 179, 219, 'dual', 4, 'veg', 505),
    ('Broad Noodles Spicy Chicken', 'Broad noodles with spicy chicken flavour.', 'ramen', '/ramen-products/broad-noodles-spicy-chicken.png', 249, 209, 249, 'dual', 4, 'non_veg', 506),
    ('Bulcha Carbonara', 'Carbonara Korean ramen.', 'ramen', '/ramen-products/bulcha-carbonara.png', 219, 179, 219, 'dual', 3, 'veg', 507),
    ('Nongshim Shin Ramyeon', 'Original spicy Korean ramen.', 'ramen', '/ramen-products/nongshim-shin-ramyun.png', 189, 130, 189, 'dual', 0, 'veg', 508),
    ('Nongshim Soon Veggie', 'Vegetable ramen with mild spice.', 'ramen', '/ramen-products/nongshim-soon-veggie.png', 189, 130, 189, 'dual', 1, 'veg', 509),
    ('Ottogi Jin Chicken', 'Chicken-style Korean ramen.', 'ramen', '/ramen-products/otogi-jin-chicken.png', 189, 130, 189, 'dual', 1, 'non_veg', 510),
    ('Paldo Jjajangmen', 'Black bean sauce ramen.', 'ramen', '/ramen-products/paldo-jjajangmen.png', 249, 209, 249, 'dual', 0, 'veg', 511),
    ('Paldo Kimchi Jumbo', 'Jumbo kimchi noodle bowl.', 'ramen', '/ramen-products/paldo-kimchi-jumbo.png', 249, 209, 249, 'dual', 2, 'veg', 512),
    ('Paldo Kokomen', 'Clean chicken-style spicy ramen.', 'ramen', '/ramen-products/paldo-kokomen.png', 189, 130, 189, 'dual', 1, 'non_veg', 513),
    ('Paldo Mr Kimchi', 'Stir-fried kimchi ramen.', 'ramen', '/ramen-products/paldo-mr-kimchi.png', 189, 130, 189, 'dual', 2, 'veg', 514),
    ('Paldo Namja Ramyun', 'Bold Korean ramyun broth.', 'ramen', '/ramen-products/paldo-namja-ramen.png', 189, 130, 189, 'dual', 2, 'non_veg', 515),
    ('Paldo Rabokki', 'Ramen and rice cake flavour.', 'ramen', '/ramen-products/paldo-rabokki.png', 249, 209, 249, 'dual', 2, 'veg', 516),
    ('Paldo Seafood Jumbo', 'Jumbo seafood noodle bowl.', 'ramen', '/ramen-products/paldo-seafood-jumbo.png', 249, 209, 249, 'dual', 2, 'non_veg', 517),
    ('Paldo Volcano Chicken', 'Volcano chicken noodle.', 'ramen', '/ramen-products/paldo-volcano-chicken.png', 219, 179, 219, 'dual', 4, 'non_veg', 518),
    ('Paldo Zanmang Loopy', 'Black bean noodle with Loopy packaging.', 'ramen', '/ramen-products/paldo-zanmang-loopy.png', 249, 209, 249, 'dual', 0, 'veg', 519),
    ('Samyang Buldak 2x', '2x spicy Buldak ramen.', 'ramen', '/ramen-products/samyang-buldak-2x.png', 219, 179, 219, 'dual', 5, 'non_veg', 520),
    ('Samyang Buldak 3x', '3x spicy Buldak ramen.', 'ramen', '/ramen-products/samyang-buldak-3x.png', 219, 179, 219, 'dual', 5, 'non_veg', 521),
    ('Samyang Buldak Black', 'Original Buldak hot chicken flavour ramen.', 'ramen', '/ramen-products/samyang-buldak-black.png', 219, 150, 219, 'dual', 3, 'non_veg', 522),
    ('Samyang Buldak Carbonara', 'Creamy spicy Buldak carbonara ramen.', 'ramen', '/ramen-products/samyang-buldak-carbonara.png', 219, 150, 219, 'dual', 1, 'non_veg', 523),
    ('Samyang Buldak Cheese', 'Spicy Buldak cheese ramen.', 'ramen', '/ramen-products/samyang-buldak-cheese.png', 219, 150, 219, 'dual', 3, 'non_veg', 524),
    ('Samyang Buldak Habanero Lime', 'Buldak ramen with habanero lime flavour.', 'ramen', '/ramen-products/samyang-buldak-habanero-lime.png', 219, 179, 219, 'dual', 4, 'non_veg', 525),
    ('Samyang Cream Carbonara', 'Creamy carbonara Buldak ramen.', 'ramen', '/ramen-products/samyang-cream-carbonara.png', 219, 179, 219, 'dual', 2, 'non_veg', 526),
    ('Samyang Jjajang', 'Black bean spicy Buldak ramen.', 'ramen', '/ramen-products/samyang-jjajang.png', 219, 150, 219, 'dual', 2, 'non_veg', 527),
    ('Samyang Kimchi Ramen', 'Spicy ramen with kimchi flavour.', 'ramen', '/ramen-products/samyang-kimchi-ramen.png', 189, 150, 189, 'dual', 2, 'veg', 528),
    ('Samyang Original', 'Original spicy Samyang ramen.', 'ramen', '/ramen-products/samyang-original.png', 219, 150, 219, 'dual', 1, 'veg', 529),
    ('Samyang Tangle Creamy Mushroom', 'Creamy mushroom pasta-style noodles.', 'ramen', '/ramen-products/samyang-tangle-creamy-mushroom.png', 249, 209, 249, 'dual', 0, 'veg', 530),
    ('Samyang Tangle Garlic Oil', 'Garlic oil pasta-style noodles.', 'ramen', '/ramen-products/samyang-tangle-garlic-oil.png', 249, 209, 249, 'dual', 0, 'veg', 531),
    ('Broad Noodles Spicy Hot', 'Broad noodles with spicy hot flavour.', 'ramen', '/ramen-products/whatsapp-image-2026-08-01-at-5-37-47-pm.png', 249, 209, 249, 'dual', 4, 'veg', 532),
    ('Yopokki Cheese', 'Cheese topokki rice cake cup.', 'k_snacks_sides', '/ramen-products/yopokki-cheese.png', 149, null, null, 'single', 0, 'veg', 533),
    ('Yopokki Hot & Spicy', 'Hot and spicy topokki rice cake cup.', 'k_snacks_sides', '/ramen-products/yopokki-hotandspicy.png', 149, null, null, 'single', 3, 'veg', 534),
    ('Yopokki Spicy Carbonara', 'Spicy carbonara topokki rice cake cup.', 'k_snacks_sides', '/ramen-products/yopokki-spicy-carbonara.png', 149, null, null, 'single', 2, 'veg', 535),
    ('Yopokki Sweet & Spicy', 'Sweet and spicy topokki rice cake cup.', 'k_snacks_sides', '/ramen-products/yopokki-sweet-andspicy.png', 149, null, null, 'single', 2, 'veg', 536)
),
rows_to_insert as (
  select product_rows.*
  from product_rows
  where not exists (
    select 1
    from public.menu_items item
    where lower(trim(item.name)) = lower(trim(product_rows.name))
      or item.image_url = product_rows.image_url
  )
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
    name,
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
  from rows_to_insert
  on conflict do nothing
  returning name, category_id, image_url
)
select
  count(*) as inserted_row_count,
  string_agg(name || ' [' || category_id || ']', ', ' order by name) as inserted_items
from inserted_items;
