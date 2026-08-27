-- Run this after insert-missing-ramen-product-items.sql if Good Seoul Rapokki
-- appeared under K-Snacks & Sides or if your existing menu rows are named
-- Rabokki/Rapokki Cheese and Rabokki/Rapokki Spicy.
--
-- It keeps the products in the Ramen category, attaches the correct photos,
-- and hides duplicate Good Seoul rows when a better matching row already exists.

with rapokki_matches(
  target_name,
  source_name,
  description,
  image_url,
  price,
  packet_only_price,
  self_cook_price,
  spice_level,
  food_type,
  sort_order,
  target_aliases
) as (
  values
    (
      'Rapokki Cheese',
      'Good Seoul Rapokki Cheesy',
      'Cheesy rice cake with ramen.',
      '/ramen-products/40351583-2-good-seoul-rapokki-cheesy-flavour-korean-ricecake-with-ramen.png',
      249,
      209,
      249,
      1,
      'veg',
      503,
      array[
        'rapokki cheese',
        'rapokki cheesy',
        'rabokki cheese',
        'rabokki cheesy',
        'good seoul rapokki cheese',
        'good seoul rapokki cheesy flavour'
      ]::text[]
    ),
    (
      'Rapokki Spicy',
      'Good Seoul Rapokki Spicy',
      'Spicy rice cake with ramen.',
      '/ramen-products/40351584-2-good-seoul-rapokki-spicy-flavour-korean-ricecake-with-ramen.png',
      249,
      209,
      249,
      3,
      'veg',
      504,
      array[
        'rapokki spicy',
        'rabokki spicy',
        'good seoul rapokki spicy flavour'
      ]::text[]
    )
),
matched_existing_items as (
  update public.menu_items item
  set
    category_id = 'ramen',
    image_url = rapokki_matches.image_url,
    description = coalesce(nullif(item.description, ''), rapokki_matches.description),
    price = coalesce(nullif(item.price, 0), rapokki_matches.price),
    packet_only_price = coalesce(item.packet_only_price, rapokki_matches.packet_only_price),
    self_cook_price = coalesce(item.self_cook_price, rapokki_matches.self_cook_price),
    price_type = 'dual',
    spice_level = rapokki_matches.spice_level,
    food_type = rapokki_matches.food_type,
    status = 'available',
    updated_at = now()
  from rapokki_matches
  where lower(trim(item.name)) = any(rapokki_matches.target_aliases)
    and lower(trim(item.name)) <> lower(trim(rapokki_matches.source_name))
  returning item.id, item.name, rapokki_matches.source_name
),
renamed_source_items as (
  update public.menu_items item
  set
    name = rapokki_matches.target_name,
    description = rapokki_matches.description,
    category_id = 'ramen',
    image_url = rapokki_matches.image_url,
    price = rapokki_matches.price,
    packet_only_price = rapokki_matches.packet_only_price,
    self_cook_price = rapokki_matches.self_cook_price,
    price_type = 'dual',
    spice_level = rapokki_matches.spice_level,
    food_type = rapokki_matches.food_type,
    status = 'available',
    sort_order = rapokki_matches.sort_order,
    updated_at = now()
  from rapokki_matches
  where lower(trim(item.name)) = lower(trim(rapokki_matches.source_name))
    and not exists (
      select 1
      from public.menu_items existing_item
      where lower(trim(existing_item.name)) = any(rapokki_matches.target_aliases)
        and lower(trim(existing_item.name)) <> lower(trim(rapokki_matches.source_name))
    )
  returning item.id, item.name
),
hidden_duplicate_source_items as (
  update public.menu_items item
  set
    status = 'hidden',
    category_id = 'ramen',
    updated_at = now()
  from rapokki_matches
  where lower(trim(item.name)) = lower(trim(rapokki_matches.source_name))
    and exists (
      select 1
      from public.menu_items existing_item
      where lower(trim(existing_item.name)) = any(rapokki_matches.target_aliases)
        and lower(trim(existing_item.name)) <> lower(trim(rapokki_matches.source_name))
    )
  returning item.id, item.name
)
select
  'matched_existing_items' as action,
  count(*)::text as row_count,
  string_agg(name, ', ' order by name) as items
from matched_existing_items

union all

select
  'renamed_and_moved_good_seoul_items' as action,
  count(*)::text as row_count,
  string_agg(name, ', ' order by name) as items
from renamed_source_items

union all

select
  'hidden_duplicate_good_seoul_items' as action,
  count(*)::text as row_count,
  string_agg(name, ', ' order by name) as items
from hidden_duplicate_source_items;
