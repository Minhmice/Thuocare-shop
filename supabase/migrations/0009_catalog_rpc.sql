-- RPC helpers for Supabase-driven navigation + pages (JSON outputs)

create or replace function public.get_header_navigation()
returns jsonb
language sql
stable
as $$
  with top_nodes as (
    select *
    from public.catalog_nodes
    where is_active = true
      and is_visible_in_nav = true
      and parent_id is null
    order by sort_order asc, name asc
  ),
  children as (
    select
      c.parent_id,
      jsonb_agg(
        jsonb_build_object(
          'id', c.id,
          'name', c.name,
          'slug', c.slug,
          'routePath', c.route_path
        )
        order by c.sort_order asc, c.name asc
      ) as children_json
    from public.catalog_nodes c
    where c.is_active = true
      and c.parent_id is not null
    group by c.parent_id
  ),
  featured_links as (
    select
      nfl.node_id,
      jsonb_agg(
        jsonb_build_object(
          'id', nfl.id,
          'type', nfl.link_type,
          'label', nfl.label,
          'description', nfl.description,
          'href', coalesce(nfl.href, tn.route_path)
        )
        order by nfl.sort_order asc, nfl.label asc
      ) as links_json
    from public.node_featured_links nfl
    left join public.catalog_nodes tn on tn.id = nfl.target_node_id
    where nfl.is_active = true
    group by nfl.node_id
  ),
  featured_products as (
    select
      nfl.node_id,
      jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'name', p.name,
          'slug', p.slug,
          'routePath', p.route_path,
          'thumbnailUrl', p.thumbnail_url,
          'price', p.price
        )
        order by nfl.sort_order asc
      ) as products_json
    from public.node_featured_links nfl
    join public.catalog_products p on p.id = nfl.product_id
    where nfl.is_active = true
      and nfl.link_type = 'featured_product'
      and p.is_active = true
    group by nfl.node_id
  )
  select jsonb_build_object(
    'items',
    coalesce(
      jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'name', t.name,
          'slug', t.slug,
          'routePath', t.route_path,
          'description', t.description,
          'children', coalesce(ch.children_json, '[]'::jsonb),
          'featuredProducts', coalesce(fp.products_json, '[]'::jsonb),
          'featuredLinks', coalesce(fl.links_json, '[]'::jsonb)
        )
      ),
      '[]'::jsonb
    )
  )
  from top_nodes t
  left join children ch on ch.parent_id = t.id
  left join featured_products fp on fp.node_id = t.id
  left join featured_links fl on fl.node_id = t.id;
$$;

create or replace function public.get_node_page_by_path(p_route_path text)
returns jsonb
language plpgsql
stable
as $$
declare
  n public.catalog_nodes;
  breadcrumb jsonb := '[]'::jsonb;
begin
  select * into n
  from public.catalog_nodes
  where route_path = p_route_path
    and is_active = true
  limit 1;

  if n.id is null then
    return null;
  end if;

  -- Breadcrumb: walk parents (max 8 to avoid loops)
  declare
    cur public.catalog_nodes;
    steps int := 0;
  begin
    cur := n;
    while cur.id is not null and steps < 8 loop
      breadcrumb :=
        jsonb_build_array(
          jsonb_build_object('id', cur.id, 'name', cur.name, 'routePath', cur.route_path)
        ) || breadcrumb;
      exit when cur.parent_id is null;
      select * into cur from public.catalog_nodes where id = cur.parent_id limit 1;
      steps := steps + 1;
    end loop;
  end;

  return jsonb_build_object(
    'node', jsonb_build_object(
      'id', n.id,
      'name', n.name,
      'slug', n.slug,
      'routePath', n.route_path,
      'description', n.description,
      'heroTitle', n.hero_title,
      'heroDescription', n.hero_description,
      'seoTitle', n.seo_title,
      'seoDescription', n.seo_description
    ),
    'breadcrumb', breadcrumb,
    'children', coalesce((
      select jsonb_agg(
        jsonb_build_object('id', c.id, 'name', c.name, 'slug', c.slug, 'routePath', c.route_path)
        order by c.sort_order asc, c.name asc
      )
      from public.catalog_nodes c
      where c.parent_id = n.id and c.is_active = true
    ), '[]'::jsonb),
    'featuredLinks', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', nfl.id,
          'type', nfl.link_type,
          'label', nfl.label,
          'description', nfl.description,
          'href', coalesce(nfl.href, tn.route_path)
        )
        order by nfl.sort_order asc, nfl.label asc
      )
      from public.node_featured_links nfl
      left join public.catalog_nodes tn on tn.id = nfl.target_node_id
      where nfl.node_id = n.id and nfl.is_active = true and nfl.link_type <> 'featured_product'
    ), '[]'::jsonb),
    'productPreview', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', p.id,
          'name', p.name,
          'slug', p.slug,
          'routePath', p.route_path,
          'thumbnailUrl', p.thumbnail_url,
          'price', p.price
        )
        order by l.sort_order asc
      )
      from public.product_node_links l
      join public.catalog_products p on p.id = l.product_id
      where l.node_id = n.id and p.is_active = true
      limit 24
    ), '[]'::jsonb)
  );
end;
$$;

