-- Run this once in Supabase SQL Editor.
-- This resets all drinks to one normal display price.
-- The public menu will show the shared note: Cup + Ice is Rs 20 extra.

update public.menu_items
set
  price_type = 'single',
  packet_only_price = null,
  self_cook_price = null,
  with_cup_ice_price = null,
  drink_price_type = 'single',
  has_cup_ice_option = false,
  cup_ice_price = null,
  cup_ice_available = true
where category_id in ('drinks', 'drink_soda', 'drink_non_soda', 'drink_diet');
