-- Import scraped LongChau products.json into schema v2 (minimal durable)
--
-- Goal: 1 SQL script, safe rerun (upsert), no app code needed.
--
-- How to use (Supabase Dashboard):
-- 1) Run migrations first: supabase/migrations/0001..0006
-- 2) Create table `staging_longchau_products` (this script does it)
-- 3) Import JSON:
--    - Table Editor -> staging_longchau_products -> Import data
--    - Import `src/data/longchau/products.json` as JSON
--    - Map each array element into one row, column `doc` (jsonb)
--      If UI asks: choose "JSON" import, target column `doc`.
-- 4) Run rest of this script (transform + upsert)
--
-- Notes:
-- - brand/category id use full path slug (keepPath), per your choice
-- - compare_at_amount: 0 or <= price => NULL (avoid constraint fail)
-- - benefit_tag array => first element text (or NULL)
-- - ingredients_html:
--    - if string => keep
--    - if array objects => turn into <ul><li>name shortDescription</li>..</ul>
--
begin;

-- 0) staging table
create table if not exists public.staging_longchau_products (
  id bigserial primary key,
  doc jsonb not null,
  imported_at timestamptz not null default now()
);

-- optional: wipe staging if you want clean rerun
-- truncate table public.staging_longchau_products;

-- 1) helpers
create or replace function public._lc_first_text(j jsonb)
returns text
language sql
immutable
as $$
  select case
    when j is null then null
    when jsonb_typeof(j) = 'string' then j #>> '{}'
    when jsonb_typeof(j) = 'array' and jsonb_array_length(j) > 0 then (j->0) #>> '{}'
    else null
  end
$$;

create or replace function public._lc_ingredients_to_html(j jsonb)
returns text
language sql
immutable
as $$
  select case
    when j is null then null
    when jsonb_typeof(j) = 'string' then nullif(j #>> '{}', '')
    when jsonb_typeof(j) = 'array' then (
      select
        case when count(*) = 0 then null
        else '<ul>' || string_agg(
          '<li>' ||
            coalesce(nullif(e->>'name',''), '—') ||
            case
              when coalesce(nullif(e->>'shortDescription',''),'') <> '' then ' - ' || e->>'shortDescription'
              else ''
            end ||
          '</li>',
          ''
        ) || '</ul>'
        end
      from jsonb_array_elements(j) e
    )
    else null
  end
$$;

-- 2) upsert brands
with src as (
  select
    (doc->'brand'->>'slug')::text as id,
    (doc->'brand'->>'name')::text as name,
    (doc->'brand'->>'slug')::text as slug,
    nullif((doc->'brand'->>'country')::text, '') as country
  from public.staging_longchau_products
  where doc ? 'brand'
    and (doc->'brand'->>'slug') is not null
)
insert into public.brands (id, name, slug, country, is_active, sort)
select
  id,
  coalesce(nullif(name,''), id) as name,
  id as slug,
  country,
  true,
  0
from (
  select distinct id, name, slug, country from src
) d
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  country = excluded.country,
  is_active = true;

-- 3) upsert categories (ensure parent rows exist too)
with cats as (
  select distinct
    (doc->'category'->>'slug')::text as slug,
    (doc->'category'->>'name')::text as name,
    nullif((doc->'category'->>'parent_slug')::text, '') as parent_slug
  from public.staging_longchau_products
  where doc ? 'category'
    and (doc->'category'->>'slug') is not null
),
parents as (
  select distinct parent_slug as slug
  from cats
  where parent_slug is not null
),
all_rows as (
  select slug, name, parent_slug from cats
  union all
  select slug, null::text as name, null::text as parent_slug from parents
)
insert into public.categories (id, name, slug, parent_id, is_active, sort)
select
  slug as id,
  coalesce(nullif(name,''), slug) as name,
  slug,
  parent_slug as parent_id,
  true,
  0
from (
  select distinct slug, name, parent_slug from all_rows
) d
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  parent_id = excluded.parent_id,
  is_active = true;

-- 4) upsert products
with src as (
  select
    (doc->>'id')::text as id,
    (doc->>'slug')::text as slug,
    (doc->>'title')::text as title,
    nullif((doc->>'short_title')::text,'') as short_title,
    nullif((doc->'brand'->>'slug')::text,'') as brand_id,
    nullif((doc->'category'->>'slug')::text,'') as category_id,
    nullif((doc->>'image_url')::text,'') as image_url,
    coalesce(nullif((doc->>'price_amount')::int, 0), 0) as price_amount,
    nullif((doc->>'compare_at_amount')::int, 0) as compare_at_amount_raw,
    nullif((doc->>'unit')::text,'') as unit,
    nullif((doc->>'pack_note')::text,'') as pack_note,
    nullif((doc->>'origin_label')::text,'') as origin_label,
    nullif((doc->>'country')::text,'') as country,
    nullif((doc->>'badge')::text,'') as badge,
    public._lc_first_text(doc->'benefit_tag') as benefit_tag,
    nullif((doc->>'format_tag')::text,'') as format_tag,
    nullif((doc->>'trust_label')::text,'') as trust_label,
    nullif((doc->>'short_description')::text,'') as short_description,
    nullif((doc->>'description_html')::text,'') as description_html,
    nullif((doc->>'usage_html')::text,'') as usage_html,
    public._lc_ingredients_to_html(doc->'ingredients_html') as ingredients_html,
    coalesce(nullif((doc->>'stock_qty')::int, 0), 0) as stock_qty
  from public.staging_longchau_products
  where (doc->>'id') is not null
    and (doc->>'slug') is not null
    and (doc->>'title') is not null
),
clean as (
  select
    id, slug, title, short_title,
    brand_id, category_id, image_url,
    price_amount,
    case
      when compare_at_amount_raw is null then null
      when compare_at_amount_raw <= price_amount then null
      else compare_at_amount_raw
    end as compare_at_amount,
    unit, pack_note, origin_label, country, badge,
    nullif(benefit_tag,'') as benefit_tag,
    format_tag, trust_label,
    short_description, description_html, usage_html, ingredients_html,
    stock_qty
  from src
)
insert into public.products (
  id, slug, title, short_title,
  brand_id, category_id,
  image_url,
  price_amount, compare_at_amount,
  unit, pack_note, origin_label, country,
  badge, benefit_tag, format_tag, trust_label,
  short_description, description_html, usage_html, ingredients_html,
  stock_qty, is_active, sort
)
select
  id, slug, title, short_title,
  brand_id, category_id,
  image_url,
  price_amount, compare_at_amount,
  unit, pack_note, origin_label, country,
  badge, benefit_tag, format_tag, trust_label,
  short_description, description_html, usage_html, ingredients_html,
  stock_qty, true, 0
from clean
on conflict (id) do update
set
  slug = excluded.slug,
  title = excluded.title,
  short_title = excluded.short_title,
  brand_id = excluded.brand_id,
  category_id = excluded.category_id,
  image_url = excluded.image_url,
  price_amount = excluded.price_amount,
  compare_at_amount = excluded.compare_at_amount,
  unit = excluded.unit,
  pack_note = excluded.pack_note,
  origin_label = excluded.origin_label,
  country = excluded.country,
  badge = excluded.badge,
  benefit_tag = excluded.benefit_tag,
  format_tag = excluded.format_tag,
  trust_label = excluded.trust_label,
  short_description = excluded.short_description,
  description_html = excluded.description_html,
  usage_html = excluded.usage_html,
  ingredients_html = excluded.ingredients_html,
  stock_qty = excluded.stock_qty,
  is_active = true;

-- 5) product_images (dev reset per product, then insert)
with imgs as (
  select
    (doc->>'id')::text as product_id,
    img.value::text as image_url,
    (img.ordinality - 1)::int as sort
  from public.staging_longchau_products s
  cross join lateral jsonb_array_elements_text(s.doc->'images') with ordinality as img(value, ordinality)
  where (s.doc->>'id') is not null
    and jsonb_typeof(s.doc->'images') = 'array'
)
delete from public.product_images pi
using (select distinct product_id from imgs) d
where pi.product_id = d.product_id;

insert into public.product_images (product_id, image_url, sort)
select product_id, image_url, sort
from imgs
where nullif(image_url,'') is not null;

commit;

-- quick sanity checks
-- select count(*) from public.products;
-- select count(*) from public.product_images;
-- select slug, title, price_amount from public.products order by created_at desc limit 10;

