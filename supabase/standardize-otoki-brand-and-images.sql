-- Standardize the current official OTOKI English brand spelling and local image paths.
-- Old Ottogi/Otogi spellings are included so this remains safe to run after partial manual edits.

update public.menu_items
set
  name = case
    when lower(trim(name)) in ('ottogi jin ramen mild', 'otogi jin ramen mild', 'otoki jin ramen mild') then 'Otoki Jin Ramen Mild'
    when lower(trim(name)) in ('ottogi jin ramen spicy', 'otogi jin ramen spicy', 'otoki jin ramen spicy') then 'Otoki Jin Ramen Spicy'
    when lower(trim(name)) in ('ottogi jin chicken', 'otogi jin chicken', 'otoki jin chicken') then 'Otoki Jin Chicken'
    when lower(trim(name)) in ('ottogi cheese ramen', 'otogi cheese ramen', 'otoki cheese ramen') then 'Otoki Cheese Ramen'
    when lower(trim(name)) in ('ottogi spicy stir fry', 'otogi spicy stir fry', 'otoki spicy stir fry') then 'Otoki Spicy Stir Fry'
    else name
  end,
  image_url = case
    when lower(trim(name)) in ('ottogi jin ramen mild', 'otogi jin ramen mild', 'otoki jin ramen mild') then '/menu-products/otoki-jin-ramen-mild.png'
    when lower(trim(name)) in ('ottogi jin ramen spicy', 'otogi jin ramen spicy', 'otoki jin ramen spicy') then '/menu-products/otoki-jin-ramen-spicy.png'
    when lower(trim(name)) in ('ottogi jin chicken', 'otogi jin chicken', 'otoki jin chicken') then '/menu-products/otoki-jin-chicken.png'
    when lower(trim(name)) in ('ottogi cheese ramen', 'otogi cheese ramen', 'otoki cheese ramen') then '/menu-products/otoki-cheese-ramen.png'
    when lower(trim(name)) in ('ottogi spicy stir fry', 'otogi spicy stir fry', 'otoki spicy stir fry') then '/menu-products/otoki-spicy-stir-fry.png'
    else image_url
  end
where category_id = 'ramen'
  and lower(trim(name)) in (
    'ottogi jin ramen mild', 'otogi jin ramen mild', 'otoki jin ramen mild',
    'ottogi jin ramen spicy', 'otogi jin ramen spicy', 'otoki jin ramen spicy',
    'ottogi jin chicken', 'otogi jin chicken', 'otoki jin chicken',
    'ottogi cheese ramen', 'otogi cheese ramen', 'otoki cheese ramen',
    'ottogi spicy stir fry', 'otogi spicy stir fry', 'otoki spicy stir fry'
  );
