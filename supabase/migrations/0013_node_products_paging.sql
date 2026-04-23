-- Paginated node products listing (direct + descendants 1-level)

create or replace function public.get_node_products_by_path(
  p_route_path text,
  p_page int default 1,
  p_page_size int default 24,
  p_sort text default 'featured'
)
returns jsonb
language plpgsql
stable
as $$
declare
  n public.catalog_nodes;
  v_page int := greatest(coalesce(p_page, 1), 1);
  v_page_size int := least(greatest(coalesce(p_page_size, 24), 1), 96);
  v_offset int := (v_page - 1) * v_page_size;
  v_total bigint := 0;
  v_items jsonb := '[]'::jsonb;
begin
  select * into n
  from public.catalog_nodes
  where route_path = p_route_path
    and is_active = true
  limit 1;

  if n.id is null then
    return null;
  end if;

  with scope_nodes as (
    select n.id as node_id
    union
    select c.id as node_id
    from public.catalog_nodes c
    where c.parent_id = n.id
      and c.is_active = true
  ),
  base as (
    select
      p.id,
      p.name,
      p.slug,
      p.route_path,
      p.thumbnail_url,
      p.price,
      p.is_featured,
      p.created_at
    from public.product_node_links l
    join scope_nodes s on s.node_id = l.node_id
    join public.catalog_products p on p.id = l.product_id
    where p.is_active = true
  ),
  dedup as (
    select distinct on (id)
      id, name, slug, route_path, thumbnail_url, price, is_featured, created_at
    from base
    order by id, is_featured desc, created_at desc
  ),
  counted as (
    select count(*)::bigint as total_count from dedup
  ),
  sorted as (
    select *
    from dedup
    order by
      case when p_sort = 'featured' then is_featured end desc nulls last,
      case when p_sort = 'newest' then created_at end desc nulls last,
      case when p_sort = 'price_asc' then price end asc nulls last,
      case when p_sort = 'price_desc' then price end desc nulls last,
      is_featured desc,
      created_at desc,
      id asc
    offset v_offset
    limit v_page_size
  )
  select
    (select total_count from counted),
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', s.id,
          'name', s.name,
          'slug', s.slug,
          'routePath', s.route_path,
          'thumbnailUrl', s.thumbnail_url,
          'price', s.price
        )
      ),
      '[]'::jsonb
    )
  into v_total, v_items
  from sorted s;

  return jsonb_build_object(
    'node', jsonb_build_object('id', n.id, 'name', n.name, 'routePath', n.route_path),
    'page', v_page,
    'pageSize', v_page_size,
    'totalCount', v_total,
    'items', v_items
  );
end;
$$;

