-- Run this once in Supabase SQL Editor after deploying public/menu-products.
-- It moves all existing ramen and K-Snacks image URLs to the single public folder.
-- It also fixes the three parenthesized snack names that were missed earlier and
-- hides only their newer duplicate rows. Hidden rows can be restored in the dashboard.

with normalized_paths as (
  update public.menu_items
  set
    image_url = regexp_replace(
      image_url,
      '^.*/(ramen-products|snack-products)/',
      '/menu-products/'
    ),
    updated_at = now()
  where image_url ~ '^.*/(ramen-products|snack-products)/'
  returning id, name
),
snack_matches(target_name, image_url, duplicate_name) as (
  values
    (
      'Noriko Fried Squid (Spicy Flavoured Snack)',
      '/menu-products/noriko-fried-squid-spicy-flavoured-snack.png',
      'Noriko Fried Squid Spicy Flavoured Snack'
    ),
    (
      'Roasted Fried Fish (Mala Flavoured Snack)',
      '/menu-products/roasted-fried-fish-mala-flavoured-snack.png',
      'Roasted Fried Fish Mala Flavoured Snack'
    ),
    (
      'Roasted Fried Fish (Spicy Flavoured Snack)',
      '/menu-products/roasted-fried-fish-spicy-flavoured-snack.png',
      'Roasted Fried Fish Spicy Flavoured Snack'
    )
),
fixed_original_snacks as (
  update public.menu_items item
  set
    image_url = snack_matches.image_url,
    updated_at = now()
  from snack_matches
  where item.category_id = 'k_snacks_sides'
    and lower(trim(item.name)) = lower(snack_matches.target_name)
  returning item.id, item.name
),
hidden_duplicate_snacks as (
  update public.menu_items duplicate_item
  set
    status = 'hidden',
    updated_at = now()
  from snack_matches
  where duplicate_item.category_id = 'k_snacks_sides'
    and lower(trim(duplicate_item.name)) = lower(snack_matches.duplicate_name)
    and exists (
      select 1
      from public.menu_items original_item
      where original_item.category_id = 'k_snacks_sides'
        and lower(trim(original_item.name)) = lower(snack_matches.target_name)
    )
  returning duplicate_item.id, duplicate_item.name
)
select
  (select count(*) from normalized_paths) as image_paths_moved,
  (select count(*) from fixed_original_snacks) as original_snacks_fixed,
  (select count(*) from hidden_duplicate_snacks) as duplicate_snacks_hidden;
