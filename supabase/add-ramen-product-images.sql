-- Run this in Supabase SQL Editor after deploying the files in public/ramen-products.
-- It assigns cleaned product photos to matching menu items and unhides those items.

with image_updates(name, image_url) as (
  values
    ('Nongshim Shin Ramyeon', '/ramen-products/nongshim-shin-ramyun.png'),
    ('Nongshim Shin Ramyun', '/ramen-products/nongshim-shin-ramyun.png'),
    ('Samyang Kimchi Ramen', '/ramen-products/samyang-kimchi-ramen.png'),
    ('Samyang Ramen Kimchi', '/ramen-products/samyang-kimchi-ramen.png'),
    ('Paldo Jjajangmen', '/ramen-products/paldo-jjajangmen.png'),
    ('Paldo Jjajang Men', '/ramen-products/paldo-jjajangmen.png'),
    ('Samyang Tangle Garlic Oil', '/ramen-products/samyang-tangle-garlic-oil.png'),
    ('Samyang Tangle Garlic Oil Pasta', '/ramen-products/samyang-tangle-garlic-oil.png'),
    ('Samyang Tangle Creamy Mushroom', '/ramen-products/samyang-tangle-creamy-mushroom.png'),
    ('Samyang Tangle Creamy Mushroom Pasta', '/ramen-products/samyang-tangle-creamy-mushroom.png'),
    ('Paldo Namja Ramyun', '/ramen-products/paldo-namja-ramen.png'),
    ('Paldo Namja Ramen', '/ramen-products/paldo-namja-ramen.png'),
    ('Paldo Rabokki', '/ramen-products/paldo-rabokki.png'),
    ('Paldo Zanmang Loopy', '/ramen-products/paldo-zanmang-loopy.png'),
    ('Paldo Zangmyeon Loopy', '/ramen-products/paldo-zanmang-loopy.png'),
    ('Bulcha Carbonara', '/ramen-products/bulcha-carbonara.png'),
    ('Samyang Buldak Carbonara', '/ramen-products/samyang-buldak-carbonara.png'),
    ('Samyang Buldak Carbonara (Halal)', '/ramen-products/samyang-buldak-carbonara.png'),
    ('Samyang Carbonara', '/ramen-products/samyang-buldak-carbonara.png'),
    ('Samyang Jjajang', '/ramen-products/samyang-jjajang.png'),
    ('Samyang Buldak Jjajang', '/ramen-products/samyang-jjajang.png'),
    ('Samyang Cream Carbonara', '/ramen-products/samyang-cream-carbonara.png'),
    ('Samyang Buldak Cream Carbonara', '/ramen-products/samyang-cream-carbonara.png'),
    ('Samyang Buldak Cheese', '/ramen-products/samyang-buldak-cheese.png'),
    ('Samyang Buldak Cheese (Halal)', '/ramen-products/samyang-buldak-cheese.png'),
    ('Samyang Cheese', '/ramen-products/samyang-buldak-cheese.png'),
    ('Samyang Buldak Habanero Lime', '/ramen-products/samyang-buldak-habanero-lime.png'),
    ('Samyang Habanero Lime', '/ramen-products/samyang-buldak-habanero-lime.png'),
    ('Samyang Buldak Black', '/ramen-products/samyang-buldak-black.png'),
    ('Samyang Buldak Black (Halal)', '/ramen-products/samyang-buldak-black.png'),
    ('Samyang Black', '/ramen-products/samyang-buldak-black.png'),
    ('Samyang Buldak 3x', '/ramen-products/samyang-buldak-3x.png'),
    ('Samyang 3x', '/ramen-products/samyang-buldak-3x.png'),
    ('Samyang Buldak 2x', '/ramen-products/samyang-buldak-2x.png'),
    ('Samyang 2x', '/ramen-products/samyang-buldak-2x.png'),
    ('Paldo Kokomen', '/ramen-products/paldo-kokomen.png'),
    ('Ottogi Jin Chicken', '/ramen-products/otogi-jin-chicken.png'),
    ('Otogi Jin Chicken', '/ramen-products/otogi-jin-chicken.png'),
    ('Daebak Ghost Pepper', '/ramen-products/40292351-1-daebak-ghost-pepper-dry-black-instant-noodles-with-spicy-chicken-flavour.png'),
    ('Daebak Ghost Pepper Dry Black', '/ramen-products/40292351-1-daebak-ghost-pepper-dry-black-instant-noodles-with-spicy-chicken-flavour.png'),
    ('Paldo Volcano Chicken', '/ramen-products/paldo-volcano-chicken.png'),
    ('Paldo Volcano Carbonara', '/ramen-products/40338886-1-paldo-volcano-carbonara-instant-korean-chicken-noodle.png'),
    ('Keekoo 2x Spicy', '/ramen-products/500-korean-raman-keekoo2x-spicy-5-instant-noodles-original-imahgfndz9uv6k7a.png'),
    ('Keekoo Korean Ramen 2x Spicy', '/ramen-products/500-korean-raman-keekoo2x-spicy-5-instant-noodles-original-imahgfndz9uv6k7a.png'),
    ('Yopokki Hot & Spicy', '/ramen-products/yopokki-hotandspicy.png'),
    ('Yopokki Hot&Spicy', '/ramen-products/yopokki-hotandspicy.png'),
    ('Yopokki Hot and Spicy', '/ramen-products/yopokki-hotandspicy.png'),
    ('Yopokki Cheese', '/ramen-products/yopokki-cheese.png'),
    ('Yopokki Sweet & Spicy', '/ramen-products/yopokki-sweet-andspicy.png'),
    ('Yopokki Sweet and Spicy', '/ramen-products/yopokki-sweet-andspicy.png'),
    ('Paldo Mr Kimchi', '/ramen-products/paldo-mr-kimchi.png'),
    ('Paldo Mr. Kimchi', '/ramen-products/paldo-mr-kimchi.png'),
    ('Good Seoul Rapokki Cheesy', '/ramen-products/40351583-2-good-seoul-rapokki-cheesy-flavour-korean-ricecake-with-ramen.png'),
    ('Good Seoul Rapokki Cheesy Flavour', '/ramen-products/40351583-2-good-seoul-rapokki-cheesy-flavour-korean-ricecake-with-ramen.png'),
    ('Good Seoul Rapokki Spicy', '/ramen-products/40351584-2-good-seoul-rapokki-spicy-flavour-korean-ricecake-with-ramen.png'),
    ('Good Seoul Rapokki Spicy Flavour', '/ramen-products/40351584-2-good-seoul-rapokki-spicy-flavour-korean-ricecake-with-ramen.png'),
    ('Samyang Original', '/ramen-products/samyang-original.png'),
    ('Nongshim Soon Veggie', '/ramen-products/nongshim-soon-veggie.png'),
    ('Yopokki Spicy Carbonara', '/ramen-products/yopokki-spicy-carbonara.png'),
    ('Paldo Kimchi Jumbo', '/ramen-products/paldo-kimchi-jumbo.png'),
    ('Paldo Jumbo Kimchi', '/ramen-products/paldo-kimchi-jumbo.png'),
    ('Paldo Seafood Jumbo', '/ramen-products/paldo-seafood-jumbo.png'),
    ('Paldo Jumbo Seafood', '/ramen-products/paldo-seafood-jumbo.png'),
    ('Paldo Seafood', '/ramen-products/paldo-seafood-jumbo.png'),
    ('Broad Noodles Spicy Hot', '/ramen-products/whatsapp-image-2026-08-01-at-5-37-47-pm.png'),
    ('Broad Noodle Spicy Hot Flavor', '/ramen-products/whatsapp-image-2026-08-01-at-5-37-47-pm.png'),
    ('A-Kuan Broad Noodle Spicy Hot Flavor', '/ramen-products/whatsapp-image-2026-08-01-at-5-37-47-pm.png'),
    ('Broad Noodles Spicy Chicken', '/ramen-products/broad-noodles-spicy-chicken.png'),
    ('A-Kuan Broad Noodle Spicy Chicken Flavor', '/ramen-products/broad-noodles-spicy-chicken.png')
),
updated_items as (
  update public.menu_items item
  set
    image_url = image_updates.image_url,
    status = 'available',
    updated_at = now()
  from image_updates
  where lower(trim(item.name)) = lower(trim(image_updates.name))
  returning item.name, item.image_url
)
select
  count(*) as updated_row_count,
  string_agg(name, ', ' order by name) as updated_items
from updated_items;
