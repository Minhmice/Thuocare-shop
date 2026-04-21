import { createClient } from "@supabase/supabase-js";

type SeedBrand = {
  id: string;
  name: string;
  slug: string;
  country?: string;
  logo_url?: string;
  sort?: number;
};

type SeedCategory = {
  id: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  sort?: number;
};

type SeedProduct = {
  id: string;
  slug: string;
  title: string;
  short_title?: string | null;
  brand_id?: string | null;
  category_id?: string | null;
  image_url?: string | null;
  price_amount: number;
  compare_at_amount?: number | null;
  unit?: string | null;
  pack_note?: string | null;
  origin_label?: string | null;
  country?: string | null;
  badge?: string | null;
  benefit_tag?: string | null;
  format_tag?: string | null;
  trust_label?: string | null;
  short_description?: string | null;
  description_html?: string | null;
  usage_html?: string | null;
  ingredients_html?: string | null;
  stock_qty?: number;
  is_active?: boolean;
  sort?: number;
};

type SeedProductImage = {
  product_id: string;
  image_url: string;
  sort?: number;
};

type SeedNavTop = { id: string; label: string; href?: string | null; sort?: number };
type SeedNavSidebar = { id: string; top_id: string; label: string; icon_key: string; sort?: number };
type SeedNavTile = { id: string; sidebar_id: string; label: string; icon_key: string; href?: string | null; sort?: number };
type SeedNavBestSeller = { sidebar_id: string; product_id: string; sort?: number };

type SeedCollection = { id: string; title?: string | null; description?: string | null; type: string; sort?: number };
type SeedCollectionItem = { collection_id: string; product_id: string; sort?: number };

type SeedArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt?: string | null;
  cover_image_url?: string | null;
  content_html?: string | null;
  is_featured?: boolean;
  published_at?: string | null;
};

function mustGetEnv(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

const brands: SeedBrand[] = [
  { id: "blackmores", name: "Blackmores", slug: "blackmores", country: "Úc", sort: 1 },
  { id: "abbott", name: "Abbott", slug: "abbott", country: "Mỹ", sort: 2 },
  { id: "cetaphil", name: "Cetaphil", slug: "cetaphil", country: "Canada", sort: 3 },
  { id: "panadol", name: "Panadol", slug: "panadol", country: "Anh", sort: 4 },
  { id: "natures-way", name: "Nature’s Way", slug: "natures-way", country: "Úc", sort: 5 },
  { id: "omron", name: "Omron", slug: "omron", country: "Nhật", sort: 6 },
  { id: "dolexphar", name: "Dolexphar", slug: "dolexphar", country: "Việt Nam", sort: 7 },
];

const categories: SeedCategory[] = [
  { id: "tpcn", name: "Thực phẩm chức năng", slug: "thuc-pham-chuc-nang", sort: 1 },
  { id: "noi-tiet", name: "Sinh lý - Nội tiết tố", slug: "sinh-ly-noi-tiet-to", parent_id: "tpcn", sort: 10 },
  { id: "sinh-ly-nam", name: "Sinh lý nam", slug: "sinh-ly-nam", parent_id: "noi-tiet", sort: 11 },
];

const products: SeedProduct[] = [
  {
    id: "sam-nhung-bo-than-nv-hai-linh-30v-321",
    slug: "sam-nhung-bo-than-nv-hai-linh-30v-321",
    title: "Viên uống hỗ trợ bổ thận, tăng cường sinh lực Sâm Nhung Bổ Thận NV (30 viên)",
    brand_id: "dolexphar",
    category_id: "sinh-ly-nam",
    image_url:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_0_30b8d2a1e0.png",
    price_amount: 125000,
    unit: "Hộp",
    pack_note: "Hộp 30 viên",
    country: "Việt Nam",
    short_description:
      "Sâm Nhung Bổ Thận NV giúp bổ thận, tráng dương, mạnh gân cốt, ăn ngủ tốt, tăng cường sinh lực.",
    description_html:
      "<h2>Mô tả sản phẩm</h2><p>Sâm Nhung Bổ Thận NV hỗ trợ bổ thận, tăng cường sinh lực phái mạnh…</p>",
    usage_html: "<h2>Cách dùng</h2><p>Ngày uống 2 lần vào sáng và chiều, mỗi lần 2 viên.</p>",
    ingredients_html: "<h2>Thành phần</h2><p>Nhung hươu, cao ban long, dâm dương hoắc…</p>",
    stock_qty: 20,
  },
  {
    id: "p1-vitamin-c-1000",
    slug: "vitamin-c-1000mg-ho-tro-mien-dich",
    title: "Vitamin C 1000mg hỗ trợ miễn dịch (Viên nang)",
    brand_id: "blackmores",
    category_id: "tpcn",
    image_url:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x256/filters:quality(90):format(webp)/products/2024/02/00000000.png",
    price_amount: 388800,
    compare_at_amount: 459000,
    unit: "Hộp",
    origin_label: "Úc",
    benefit_tag: "Hỗ trợ miễn dịch",
    format_tag: "Viên nang",
    pack_note: "Hộp 30 viên",
    trust_label: "Tư vấn dược sĩ",
    badge: "Giá tốt",
    stock_qty: 50,
  },
  {
    id: "p2-abbott-senior",
    slug: "sua-abbott-nguoi-lon-tuoi-ho-tro-tim-mach",
    title: "Sữa Abbott cho người lớn tuổi hỗ trợ tim mạch",
    brand_id: "abbott",
    category_id: "tpcn",
    image_url:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x256/filters:quality(90):format(webp)/products/2024/02/00000000.png",
    price_amount: 699000,
    compare_at_amount: 789000,
    unit: "Lon",
    origin_label: "Mỹ",
    benefit_tag: "Tim mạch",
    format_tag: "Dạng bột",
    pack_note: "Lon 850g",
    trust_label: "Chính hãng",
    badge: "Ưu đãi",
    stock_qty: 10,
  },
];

const productImages: SeedProductImage[] = [
  {
    product_id: "sam-nhung-bo-than-nv-hai-linh-30v-321",
    image_url:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_0_30b8d2a1e0.png",
    sort: 0,
  },
  {
    product_id: "sam-nhung-bo-than-nv-hai-linh-30v-321",
    image_url:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_1_4a8c0f6f2b.png",
    sort: 1,
  },
];

const navTop: SeedNavTop[] = [
  { id: "tpcn", label: "Thực phẩm chức năng", href: "/thuc-pham-chuc-nang", sort: 1 },
  { id: "duoc-my-pham", label: "Dược mỹ phẩm", href: "#", sort: 2 },
  { id: "thuoc", label: "Thuốc", href: "#", sort: 3 },
  { id: "cham-soc-ca-nhan", label: "Chăm sóc cá nhân", href: "#", sort: 4 },
  { id: "thiet-bi-y-te", label: "Thiết bị y tế", href: "#", sort: 5 },
  { id: "tiem-chung", label: "Tiêm chủng", href: "#", sort: 6 },
  { id: "benh-goc-suc-khoe", label: "Bệnh & Góc sức khỏe", href: "#", sort: 7 },
  { id: "he-thong-nha-thuoc", label: "Hệ thống nhà thuốc", href: "#", sort: 8 },
];

const navSidebar: SeedNavSidebar[] = [
  { id: "hormones", top_id: "tpcn", label: "Sinh lý - Nội tiết tố", icon_key: "hormones", sort: 3 },
];

const navTiles: SeedNavTile[] = [
  { id: "sinh-ly-nam", sidebar_id: "hormones", label: "Sinh lý nam", icon_key: "activity", href: "/thuc-pham-chuc-nang/sinh-ly-nam", sort: 1 },
  { id: "can-bang-noi-tiet", sidebar_id: "hormones", label: "Cân bằng nội tiết tố", icon_key: "flask", href: "/thuc-pham-chuc-nang/sinh-ly-noi-tiet-to", sort: 2 },
];

const navBestSellers: SeedNavBestSeller[] = [
  { sidebar_id: "hormones", product_id: "sam-nhung-bo-than-nv-hai-linh-30v-321", sort: 1 },
];

const collections: SeedCollection[] = [
  { id: "home_promo", title: "Ưu đãi nổi bật", description: "Flash deals có kiểm soát", type: "product_collection", sort: 1 },
  { id: "home_best_sellers", title: "Sản phẩm bán chạy", description: "So sánh nhanh theo công dụng", type: "product_collection", sort: 2 },
];

const collectionItems: SeedCollectionItem[] = [
  { collection_id: "home_promo", product_id: "p1-vitamin-c-1000", sort: 1 },
  { collection_id: "home_promo", product_id: "p2-abbott-senior", sort: 2 },
  { collection_id: "home_best_sellers", product_id: "sam-nhung-bo-than-nv-hai-linh-30v-321", sort: 1 },
];

const articles: SeedArticle[] = [
  {
    id: "a1",
    slug: "huong-dan-dung-thuoc-an-toan",
    title: "Hướng dẫn dùng thuốc an toàn: 6 nguyên tắc ai cũng nên biết",
    excerpt: "Tóm tắt ngắn gọn, dễ áp dụng trong mua và sử dụng thuốc.",
    cover_image_url: null,
    content_html: "<h1>Hướng dẫn dùng thuốc an toàn</h1><p>Nội dung demo cho phase 1.</p>",
    is_featured: true,
    published_at: new Date().toISOString(),
  },
];

async function main() {
  const url = mustGetEnv("SUPABASE_URL");
  const serviceRole = mustGetEnv("SUPABASE_SERVICE_ROLE_KEY");
  const supabase = createClient(url, serviceRole, { auth: { persistSession: false } });

  // Upserts
  await supabase.from("brands").upsert(brands, { onConflict: "slug" });
  await supabase.from("categories").upsert(categories, { onConflict: "slug" });
  await supabase.from("products").upsert(products, { onConflict: "slug" });

  // product_images: dev-only reset per product
  const productIds = Array.from(new Set(productImages.map((pi) => pi.product_id)));
  for (const pid of productIds) {
    await supabase.from("product_images").delete().eq("product_id", pid);
  }
  await supabase.from("product_images").insert(productImages);

  await supabase.from("nav_top_items").upsert(navTop, { onConflict: "id" });
  await supabase.from("nav_sidebar_items").upsert(navSidebar, { onConflict: "id" });
  await supabase.from("nav_tiles").upsert(navTiles, { onConflict: "id" });
  await supabase.from("nav_best_sellers").delete().neq("sidebar_id", ""); // clear all
  await supabase.from("nav_best_sellers").insert(navBestSellers);

  await supabase.from("collections").upsert(collections, { onConflict: "id" });
  await supabase.from("collection_items").delete().neq("collection_id", ""); // clear all
  await supabase.from("collection_items").insert(collectionItems);

  await supabase.from("articles").upsert(articles, { onConflict: "slug" });

  console.log("Seed complete.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

