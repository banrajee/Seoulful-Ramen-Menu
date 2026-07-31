create extension if not exists pgcrypto;

create table if not exists public.categories (
  id text primary key,
  name text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.menu_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  price numeric(10, 2) not null check (price >= 0),
  category_id text not null references public.categories(id) on delete cascade,
  image_url text,
  spice_level integer not null default 1 check (spice_level between 0 and 5),
  status text not null default 'available' check (status in ('available', 'out_of_stock', 'hidden')),
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Supporting setting for the owner's global "show or hide out-of-stock items" choice.
create table if not exists public.shop_settings (
  id text primary key default 'default',
  show_out_of_stock boolean not null default true,
  updated_at timestamptz not null default now()
);

alter table public.menu_items
add column if not exists spice_level integer not null default 1 check (spice_level between 0 and 5);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_menu_items_updated_at on public.menu_items;
create trigger set_menu_items_updated_at
before update on public.menu_items
for each row execute function public.set_updated_at();

drop trigger if exists set_shop_settings_updated_at on public.shop_settings;
create trigger set_shop_settings_updated_at
before update on public.shop_settings
for each row execute function public.set_updated_at();

alter table public.categories enable row level security;
alter table public.menu_items enable row level security;
alter table public.shop_settings enable row level security;

drop policy if exists "Public can read categories" on public.categories;
create policy "Public can read categories"
on public.categories for select
to anon, authenticated
using (true);

drop policy if exists "Public can read menu items" on public.menu_items;
create policy "Public can read menu items"
on public.menu_items for select
to anon, authenticated
using (true);

drop policy if exists "Public can read shop settings" on public.shop_settings;
create policy "Public can read shop settings"
on public.shop_settings for select
to anon, authenticated
using (true);

drop policy if exists "Owner can manage categories" on public.categories;
create policy "Owner can manage categories"
on public.categories for all
to authenticated
using (true)
with check (true);

drop policy if exists "Owner can manage menu items" on public.menu_items;
create policy "Owner can manage menu items"
on public.menu_items for all
to authenticated
using (true)
with check (true);

drop policy if exists "Owner can manage shop settings" on public.shop_settings;
create policy "Owner can manage shop settings"
on public.shop_settings for all
to authenticated
using (true)
with check (true);

insert into public.categories (id, name, sort_order) values
  ('classic', 'Classic Collection', 1),
  ('premium', 'Premium Collection', 2),
  ('signature', 'Signature Collection', 3),
  ('addons', 'Add-Ons', 4),
  ('yopokki', 'Yopokki Rice Cakes', 5),
  ('drinks', 'Drinks', 6),
  ('drink_soda', 'Soda', 7),
  ('drink_non_soda', 'Non-Soda', 8),
  ('drink_diet', 'Diet', 9)
on conflict (id) do update set
  name = excluded.name,
  sort_order = excluded.sort_order;

insert into public.shop_settings (id, show_out_of_stock)
values ('default', true)
on conflict (id) do nothing;

insert into public.menu_items (name, description, price, category_id, image_url, status, sort_order) values
  ('Nongshim Shin Ramyeon', 'Original spicy Korean ramen.', 189, 'classic', null, 'available', 1),
  ('Nongshim Shin Kimchi', 'Spicy ramen with kimchi flavour.', 189, 'classic', null, 'available', 2),
  ('Nongshim Soon Veggie', 'Vegetable ramen with mild spice.', 189, 'classic', null, 'available', 3),
  ('Ottogi Jin Ramen Mild', 'Mild Korean ramen broth.', 189, 'classic', null, 'available', 4),
  ('Ottogi Jin Ramen Spicy', 'Spicy Korean ramen broth.', 189, 'classic', null, 'available', 5),
  ('Paldo Kokomen', 'Clean chicken-style spicy ramen.', 189, 'classic', null, 'available', 6),
  ('Paldo Seafood', 'Seafood-style spicy ramen.', 189, 'classic', null, 'available', 7),
  ('Paldo Namja Ramyun', 'Bold Korean ramyun broth.', 189, 'classic', null, 'available', 8),
  ('Samyang Carbonara', 'Creamy spicy ramen.', 219, 'premium', null, 'available', 1),
  ('Samyang Cheese', 'Spicy ramen with cheese.', 219, 'premium', null, 'available', 2),
  ('Samyang Rose', 'Rose-style creamy ramen.', 219, 'premium', null, 'available', 3),
  ('Samyang Original', 'Original spicy Samyang ramen.', 219, 'premium', null, 'available', 4),
  ('Samyang Black', 'Rich spicy Samyang ramen.', 219, 'premium', null, 'available', 5),
  ('Samyang Jjajang', 'Black bean spicy ramen.', 219, 'premium', null, 'available', 6),
  ('Samyang Habanero Lime', 'Hot ramen with lime flavour.', 219, 'premium', null, 'available', 7),
  ('Samyang Hot Chicken Stew', 'Stew-style spicy ramen.', 219, 'premium', null, 'available', 8),
  ('Samyang 3x', 'Extra hot Samyang ramen.', 219, 'premium', null, 'available', 9),
  ('Paldo Volcano Carbonara', 'Creamy volcano-style ramen.', 219, 'premium', null, 'available', 10),
  ('Paldo Samgyetang', 'Chicken soup-style ramen.', 219, 'premium', null, 'available', 11),
  ('Nongshim Shin Toomba', 'Creamy premium Shin ramen.', 249, 'signature', null, 'available', 1),
  ('Nongshim Shin Cheese Stir Fry', 'Cheese stir-fry noodles.', 249, 'signature', null, 'available', 2),
  ('Ottogi Cheese Ramen', 'Cheesy Korean ramen.', 249, 'signature', null, 'available', 3),
  ('Ottogi Spicy Stir Fry', 'Spicy dry-style ramen.', 249, 'signature', null, 'available', 4),
  ('Paldo Rabokki', 'Ramen and rice cake flavour.', 249, 'signature', null, 'available', 5),
  ('Paldo Jjajangmen', 'Black bean sauce ramen.', 249, 'signature', null, 'available', 6),
  ('Paldo Zangmyeon Loopy', 'Signature Paldo ramen.', 249, 'signature', null, 'available', 7),
  ('Paldo Lobster', 'Lobster-style seafood ramen.', 249, 'signature', null, 'available', 8),
  ('Raw Egg', 'Fresh egg add-on.', 15, 'addons', null, 'available', 1),
  ('Boiled Egg', 'Boiled egg add-on.', 19, 'addons', null, 'available', 2),
  ('Corn', 'Sweet corn add-on.', 19, 'addons', null, 'available', 3),
  ('Corn Dog', 'Crispy corn dog add-on.', 49, 'addons', null, 'available', 4),
  ('Cheese', 'Cheese slice add-on.', 19, 'addons', null, 'available', 5),
  ('Shredded Chicken', 'Shredded chicken add-on.', 29, 'addons', null, 'available', 6),
  ('Spicy Carbonara Yopokki', 'Rice cakes in a creamy spicy sauce cup.', 359, 'yopokki', null, 'available', 1),
  ('Hot & Spicy Yopokki', 'Chewy rice cakes with classic fiery sauce.', 359, 'yopokki', null, 'available', 2),
  ('Sweet & Spicy Yopokki', 'Rice cakes with sweet spicy sauce.', 359, 'yopokki', null, 'available', 3),
  ('Cheese Yopokki', 'Rice cakes with cheese sauce.', 359, 'yopokki', null, 'available', 4)
on conflict do nothing;

do $$
begin
  alter publication supabase_realtime add table public.categories;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.menu_items;
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter publication supabase_realtime add table public.shop_settings;
exception
  when duplicate_object then null;
end $$;
