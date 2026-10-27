-- Adds the October 2026 ramen and grouped Steam & Spoon drinks supplied by the shop owner.
-- Prices and descriptions are temporary example values and can be changed in the owner dashboard.

with product_rows(
  target_name,
  description,
  category_id,
  image_url,
  price,
  packet_only_price,
  self_cook_price,
  price_type,
  spice_level,
  food_type,
  sort_order,
  aliases
) as (
  values
    ('Nissin Geki Truffcarbo', 'Saucy flat noodles with creamy truffle carbonara flavour.', 'ramen', '/menu-products/nissin-geki-truffcarbo.png', 249, 209, 249, 'dual', 4, 'veg', 800, array['nissin geki truffcarbo']::text[]),
    ('Nissin Geki Kimcheese', 'Spicy flat noodles with kimchi and cheese flavour.', 'ramen', '/menu-products/nissin-geki-kimcheese.png', 249, 209, 249, 'dual', 5, 'veg', 801, array['nissin geki kimcheese']::text[]),
    ('Baijia Pork Bone Soup', 'Rich pork-bone soup instant noodles.', 'ramen', '/menu-products/baijia-pork-bone-soup.png', 249, 209, 249, 'dual', 0, 'non_veg', 802, array['baijia pork bone soup']::text[]),
    ('Baijia Mutton Soup', 'Savoury mutton soup instant noodles.', 'ramen', '/menu-products/baijia-mutton-soup.png', 249, 209, 249, 'dual', 2, 'non_veg', 803, array['baijia mutton soup']::text[]),
    ('Otoki Jin Veggie', 'Mild vegan vegetable noodle soup.', 'ramen', '/menu-products/otoki-jin-veggie.png', 219, 179, 219, 'dual', 0, 'veg', 804, array['otoki jin veggie', 'ottogi jin veggie']::text[]),
    ('Baijia Mushroom Chicken', 'Comforting chicken noodles with mushroom flavour.', 'ramen', '/menu-products/baijia-mushroom-chicken.png', 249, 209, 249, 'dual', 0, 'non_veg', 805, array['baijia mushroom chicken']::text[]),
    ('Arih Modern Noodle Spicy Seaweed', 'Smoky stir-fried noodles with spicy seaweed flavour.', 'ramen', '/menu-products/arih-spicy-seaweed.png', 249, 209, 249, 'dual', 3, 'veg', 806, array['arih modern noodle spicy seaweed']::text[]),
    ('Arih Modern Noodle Gochujang Butter', 'Stir-fried noodles with gochujang and buttery flavour.', 'ramen', '/menu-products/arih-gochujang-butter.png', 249, 209, 249, 'dual', 2, 'veg', 807, array['arih modern noodle gochujang butter']::text[]),
    ('Samyang MEP Garlic & Clam (Halal)', 'Fiery garlic ramen with savoury clam flavour.', 'ramen', '/menu-products/samyang-mep-garlic-clam.png', 249, 209, 249, 'dual', 3, 'non_veg', 808, array['samyang mep garlic & clam (halal)', 'samyang mep garlic and clam', 'samyang mep garlic & clam']::text[]),
    ('Arih Modern Noodle K-Super Spicy Seaweed', 'Extra-spicy stir-fried noodles with seaweed.', 'ramen', '/menu-products/arih-k-super-spicy-seaweed.png', 249, 209, 249, 'dual', 5, 'veg', 809, array['arih modern noodle k-super spicy seaweed']::text[]),
    ('Arih Modern Noodle Soy Sauce Butter', 'Savoury soy sauce noodles with buttery flavour.', 'ramen', '/menu-products/arih-soy-sauce-butter.png', 249, 209, 249, 'dual', 1, 'veg', 810, array['arih modern noodle soy sauce butter']::text[]),
    ('Arih Modern Noodle Black Pepper Tteokbokki', 'Sweet and spicy Korean noodles with black pepper.', 'ramen', '/menu-products/arih-black-pepper-tteokbokki.png', 249, 209, 249, 'dual', 2, 'veg', 811, array['arih modern noodle black pepper tteokbokki']::text[]),
    ('Steam & Spoon Zero Sugar Drinks', 'Zero-sugar Korean drink pouches in Peach Iced Tea and Blue Lemonade flavours.', 'drink_diet', '/menu-products/steam-spoon-zero-sugar-drinks.png', 99, null, null, 'single', 0, null, 820, array['steam & spoon zero sugar drinks', 'steam and spoon zero sugar drinks']::text[])
),
updated_items as (
  update public.menu_items item
  set
    name = product_rows.target_name,
    description = product_rows.description,
    category_id = product_rows.category_id,
    image_url = product_rows.image_url,
    price = product_rows.price,
    packet_only_price = product_rows.packet_only_price,
    self_cook_price = product_rows.self_cook_price,
    price_type = product_rows.price_type,
    drink_price_type = 'single',
    has_cup_ice_option = false,
    cup_ice_available = true,
    spice_level = product_rows.spice_level,
    food_type = product_rows.food_type,
    status = 'available',
    sort_order = product_rows.sort_order,
    updated_at = now()
  from product_rows
  where lower(trim(item.name)) = any(product_rows.aliases)
  returning item.id, item.name
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
    target_name,
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
  from product_rows
  where not exists (
    select 1
    from public.menu_items item
    where lower(trim(item.name)) = any(product_rows.aliases)
       or item.image_url = product_rows.image_url
  )
  on conflict do nothing
  returning id, name
)
select 'updated_existing_items' as action, count(*)::text as row_count,
  string_agg(name, ', ' order by name) as items
from updated_items
union all
select 'inserted_missing_items' as action, count(*)::text as row_count,
  string_agg(name, ', ' order by name) as items
from inserted_items;

with drink_item as (
  select id
  from public.menu_items
  where lower(trim(name)) = 'steam & spoon zero sugar drinks'
  limit 1
),
variant_rows(variant_name, description, price, status, sort_order) as (
  values
    ('Peach Iced Tea', 'Zero-sugar peach iced tea.', 99, 'available', 1),
    ('Blue Lemonade', 'Zero-sugar blue lemonade.', 99, 'available', 2)
),
updated_variants as (
  update public.item_variants variant
  set
    description = variant_rows.description,
    price = variant_rows.price,
    status = variant_rows.status,
    image_url = null,
    sort_order = variant_rows.sort_order,
    updated_at = now()
  from drink_item, variant_rows
  where variant.menu_item_id = drink_item.id
    and lower(trim(variant.variant_name)) = lower(trim(variant_rows.variant_name))
  returning variant.id
)
insert into public.item_variants (
  menu_item_id,
  variant_name,
  description,
  price,
  status,
  image_url,
  sort_order,
  updated_at
)
select
  drink_item.id,
  variant_rows.variant_name,
  variant_rows.description,
  variant_rows.price,
  variant_rows.status,
  null,
  variant_rows.sort_order,
  now()
from drink_item
cross join variant_rows
where not exists (
  select 1
  from public.item_variants variant
  where variant.menu_item_id = drink_item.id
    and lower(trim(variant.variant_name)) = lower(trim(variant_rows.variant_name))
)
on conflict do nothing;

-- The existing Big Roll menu record keeps its current name, price and description.
-- Its deployed asset at the same URL now shows the four flavours together.
