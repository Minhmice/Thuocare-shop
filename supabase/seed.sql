-- Dev seed for schema v2 (minimal durable)
-- Paste into Supabase SQL Editor AFTER running migrations.
-- Idempotent via ON CONFLICT upserts.

begin;

-- brands
insert into public.brands (id, name, slug, country, sort)
values
  ('blackmores','Blackmores','blackmores','Úc',1),
  ('abbott','Abbott','abbott','Mỹ',2),
  ('cetaphil','Cetaphil','cetaphil','Canada',3),
  ('panadol','Panadol','panadol','Anh',4),
  ('natures-way','Nature’s Way','natures-way','Úc',5),
  ('omron','Omron','omron','Nhật',6),
  ('dolexphar','Dolexphar','dolexphar','Việt Nam',7)
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  country = excluded.country,
  sort = excluded.sort,
  is_active = true;

-- categories
insert into public.categories (id, name, slug, parent_id, sort)
values
  ('tpcn','Thực phẩm chức năng','thuc-pham-chuc-nang',null,1),
  ('noi-tiet','Sinh lý - Nội tiết tố','sinh-ly-noi-tiet-to','tpcn',10),
  ('sinh-ly-nam','Sinh lý nam','sinh-ly-nam','noi-tiet',11)
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  parent_id = excluded.parent_id,
  sort = excluded.sort,
  is_active = true;

-- catalog_nodes (new core tree)
insert into public.catalog_nodes (
  id, node_type, parent_id, name, slug, full_slug, route_path,
  description, nav_description, sort_order, is_active, is_visible_in_nav
)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'category_top',
    null,
    'Thực phẩm chức năng',
    'thuc-pham-chuc-nang',
    'thuc-pham-chuc-nang',
    '/thuc-pham-chuc-nang',
    'Hỗ trợ sức khỏe và bổ sung dinh dưỡng mỗi ngày.',
    'Bổ sung dinh dưỡng, nâng cao sức khỏe.',
    1,
    true,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000102',
    'category_child',
    '00000000-0000-0000-0000-000000000101',
    'Sinh lý nam',
    'sinh-ly-nam',
    'thuc-pham-chuc-nang/sinh-ly-nam',
    '/thuc-pham-chuc-nang/sinh-ly-nam',
    null,
    'Tăng cường sinh lực, hỗ trợ sức khỏe nam giới.',
    10,
    true,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000103',
    'category_child',
    '00000000-0000-0000-0000-000000000101',
    'Sinh lý - Nội tiết tố',
    'sinh-ly-noi-tiet-to',
    'thuc-pham-chuc-nang/sinh-ly-noi-tiet-to',
    '/thuc-pham-chuc-nang/sinh-ly-noi-tiet-to',
    null,
    'Cân bằng nội tiết tố, hỗ trợ sinh lý.',
    11,
    true,
    true
  )
on conflict (id) do update
set
  node_type = excluded.node_type,
  parent_id = excluded.parent_id,
  name = excluded.name,
  slug = excluded.slug,
  full_slug = excluded.full_slug,
  route_path = excluded.route_path,
  description = excluded.description,
  nav_description = excluded.nav_description,
  sort_order = excluded.sort_order,
  is_active = true,
  is_visible_in_nav = excluded.is_visible_in_nav;

-- products
insert into public.products (
  id, slug, title, brand_id, category_id, image_url,
  price_amount, compare_at_amount, unit, pack_note, origin_label, country,
  badge, benefit_tag, format_tag, trust_label,
  short_description, description_html, usage_html, ingredients_html,      
  stock_qty, is_active, sort
)
values
  (
    'sam-nhung-bo-than-nv-hai-linh-30v-321',
    'sam-nhung-bo-than-nv-hai-linh-30v-321',
    'Viên uống hỗ trợ bổ thận, tăng cường sinh lực Sâm Nhung Bổ Thận NV (30 viên)',
    'dolexphar',
    'sinh-ly-nam',
    'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_0_30b8d2a1e0.png',
    125000,
    null,
    'Hộp',
    'Hộp 30 viên',
    null,
    'Việt Nam',
    null,
    null,
    null,
    null,
    'Sâm Nhung Bổ Thận NV giúp bổ thận, tráng dương, mạnh gân cốt, ăn ngủ tốt, tăng cường sinh lực.',
    $$<h2>Mô tả sản phẩm</h2><p>Sâm Nhung Bổ Thận NV hỗ trợ bổ thận, tăng cường sinh lực phái mạnh…</p>$$,
    $$<h2>Cách dùng</h2><p>Ngày uống 2 lần vào sáng và chiều, mỗi lần 2 viên.</p>$$,
    $$<h2>Thành phần</h2><p>Nhung hươu, cao ban long, dâm dương hoắc…</p>$$,
    20,
    true,
    0
  ),
  (
    'p1-vitamin-c-1000',
    'vitamin-c-1000mg-ho-tro-mien-dich',
    'Vitamin C 1000mg hỗ trợ miễn dịch (Viên nang)',
    'blackmores',
    'tpcn',
    null,
    388800,
    459000,
    'Hộp',
    'Hộp 30 viên',
    'Úc',
    null,
    'Giá tốt',
    'Hỗ trợ miễn dịch',
    'Viên nang',
    'Tư vấn dược sĩ',
    null,
    null,
    null,
    null,
    50,
    true,
    0
  ),
  (
    'p2-abbott-senior',
    'sua-abbott-nguoi-lon-tuoi-ho-tro-tim-mach',
    'Sữa Abbott cho người lớn tuổi hỗ trợ tim mạch',
    'abbott',
    'tpcn',
    null,
    699000,
    789000,
    'Lon',
    'Lon 850g',
    'Mỹ',
    null,
    'Ưu đãi',
    'Tim mạch',
    'Dạng bột',
    'Chính hãng',
    null,
    null,
    null,
    null,
    10,
    true,
    0
  )
on conflict (id) do update
set
  slug = excluded.slug,
  title = excluded.title,
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

-- catalog_products (new canonical /san-pham/:slug)
insert into public.catalog_products (
  id, name, slug, route_path, short_description, description,
  brand_name, thumbnail_url, gallery, price, compare_at_price,
  is_active, is_featured, seo_title, seo_description
)
values
  (
    '00000000-0000-0000-0000-000000001001',
    'Viên uống hỗ trợ bổ thận, tăng cường sinh lực Sâm Nhung Bổ Thận NV (30 viên)',
    'sam-nhung-bo-than-nv-hai-linh-30v-321',
    '/san-pham/sam-nhung-bo-than-nv-hai-linh-30v-321',
    'Sâm Nhung Bổ Thận NV giúp bổ thận, tráng dương, tăng cường sinh lực.',
    'Sâm Nhung Bổ Thận NV hỗ trợ bổ thận, tăng cường sinh lực phái mạnh.',
    'Dolexphar',
    'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_0_30b8d2a1e0.png',
    jsonb_build_array(
      'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_0_30b8d2a1e0.png',
      'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_1_4a8c0f6f2b.png'
    ),
    125000,
    null,
    true,
    true,
    null,
    null
  )
on conflict (id) do update
set
  name = excluded.name,
  slug = excluded.slug,
  route_path = excluded.route_path,
  short_description = excluded.short_description,
  description = excluded.description,
  brand_name = excluded.brand_name,
  thumbnail_url = excluded.thumbnail_url,
  gallery = excluded.gallery,
  price = excluded.price,
  compare_at_price = excluded.compare_at_price,
  is_active = true,
  is_featured = excluded.is_featured;

-- product_node_links (new)
insert into public.product_node_links (product_id, node_id, is_primary, sort_order)
values
  ('00000000-0000-0000-0000-000000001001','00000000-0000-0000-0000-000000000102',true,1)
on conflict (product_id, node_id) do update
set
  is_primary = excluded.is_primary,
  sort_order = excluded.sort_order;

-- node_featured_links (new)
insert into public.node_featured_links (node_id, link_type, label, description, href, product_id, target_node_id, sort_order, is_active)
values
  (
    '00000000-0000-0000-0000-000000000101',
    'custom_link',
    'Bán chạy',
    null,
    '/thuc-pham-chuc-nang',
    null,
    null,
    1,
    true
  ),
  (
    '00000000-0000-0000-0000-000000000101',
    'featured_product',
    'Sâm Nhung Bổ Thận NV',
    null,
    null,
    '00000000-0000-0000-0000-000000001001',
    null,
    2,
    true
  )
on conflict do nothing;

-- product_images (dev reset)
delete from public.product_images
where product_id = 'sam-nhung-bo-than-nv-hai-linh-30v-321';

insert into public.product_images (product_id, image_url, sort)
values
  (
    'sam-nhung-bo-than-nv-hai-linh-30v-321',
    'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_0_30b8d2a1e0.png',
    0
  ),
  (
    'sam-nhung-bo-than-nv-hai-linh-30v-321',
    'https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_1_4a8c0f6f2b.png',
    1
  );

-- nav_top_items
insert into public.nav_top_items (id, label, href, sort, is_active)
values
  ('tpcn','Thực phẩm chức năng','/thuc-pham-chuc-nang',1,true),
  ('duoc-my-pham','Dược mỹ phẩm','/duoc-my-pham',2,true),
  ('thuoc','Thuốc','/thuoc',3,true),
  ('cham-soc-ca-nhan','Chăm sóc cá nhân','/cham-soc-ca-nhan',4,true),
  ('thiet-bi-y-te','Thiết bị y tế','/thiet-bi-y-te',5,true),
  ('tiem-chung','Tiêm chủng','/tiem-chung',6,true),
  ('benh-goc-suc-khoe','Bệnh & Góc sức khỏe','/goc-suc-khoe',7,true),
  ('he-thong-nha-thuoc','Hệ thống nhà thuốc','/he-thong-nha-thuoc',8,true)
on conflict (id) do update
set
  label = excluded.label,
  href = excluded.href,
  sort = excluded.sort,
  is_active = true;

-- nav_sidebar_items
insert into public.nav_sidebar_items (id, top_id, label, icon_key, sort, is_active)
values
  ('hormones','tpcn','Sinh lý - Nội tiết tố','hormones',3,true)
on conflict (id) do update
set
  top_id = excluded.top_id,
  label = excluded.label,
  icon_key = excluded.icon_key,
  sort = excluded.sort,
  is_active = true;

-- nav_tiles
insert into public.nav_tiles (id, sidebar_id, label, icon_key, href, sort, is_active)
values
  ('sinh-ly-nam','hormones','Sinh lý nam','activity','/thuc-pham-chuc-nang/sinh-ly-nam',1,true),
  ('can-bang-noi-tiet','hormones','Cân bằng nội tiết tố','flask','/thuc-pham-chuc-nang/sinh-ly-noi-tiet-to',2,true)
on conflict (id) do update
set
  sidebar_id = excluded.sidebar_id,
  label = excluded.label,
  icon_key = excluded.icon_key,
  href = excluded.href,
  sort = excluded.sort,
  is_active = true;

-- nav_best_sellers (dev reset)
delete from public.nav_best_sellers;
insert into public.nav_best_sellers (sidebar_id, product_id, sort)
values
  ('hormones','sam-nhung-bo-than-nv-hai-linh-30v-321',1)
on conflict (sidebar_id, product_id) do update
set sort = excluded.sort;

-- collections
insert into public.collections (id, title, description, type, sort, is_active)
values
  ('home_promo','Ưu đãi nổi bật','Flash deals có kiểm soát','product_collection',1,true),
  ('home_best_sellers','Sản phẩm bán chạy','So sánh nhanh theo công dụng','product_collection',2,true)
on conflict (id) do update
set
  title = excluded.title,
  description = excluded.description,
  type = excluded.type,
  sort = excluded.sort,
  is_active = true;

-- collection_items (dev reset)
delete from public.collection_items;
insert into public.collection_items (collection_id, product_id, sort)
values
  ('home_promo','p1-vitamin-c-1000',1),
  ('home_promo','p2-abbott-senior',2),
  ('home_best_sellers','sam-nhung-bo-than-nv-hai-linh-30v-321',1)
on conflict (collection_id, product_id) do update
set sort = excluded.sort;

-- articles
insert into public.articles (id, slug, title, excerpt, cover_image_url, content_html, is_featured, published_at, is_active)
values
  (
    'a1',
    'huong-dan-dung-thuoc-an-toan',
    'Hướng dẫn dùng thuốc an toàn: 6 nguyên tắc ai cũng nên biết',
    'Tóm tắt ngắn gọn, dễ áp dụng trong mua và sử dụng thuốc.',
    null,
    $$<h1>Hướng dẫn dùng thuốc an toàn</h1><p>Nội dung demo cho phase 1.</p>$$,
    true,
    now(),
    true
  )
on conflict (id) do update
set
  slug = excluded.slug,
  title = excluded.title,
  excerpt = excluded.excerpt,
  cover_image_url = excluded.cover_image_url,
  content_html = excluded.content_html,
  is_featured = excluded.is_featured,
  published_at = excluded.published_at,
  is_active = true;

commit;

