-- Catalog core: brands, categories, products, product_images
-- Minimal durable schema (phase 1)

create table if not exists public.brands (
  id text primary key,
  name text not null,
  slug text not null unique,
  logo_url text,
  country text,
  is_active boolean not null default true,
  sort int not null default 0
);

create index if not exists brands_active_sort_idx on public.brands (is_active, sort);

create table if not exists public.categories (
  id text primary key,
  name text not null,
  slug text not null unique,
  parent_id text references public.categories (id) on delete set null,
  is_active boolean not null default true,
  sort int not null default 0
);

create index if not exists categories_parent_idx on public.categories (parent_id);
create index if not exists categories_active_sort_idx on public.categories (is_active, sort);

create table if not exists public.products (
  id text primary key,
  slug text not null unique,
  title text not null,
  short_title text,
  brand_id text references public.brands (id) on delete set null,
  category_id text references public.categories (id) on delete set null,
  image_url text,
  price_amount int not null,
  compare_at_amount int,
  unit text,
  pack_note text,
  origin_label text,
  country text,
  badge text,
  benefit_tag text,
  format_tag text,
  trust_label text,
  short_description text,
  description_html text,
  usage_html text,
  ingredients_html text,
  stock_qty int not null default 0,
  is_active boolean not null default true,
  sort int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint products_price_amount_nonneg check (price_amount >= 0),
  constraint products_compare_at_amount_valid check (compare_at_amount is null or compare_at_amount >= price_amount),
  constraint products_stock_qty_nonneg check (stock_qty >= 0)
);

create index if not exists products_active_sort_idx on public.products (is_active, sort);
create index if not exists products_category_active_sort_idx on public.products (category_id, is_active, sort);
create index if not exists products_brand_active_sort_idx on public.products (brand_id, is_active, sort);
create index if not exists products_price_amount_idx on public.products (price_amount);

create table if not exists public.product_images (
  id bigserial primary key,
  product_id text not null references public.products (id) on delete cascade,
  image_url text not null,
  sort int not null default 0
);

create index if not exists product_images_product_sort_idx on public.product_images (product_id, sort);

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute function public.set_updated_at();

