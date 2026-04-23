-- RLS + public read policies for new catalog_* tables

alter table public.catalog_nodes enable row level security;
alter table public.catalog_products enable row level security;
alter table public.product_node_links enable row level security;
alter table public.tags enable row level security;
alter table public.product_tag_links enable row level security;
alter table public.node_featured_links enable row level security;

drop policy if exists catalog_nodes_read on public.catalog_nodes;
create policy catalog_nodes_read
on public.catalog_nodes for select
using (is_active = true);

drop policy if exists catalog_products_read on public.catalog_products;
create policy catalog_products_read
on public.catalog_products for select
using (is_active = true);

drop policy if exists product_node_links_read on public.product_node_links;
create policy product_node_links_read
on public.product_node_links for select
using (true);

drop policy if exists tags_read on public.tags;
create policy tags_read
on public.tags for select
using (is_active = true);

drop policy if exists product_tag_links_read on public.product_tag_links;
create policy product_tag_links_read
on public.product_tag_links for select
using (true);

drop policy if exists node_featured_links_read on public.node_featured_links;
create policy node_featured_links_read
on public.node_featured_links for select
using (is_active = true);

grant select on
  public.catalog_nodes,
  public.catalog_products,
  public.product_node_links,
  public.tags,
  public.product_tag_links,
  public.node_featured_links
to anon, authenticated;

