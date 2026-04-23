-- Drop legacy v1/v2 tables after Supabase-only cutover to catalog_nodes/catalog_products.
-- WARNING: irreversible. Ensure app no longer references these tables before applying.

drop table if exists public.nav_best_sellers cascade;
drop table if exists public.nav_tiles cascade;
drop table if exists public.nav_sidebar_items cascade;
drop table if exists public.nav_top_items cascade;

drop table if exists public.collection_items cascade;
drop table if exists public.collections cascade;

drop table if exists public.product_images cascade;
drop table if exists public.products cascade;
drop table if exists public.categories cascade;
drop table if exists public.brands cascade;

drop table if exists public.order_items cascade;
drop table if exists public.orders cascade;

