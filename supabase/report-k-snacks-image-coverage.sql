-- Run this in Supabase SQL Editor to check the K-Snacks product-image coverage.

with snack_images(display_name, image_url) as (
  values
    ('Noriko Tofu Curd Skewer Snack', '/menu-products/noriko-tofu-curd-skewer-snack.png'),
    ('Noriko Braised Tofu Stick Snack', '/menu-products/noriko-braised-tofu-stick-snack.png'),
    ('Noriko Braised Lotus Root Snack', '/menu-products/noriko-braised-lotus-root-snack.png'),
    ('Noriko Fried Squid Spicy Flavoured Snack', '/menu-products/noriko-fried-squid-spicy-flavoured-snack.png'),
    ('Roasted Fried Fish Mala Flavoured Snack', '/menu-products/roasted-fried-fish-mala-flavoured-snack.png'),
    ('Roasted Fried Fish Spicy Flavoured Snack', '/menu-products/roasted-fried-fish-spicy-flavoured-snack.png'),
    ('Noriko Fermented Tofu', '/menu-products/noriko-fermented-tofu.png'),
    ('Big Sheet', '/menu-products/big-sheet.png'),
    ('Stir-Fried Kimchi', '/menu-products/stir-fried-kimchi.png')
)
select
  'visible_k_snacks_with_images' as report,
  count(*)::text as value,
  null::text as detail
from public.menu_items
where status <> 'hidden'
  and category_id = 'k_snacks_sides'
  and image_url is not null
  and trim(image_url) <> ''

union all

select
  'visible_k_snacks_without_images' as report,
  count(*)::text as value,
  string_agg(name, ', ' order by sort_order, name) as detail
from public.menu_items
where status <> 'hidden'
  and category_id = 'k_snacks_sides'
  and (image_url is null or trim(image_url) = '')

union all

select
  'snack_images_not_used_by_any_menu_item' as report,
  count(*)::text as value,
  string_agg(snack_images.display_name, ', ' order by snack_images.display_name) as detail
from snack_images
where not exists (
  select 1
  from public.menu_items item
  where item.image_url = snack_images.image_url
);
