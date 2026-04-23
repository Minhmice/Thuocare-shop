-- Additional RPC endpoints for product page + search

create or replace function public.get_product_page_by_slug(p_slug text)
returns jsonb
language sql
stable
as $$
  with p as (
    select *
    from public.catalog_products
    where slug = p_slug
      and is_active = true
    limit 1
  ),
  primary_node as (
    select n.*
    from public.product_node_links l
    join public.catalog_nodes n on n.id = l.node_id
    join p on p.id = l.product_id
    where l.is_primary = true
      and n.is_active = true
    limit 1
  ),
  tags as (
    select t.*
    from public.product_tag_links ptl
    join public.tags t on t.id = ptl.tag_id
    join p on p.id = ptl.product_id
    where t.is_active = true
    order by t.tag_type asc, t.name asc
  ),
  related as (
    select rp.*
    from public.catalog_products rp
    join public.product_node_links rl on rl.product_id = rp.id
    join primary_node pn on pn.id = rl.node_id
    where rp.is_active = true
      and rp.slug <> p_slug
    order by rp.is_featured desc, rp.created_at desc
    limit 8
  )
  select jsonb_build_object(
    'product', (select to_jsonb(p) from p),
    'primaryNode', coalesce((select jsonb_build_object('id', id, 'name', name, 'routePath', route_path) from primary_node), null),
    'tags', coalesce((select jsonb_agg(jsonb_build_object('id', id, 'name', name, 'slug', slug, 'type', tag_type)) from tags), '[]'::jsonb),
    'related', coalesce((
      select jsonb_agg(jsonb_build_object('id', id, 'name', name, 'slug', slug, 'routePath', route_path, 'thumbnailUrl', thumbnail_url, 'price', price))
      from related
    ), '[]'::jsonb)
  );
$$;

create or replace function public.search_products_and_nodes(q text)
returns jsonb
language sql
stable
as $$
  with qq as (select trim(coalesce(q,'')) as q),
  products as (
    select id, name, slug, route_path, thumbnail_url, price
    from public.catalog_products, qq
    where is_active = true
      and qq.q <> ''
      and (name ilike '%'||qq.q||'%' or slug ilike '%'||qq.q||'%')
    order by is_featured desc, created_at desc
    limit 8
  ),
  nodes as (
    select id, name, slug, route_path, node_type
    from public.catalog_nodes, qq
    where is_active = true
      and qq.q <> ''
      and (name ilike '%'||qq.q||'%' or full_slug ilike '%'||qq.q||'%')
    order by parent_id nulls first, sort_order asc
    limit 8
  ),
  tags as (
    select id, name, slug, tag_type
    from public.tags, qq
    where is_active = true
      and qq.q <> ''
      and (name ilike '%'||qq.q||'%' or slug ilike '%'||qq.q||'%')
    order by tag_type asc, name asc
    limit 8
  )
  select jsonb_build_object(
    'query', (select q from qq),
    'products', coalesce((select jsonb_agg(to_jsonb(products)) from products), '[]'::jsonb),
    'nodes', coalesce((select jsonb_agg(to_jsonb(nodes)) from nodes), '[]'::jsonb),
    'tags', coalesce((select jsonb_agg(to_jsonb(tags)) from tags), '[]'::jsonb)
  );
$$;

