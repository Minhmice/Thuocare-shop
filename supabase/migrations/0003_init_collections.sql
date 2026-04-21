-- Homepage/product rails collections (product-only phase 1)

create table if not exists public.collections (
  id text primary key,
  title text,
  description text,
  type text not null,
  sort int not null default 0,
  is_active boolean not null default true
);

create index if not exists collections_active_sort_idx on public.collections (is_active, sort);

create table if not exists public.collection_items (
  collection_id text not null references public.collections (id) on delete cascade,
  product_id text not null references public.products (id) on delete restrict,
  sort int not null default 0,
  primary key (collection_id, product_id)
);

create index if not exists collection_items_collection_sort_idx on public.collection_items (collection_id, sort);

