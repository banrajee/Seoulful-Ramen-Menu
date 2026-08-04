create extension if not exists pgcrypto;

create table if not exists public.item_variants (
  id uuid primary key default gen_random_uuid(),
  menu_item_id uuid not null references public.menu_items(id) on delete cascade,
  variant_name text not null,
  price numeric(10, 2) not null check (price >= 0),
  status text not null default 'available' check (status in ('available', 'out_of_stock', 'hidden')),
  image_url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
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

drop trigger if exists set_item_variants_updated_at on public.item_variants;
create trigger set_item_variants_updated_at
before update on public.item_variants
for each row execute function public.set_updated_at();

alter table public.item_variants enable row level security;

drop policy if exists "Public can read item variants" on public.item_variants;
create policy "Public can read item variants"
on public.item_variants for select
to anon, authenticated
using (true);

drop policy if exists "Owner can manage item variants" on public.item_variants;
create policy "Owner can manage item variants"
on public.item_variants for all
to authenticated
using (true)
with check (true);

create unique index if not exists item_variants_item_name_unique
on public.item_variants (menu_item_id, lower(trim(variant_name)));

do $$
begin
  alter publication supabase_realtime add table public.item_variants;
exception
  when duplicate_object then null;
end $$;
