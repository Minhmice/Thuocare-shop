-- RLS enablement + public read policies for content tables
-- NOTE: orders writes are server-only in phase 1.

-- Enable RLS
alter table public.brands enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.articles enable row level security;
alter table public.nav_top_items enable row level security;
alter table public.nav_sidebar_items enable row level security;
alter table public.nav_tiles enable row level security;
alter table public.nav_best_sellers enable row level security;
alter table public.collections enable row level security;
alter table public.collection_items enable row level security;

-- Public read policies (anon + authenticated)
drop policy if exists brands_read on public.brands;
create policy brands_read
on public.brands for select
using (is_active = true);

drop policy if exists categories_read on public.categories;
create policy categories_read
on public.categories for select
using (is_active = true);

drop policy if exists products_read on public.products;
create policy products_read
on public.products for select
using (is_active = true);

drop policy if exists product_images_read on public.product_images;
create policy product_images_read
on public.product_images for select
using (true);

drop policy if exists articles_read on public.articles;
create policy articles_read
on public.articles for select
using (is_active = true);

drop policy if exists nav_top_items_read on public.nav_top_items;
create policy nav_top_items_read
on public.nav_top_items for select
using (is_active = true);

drop policy if exists nav_sidebar_items_read on public.nav_sidebar_items;
create policy nav_sidebar_items_read
on public.nav_sidebar_items for select
using (is_active = true);

drop policy if exists nav_tiles_read on public.nav_tiles;
create policy nav_tiles_read
on public.nav_tiles for select
using (is_active = true);

drop policy if exists nav_best_sellers_read on public.nav_best_sellers;
create policy nav_best_sellers_read
on public.nav_best_sellers for select
using (true);

drop policy if exists collections_read on public.collections;
create policy collections_read
on public.collections for select
using (is_active = true);

drop policy if exists collection_items_read on public.collection_items;
create policy collection_items_read
on public.collection_items for select
using (true);

-- Explicitly enable reads via PostgREST roles
grant usage on schema public to anon, authenticated;
grant select on
  public.brands,
  public.categories,
  public.products,
  public.product_images,
  public.articles,
  public.nav_top_items,
  public.nav_sidebar_items,
  public.nav_tiles,
  public.nav_best_sellers,
  public.collections,
  public.collection_items
to anon, authenticated;

-- Do not grant insert/update/delete on orders in phase 1
revoke all on public.orders from anon, authenticated;
revoke all on public.order_items from anon, authenticated;

