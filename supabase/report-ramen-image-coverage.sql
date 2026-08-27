-- Run this in Supabase SQL Editor to see why fewer images appear on the menu.
-- The duplicate Samyang Jjajang clipboard image is intentionally ignored.

with album_images(display_name, image_url) as (
  values
    ('Daebak Ghost Pepper', '/ramen-products/40292351-1-daebak-ghost-pepper-dry-black-instant-noodles-with-spicy-chicken-flavour.png'),
    ('Rapokki Cheese', '/ramen-products/40351583-2-good-seoul-rapokki-cheesy-flavour-korean-ricecake-with-ramen.png'),
    ('Rapokki Spicy', '/ramen-products/40351584-2-good-seoul-rapokki-spicy-flavour-korean-ricecake-with-ramen.png'),
    ('Keekoo 2x Spicy', '/ramen-products/500-korean-raman-keekoo2x-spicy-5-instant-noodles-original-imahgfndz9uv6k7a.png'),
    ('KeeKoo Spicy Cheese', '/ramen-products/keekoo-spicy-cheese.png'),
    ('Broad Noodles Spicy Chicken', '/ramen-products/broad-noodles-spicy-chicken.png'),
    ('Broad Noodles Spicy Hot', '/ramen-products/broad-noodles-spicy-hot-halal.png'),
    ('Bulcha Carbonara', '/ramen-products/bulcha-carbonara.png'),
    ('Nongshim Shin Ramyeon', '/ramen-products/nongshim-shin-ramyun.png'),
    ('Nongshim Shin Cheese Stir Fry', '/ramen-products/nongshim-shin-cheese-stir-fry.png'),
    ('Nongshim Soon Veggie', '/ramen-products/nongshim-soon-veggie.png'),
    ('Ottogi Jin Chicken', '/ramen-products/otogi-jin-chicken.png'),
    ('Paldo Jjajangmen', '/ramen-products/paldo-jjajangmen.png'),
    ('Paldo Kimchi Jumbo', '/ramen-products/paldo-kimchi-jumbo.png'),
    ('Paldo Kokomen', '/ramen-products/paldo-kokomen.png'),
    ('Paldo Mr Kimchi', '/ramen-products/paldo-mr-kimchi.png'),
    ('Paldo Namja Ramyun', '/ramen-products/paldo-namja-ramen.png'),
    ('Paldo Rabokki Halal', '/ramen-products/paldo-rabokki-halal.png'),
    ('Paldo Seafood Jumbo', '/ramen-products/paldo-seafood-jumbo.png'),
    ('Paldo Volcano Chicken Halal', '/ramen-products/paldo-volcano-chicken-halal.png'),
    ('Paldo Volcano Carbonara Halal', '/ramen-products/paldo-volcano-carbonara-halal.png'),
    ('Paldo Zanmang Loopy', '/ramen-products/paldo-zanmang-loopy.png'),
    ('Paldo Lobster', '/ramen-products/paldo-lobster.png'),
    ('Paldo Samgyetang', '/ramen-products/paldo-samgyetang.png'),
    ('Samyang Buldak 2x Halal', '/ramen-products/samyang-buldak-2x-halal.png'),
    ('Samyang Buldak 3x Halal', '/ramen-products/samyang-buldak-3x-halal.png'),
    ('Samyang Buldak Black', '/ramen-products/samyang-buldak-black.png'),
    ('Samyang Buldak Carbonara', '/ramen-products/samyang-buldak-carbonara.png'),
    ('Samyang Buldak Cheese', '/ramen-products/samyang-buldak-cheese.png'),
    ('Samyang Buldak Habanero Lime Halal', '/ramen-products/samyang-buldak-habanero-lime-halal.png'),
    ('Samyang Cream Carbonara', '/ramen-products/samyang-cream-carbonara.png'),
    ('Samyang Jjajang Halal', '/ramen-products/samyang-jjajang-halal.png'),
    ('Samyang Kimchi Ramen', '/ramen-products/samyang-kimchi-ramen.png'),
    ('Samyang Original', '/ramen-products/samyang-original.png'),
    ('Samyang Rose', '/ramen-products/samyang-rose.png'),
    ('Samyang Tangle Creamy Mushroom Halal', '/ramen-products/samyang-tangle-creamy-mushroom-halal.png'),
    ('Samyang Tangle Garlic Oil', '/ramen-products/samyang-tangle-garlic-oil.png'),
    ('Samyang Hot Chicken Stew', '/ramen-products/samyang-hot-chicken-stew.png'),
    ('Ottogi Cheese Ramen', '/ramen-products/ottogi-cheese-ramen.png'),
    ('Ottogi Spicy Stir Fry', '/ramen-products/ottogi-spicy-stir-fry.png'),
    ('Yopokki Cheese', '/ramen-products/yopokki-cheese.png'),
    ('Yopokki Hot & Spicy', '/ramen-products/yopokki-hotandspicy.png'),
    ('Yopokki Spicy Carbonara', '/ramen-products/yopokki-spicy-carbonara.png'),
    ('Yopokki Sweet & Spicy', '/ramen-products/yopokki-sweet-andspicy.png')
),
visible_menu_items as (
  select item.id, item.name, item.category_id, item.status, item.image_url
  from public.menu_items item
  where item.status <> 'hidden'
)
select
  'visible_ramen_and_snack_items_with_images' as report,
  count(*)::text as value,
  null::text as detail
from visible_menu_items
where category_id in ('ramen', 'k_snacks_sides')
  and image_url is not null
  and trim(image_url) <> ''

union all

select
  'visible_ramen_and_snack_items_without_images' as report,
  count(*)::text as value,
  string_agg(name, ', ' order by category_id, sort_order, name) as detail
from public.menu_items
where status <> 'hidden'
  and category_id in ('ramen', 'k_snacks_sides')
  and (image_url is null or trim(image_url) = '')

union all

select
  'other_visible_items_without_images' as report,
  count(*)::text as value,
  string_agg(name, ', ' order by category_id, sort_order, name) as detail
from public.menu_items
where status <> 'hidden'
  and category_id not in ('ramen', 'k_snacks_sides')
  and (image_url is null or trim(image_url) = '')

union all

select
  'album_images_not_used_by_any_menu_item' as report,
  count(*)::text as value,
  string_agg(album_images.display_name, ', ' order by album_images.display_name) as detail
from album_images
where not exists (
  select 1
  from public.menu_items item
  where item.image_url = album_images.image_url
);
