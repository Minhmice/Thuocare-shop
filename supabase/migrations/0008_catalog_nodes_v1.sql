-- catalog_nodes v1 (core tree) + product tagging/linking + featured links
-- Keeps legacy categories/nav tables intact; new RPC will read from these tables.

create extension if not exists pgcrypto;

create table if not exists public.catalog_nodes (
  id uuid primary key default gen_random_uuid(),
  node_type text not null,
  parent_id uuid references public.catalog_nodes (id) on delete restrict,
  name text not null,
  slug text not null,
  full_slug text not null,
  route_path text not null unique,
  description text,
  nav_description text,
  hero_title text,
  hero_description text,
  sort_order int not null default 0,
  is_active boolean not null default true,
  is_visible_in_nav boolean not null default false,
  seo_title text,
  seo_description text,
  cover_image_url text,
  icon_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint catalog_nodes_full_slug_unique unique (full_slug)
);

create index if not exists catalog_nodes_parent_sort_idx on public.catalog_nodes (parent_id, sort_order);
create index if not exists catalog_nodes_active_sort_idx on public.catalog_nodes (is_active, sort_order);
create index if not exists catalog_nodes_nav_active_sort_idx on public.catalog_nodes (is_visible_in_nav, is_active, sort_order);

-- New products table (v3) for canonical /san-pham/:slug, independent from legacy products.
create table if not exists public.catalog_products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  route_path text not null unique,
  short_description text,
  description text,
  brand_name text,
  sku text,
  thumbnail_url text,
  gallery jsonb,
  price numeric,
  compare_at_price numeric,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  seo_title text,
  seo_description text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists catalog_products_active_idx on public.catalog_products (is_active);
create index if not exists catalog_products_featured_active_idx on public.catalog_products (is_featured, is_active);

create table if not exists public.product_node_links (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.catalog_products (id) on delete cascade,
  node_id uuid not null references public.catalog_nodes (id) on delete cascade,
  is_primary boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  constraint product_node_links_unique unique (product_id, node_id)
);

-- Enforce at most one primary node per product.
create unique index if not exists product_node_links_one_primary_per_product
  on public.product_node_links (product_id)
  where (is_primary = true);

create index if not exists product_node_links_node_sort_idx on public.product_node_links (node_id, sort_order);

create table if not exists public.tags (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  tag_type text not null,
  description text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists tags_type_active_idx on public.tags (tag_type, is_active);

create table if not exists public.product_tag_links (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.catalog_products (id) on delete cascade,
  tag_id uuid not null references public.tags (id) on delete cascade,
  created_at timestamptz not null default now(),
  constraint product_tag_links_unique unique (product_id, tag_id)
);

create index if not exists product_tag_links_product_idx on public.product_tag_links (product_id);
create index if not exists product_tag_links_tag_idx on public.product_tag_links (tag_id);

create table if not exists public.node_featured_links (
  id uuid primary key default gen_random_uuid(),
  node_id uuid not null references public.catalog_nodes (id) on delete cascade,
  link_type text not null,
  label text not null,
  description text,
  href text,
  product_id uuid references public.catalog_products (id) on delete set null,
  target_node_id uuid references public.catalog_nodes (id) on delete set null,
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists node_featured_links_node_sort_idx on public.node_featured_links (node_id, is_active, sort_order);

-- updated_at triggers
drop trigger if exists catalog_nodes_set_updated_at on public.catalog_nodes;
create trigger catalog_nodes_set_updated_at
before update on public.catalog_nodes
for each row execute function public.set_updated_at();

drop trigger if exists catalog_products_set_updated_at on public.catalog_products;
create trigger catalog_products_set_updated_at
before update on public.catalog_products
for each row execute function public.set_updated_at();

