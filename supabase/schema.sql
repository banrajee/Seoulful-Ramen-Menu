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
  ('yopokki', 'Yopokki Rice Cakes', 5)
on conflict (id) do update set
  name = excluded.name,
  sort_order = excluded.sort_order;

insert into public.shop_settings (id, show_out_of_stock)
values ('default', true)
on conflict (id) do nothing;

insert into public.menu_items (name, description, price, category_id, image_url, status, sort_order) values
  ('Nongshim Shin Ramyeon', 'Original spicy Korean ramen with rich broth.', 189, 'classic', null, 'available', 1),
  ('Nongshim Shin Kimchi', 'Classic Shin heat with bright kimchi flavor.', 189, 'classic', null, 'available', 2),
  ('Nongshim Soon Veggie', 'Mild vegetable ramen with clean savory notes.', 189, 'classic', null, 'out_of_stock', 3),
  ('Ottogi Jin Ramen Mild', 'Comforting mild broth for an easy bowl.', 189, 'classic', null, 'available', 4),
  ('Paldo Seafood', 'Seafood-style broth with a clean spicy finish.', 189, 'classic', null, 'available', 5),
  ('Samyang Carbonara', 'Creamy, spicy buldak-style ramen.', 219, 'premium', null, 'available', 1),
  ('Samyang Cheese', 'Hot chicken ramen with a cheesy kick.', 219, 'premium', null, 'available', 2),
  ('Samyang Rose', 'Creamy rose-style heat with smooth spice.', 219, 'premium', null, 'available', 3),
  ('Samyang 3x', 'Extra fiery ramen for serious spice lovers.', 219, 'premium', null, 'hidden', 4),
  ('Nongshim Shin Toomba', 'Creamy premium Shin ramen with deep spice.', 249, 'signature', null, 'available', 1),
  ('Nongshim Shin Cheese Stir Fry', 'Dry-style noodles with cheese and chili.', 249, 'signature', null, 'available', 2),
  ('Paldo Lobster', 'Signature seafood ramen with bold broth.', 249, 'signature', null, 'out_of_stock', 3),
  ('Raw Egg', 'Add a fresh egg to cook into the broth.', 15, 'addons', null, 'available', 1),
  ('Boiled Egg', 'Simple boiled egg topping.', 19, 'addons', null, 'available', 2),
  ('Cheese', 'Melty cheese slice for a richer bowl.', 19, 'addons', null, 'available', 3),
  ('Shredded Chicken', 'Protein topping for extra bite.', 29, 'addons', null, 'available', 4),
  ('Spicy Carbonara Yopokki', 'Rice cakes in a creamy spicy sauce cup.', 359, 'yopokki', null, 'available', 1),
  ('Hot & Spicy Yopokki', 'Chewy rice cakes with classic fiery sauce.', 359, 'yopokki', null, 'available', 2)
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
