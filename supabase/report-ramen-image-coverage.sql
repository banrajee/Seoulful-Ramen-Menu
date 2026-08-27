-- Run this in Supabase SQL Editor to see why fewer images appear on the menu.
-- The duplicate Samyang Jjajang clipboard image is intentionally ignored.

with album_images(display_name, image_url) as (
  values
    ('Daebak Ghost Pepper', '/ramen-products/40292351-1-daebak-ghost-pepper-dry-black-instant-noodles-with-spicy-chicken-flavour.png'),
    ('Paldo Volcano Carbonara', '/ramen-products/40338886-1-paldo-volcano-carbonara-instant-korean-chicken-noodle.png'),
    ('Good Seoul Rapokki Cheesy', '/ramen-products/40351583-2-good-seoul-rapokki-cheesy-flavour-korean-ricecake-with-ramen.png'),
    ('Good Seoul Rapokki Spicy', '/ramen-products/40351584-2-good-seoul-rapokki-spicy-flavour-korean-ricecake-with-ramen.png'),
    ('Keekoo 2x Spicy', '/ramen-products/500-korean-raman-keekoo2x-spicy-5-instant-noodles-original-imahgfndz9uv6k7a.png'),
    ('Broad Noodles Spicy Chicken', '/ramen-products/broad-noodles-spicy-chicken.png'),
    ('Bulcha Carbonara', '/ramen-products/bulcha-carbonara.png'),
    ('Nongshim Shin Ramyeon', '/ramen-products/nongshim-shin-ramyun.png'),
    ('Nongshim Soon Veggie', '/ramen-products/nongshim-soon-veggie.png'),
    ('Ottogi Jin Chicken', '/ramen-products/otogi-jin-chicken.png'),
    ('Paldo Jjajangmen', '/ramen-products/paldo-jjajangmen.png'),
    ('Paldo Kimchi Jumbo', '/ramen-products/paldo-kimchi-jumbo.png'),
    ('Paldo Kokomen', '/ramen-products/paldo-kokomen.png'),
    ('Paldo Mr Kimchi', '/ramen-products/paldo-mr-kimchi.png'),
    ('Paldo Namja Ramyun', '/ramen-products/paldo-namja-ramen.png'),
    ('Paldo Rabokki', '/ramen-products/paldo-rabokki.png'),
    ('Paldo Seafood Jumbo', '/ramen-products/paldo-seafood-jumbo.png'),
    ('Paldo Volcano Chicken', '/ramen-products/paldo-volcano-chicken.png'),
    ('Paldo Zanmang Loopy', '/ramen-products/paldo-zanmang-loopy.png'),
    ('Samyang Buldak 2x', '/ramen-products/samyang-buldak-2x.png'),
    ('Samyang Buldak 3x', '/ramen-products/samyang-buldak-3x.png'),
    ('Samyang Buldak Black', '/ramen-products/samyang-buldak-black.png'),
    ('Samyang Buldak Carbonara', '/ramen-products/samyang-buldak-carbonara.png'),
    ('Samyang Buldak Cheese', '/ramen-products/samyang-buldak-cheese.png'),
    ('Samyang Buldak Habanero Lime', '/ramen-products/samyang-buldak-habanero-lime.png'),
    ('Samyang Cream Carbonara', '/ramen-products/samyang-cream-carbonara.png'),
    ('Samyang Jjajang', '/ramen-products/samyang-jjajang.png'),
    ('Samyang Kimchi Ramen', '/ramen-products/samyang-kimchi-ramen.png'),
    ('Samyang Original', '/ramen-products/samyang-original.png'),
    ('Samyang Tangle Creamy Mushroom', '/ramen-products/samyang-tangle-creamy-mushroom.png'),
    ('Samyang Tangle Garlic Oil', '/ramen-products/samyang-tangle-garlic-oil.png'),
    ('Broad Noodles Spicy Hot', '/ramen-products/whatsapp-image-2026-08-01-at-5-37-47-pm.png'),
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
