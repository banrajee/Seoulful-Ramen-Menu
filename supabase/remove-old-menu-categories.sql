-- Run this once in Supabase SQL Editor.
-- It removes the old Classic/Premium/Signature/Yopokki categories from the live database.
-- Existing Classic/Premium/Signature ramen items are kept and moved into one Ramen category.
-- Existing Yopokki items are deleted because that section was removed from the menu.

begin;

insert into public.categories (id, name, sort_order)
values ('ramen', 'Ramen', 1)
on conflict (id) do update set
  name = excluded.name,
  sort_order = excluded.sort_order;

update public.menu_items
set
  category_id = 'ramen',
  price_type = 'dual',
  self_cook_price = coalesce(self_cook_price, price),
  packet_only_price = coalesce(packet_only_price, greatest(price - 40, 0)),
  drink_price_type = 'single',
  has_cup_ice_option = false,
  cup_ice_price = null,
  cup_ice_available = true,
  with_cup_ice_price = null,
  food_type = coalesce(
    food_type,
    case
      when lower(name) like '%chicken%'
        or lower(name) like '%seafood%'
        or lower(name) like '%lobster%'
        or lower(name) like '%samgyetang%'
      then 'non_veg'
      else 'veg'
    end
  )
where category_id in ('classic', 'premium', 'signature');

delete from public.menu_items
where category_id = 'yopokki';

delete from public.categories
where id in ('classic', 'premium', 'signature', 'yopokki');

update public.categories
set sort_order = case id
  when 'ramen' then 1
  when 'addons' then 2
  when 'drinks' then 3
  when 'drink_soda' then 4
  when 'drink_non_soda' then 5
  when 'drink_diet' then 6
  when 'k_snacks_sides' then 7
  else sort_order
end
where id in ('ramen', 'addons', 'drinks', 'drink_soda', 'drink_non_soda', 'drink_diet', 'k_snacks_sides');

commit;
