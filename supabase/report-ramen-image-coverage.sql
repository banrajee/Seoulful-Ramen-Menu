-- Run this in Supabase SQL Editor to see why fewer images appear on the menu.
-- The duplicate Samyang Jjajang clipboard image is intentionally ignored.

with album_images(display_name, image_url) as (
  values
    ('Daebak Ghost Pepper', '/menu-products/40292351-1-daebak-ghost-pepper-dry-black-instant-noodles-with-spicy-chicken-flavour.png'),
    ('Rapokki Cheese', '/menu-products/40351583-2-good-seoul-rapokki-cheesy-flavour-korean-ricecake-with-ramen.png'),
    ('Rapokki Spicy', '/menu-products/40351584-2-good-seoul-rapokki-spicy-flavour-korean-ricecake-with-ramen.png'),
    ('Keekoo 2x Spicy', '/menu-products/500-korean-raman-keekoo2x-spicy-5-instant-noodles-original-imahgfndz9uv6k7a.png'),
    ('KeeKoo Spicy Cheese', '/menu-products/keekoo-spicy-cheese.png'),
    ('Broad Noodles Spicy Chicken', '/menu-products/broad-noodles-spicy-chicken.png'),
    ('Broad Noodles Spicy Hot', '/menu-products/broad-noodles-spicy-hot-halal.png'),
    ('Bulcha Carbonara', '/menu-products/bulcha-carbonara.png'),
    ('Nongshim Shin Ramyeon', '/menu-products/nongshim-shin-ramyun.png'),
    ('Nongshim Shin Cheese Stir Fry', '/menu-products/nongshim-shin-cheese-stir-fry.png'),
    ('Nongshim Soon Veggie', '/menu-products/nongshim-soon-veggie.png'),
    ('Ottogi Jin Chicken', '/menu-products/otogi-jin-chicken.png'),
    ('Paldo Jjajangmen', '/menu-products/paldo-jjajangmen.png'),
    ('Paldo Kimchi Jumbo', '/menu-products/paldo-kimchi-jumbo.png'),
    ('Paldo Kokomen', '/menu-products/paldo-kokomen.png'),
    ('Paldo Mr Kimchi', '/menu-products/paldo-mr-kimchi.png'),
    ('Paldo Namja Ramyun', '/menu-products/paldo-namja-ramen.png'),
    ('Paldo Rabokki Halal', '/menu-products/paldo-rabokki-halal.png'),
    ('Paldo Seafood Jumbo', '/menu-products/paldo-seafood-jumbo.png'),
    ('Paldo Volcano Chicken Halal', '/menu-products/paldo-volcano-chicken-halal.png'),
    ('Paldo Volcano Carbonara Halal', '/menu-products/paldo-volcano-carbonara-halal.png'),
    ('Paldo Zanmang Loopy', '/menu-products/paldo-zanmang-loopy.png'),
    ('Paldo Lobster', '/menu-products/paldo-lobster.png'),
    ('Paldo Samgyetang', '/menu-products/paldo-samgyetang.png'),
    ('Samyang Buldak 2x Halal', '/menu-products/samyang-buldak-2x-halal.png'),
    ('Samyang Buldak 3x Halal', '/menu-products/samyang-buldak-3x-halal.png'),
    ('Samyang Buldak Black', '/menu-products/samyang-buldak-black.png'),
    ('Samyang Buldak Carbonara', '/menu-products/samyang-buldak-carbonara.png'),
    ('Samyang Buldak Cheese', '/menu-products/samyang-buldak-cheese.png'),
    ('Samyang Buldak Habanero Lime Halal', '/menu-products/samyang-buldak-habanero-lime-halal.png'),
    ('Samyang Cream Carbonara', '/menu-products/samyang-cream-carbonara.png'),
    ('Samyang Jjajang Halal', '/menu-products/samyang-jjajang-halal.png'),
    ('Samyang Kimchi Ramen', '/menu-products/samyang-kimchi-ramen.png'),
    ('Samyang Original', '/menu-products/samyang-original.png'),
    ('Samyang Rose', '/menu-products/samyang-rose.png'),
    ('Samyang Tangle Creamy Mushroom Halal', '/menu-products/samyang-tangle-creamy-mushroom-halal.png'),
    ('Samyang Tangle Garlic Oil', '/menu-products/samyang-tangle-garlic-oil.png'),
    ('Samyang Hot Chicken Stew', '/menu-products/samyang-hot-chicken-stew.png'),
    ('Ottogi Cheese Ramen', '/menu-products/ottogi-cheese-ramen.png'),
    ('Ottogi Spicy Stir Fry', '/menu-products/ottogi-spicy-stir-fry.png'),
    ('Yopokki Cheese', '/menu-products/yopokki-cheese.png'),
    ('Yopokki Hot & Spicy', '/menu-products/yopokki-hotandspicy.png'),
    ('Yopokki Spicy Carbonara', '/menu-products/yopokki-spicy-carbonara.png'),
    ('Yopokki Sweet & Spicy', '/menu-products/yopokki-sweet-andspicy.png')
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
