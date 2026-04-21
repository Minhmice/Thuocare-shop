-- Nav schema: top items -> sidebar -> tiles (+ optional best sellers per sidebar)

create table if not exists public.nav_top_items (
  id text primary key,
  label text not null,
  href text,
  sort int not null default 0,
  is_active boolean not null default true
);

create index if not exists nav_top_items_active_sort_idx on public.nav_top_items (is_active, sort);

create table if not exists public.nav_sidebar_items (
  id text primary key,
  top_id text not null references public.nav_top_items (id) on delete cascade,
  label text not null,
  icon_key text not null,
  sort int not null default 0,
  is_active boolean not null default true
);

create index if not exists nav_sidebar_items_top_active_sort_idx on public.nav_sidebar_items (top_id, is_active, sort);

create table if not exists public.nav_tiles (
  id text primary key,
  sidebar_id text not null references public.nav_sidebar_items (id) on delete cascade,
  label text not null,
  icon_key text not null,
  href text,
  sort int not null default 0,
  is_active boolean not null default true
);

create index if not exists nav_tiles_sidebar_active_sort_idx on public.nav_tiles (sidebar_id, is_active, sort);

create table if not exists public.nav_best_sellers (
  sidebar_id text not null references public.nav_sidebar_items (id) on delete cascade,
  product_id text not null references public.products (id) on delete restrict,
  sort int not null default 0,
  primary key (sidebar_id, product_id)
);

create index if not exists nav_best_sellers_sidebar_sort_idx on public.nav_best_sellers (sidebar_id, sort);

