import type { ProductCard } from "@/types/commerce";
import type { TopNavItem } from "@/components/navigation/nav.types";
import type { DbArticle } from "@/lib/supabase/types";
import type { HomepageCollection } from "@/data/collections";

export const MOCK_NAV: TopNavItem[] = [
  { id: "tpcn", label: "Thực phẩm chức năng", href: "/supplements", panel: { id: "panel-tpcn", sidebar: [] } },
  { id: "duoc-my-pham", label: "Dược mỹ phẩm", href: "#" },
  { id: "thuoc", label: "Thuốc", href: "#" },
  { id: "cham-soc-ca-nhan", label: "Chăm sóc cá nhân", href: "#" },
  { id: "thiet-bi-y-te", label: "Thiết bị y tế", href: "#" },
  { id: "tiem-chung", label: "Tiêm chủng", href: "#" },
  { id: "benh-goc-suc-khoe", label: "Bệnh & Góc sức khỏe", href: "#" },
  { id: "he-thong-nha-thuoc", label: "Hệ thống nhà thuốc", href: "#" },
];

export const MOCK_PRODUCTS: ProductCard[] = [
  {
    id: "mock-1",
    title: "Sản phẩm demo (ảnh null cũng được)",
    price: { amount: 125000, display: "125.000đ" },
    unit: "Hộp",
    imageUrl: undefined,
    country: "Việt Nam",
    badge: "Demo",
  },
  {
    id: "mock-2",
    title: "Sản phẩm demo 2",
    price: { amount: 388800, display: "388.800đ" },
    unit: "Hộp",
    imageUrl: undefined,
    originLabel: "Úc",
  },
];

export const MOCK_COLLECTIONS: HomepageCollection[] = [
  {
    id: "home_promo",
    title: "Ưu đãi nổi bật",
    description: "Mock data khi chưa cấu hình Supabase",
    type: "product_collection",
    sort: 1,
    is_active: true,
    products: MOCK_PRODUCTS,
  },
  {
    id: "home_best_sellers",
    title: "Sản phẩm bán chạy",
    description: null,
    type: "product_collection",
    sort: 2,
    is_active: true,
    products: MOCK_PRODUCTS,
  },
];

export const MOCK_FEATURED_ARTICLE: DbArticle = {
  id: "mock-article",
  slug: "demo-article",
  title: "Bài viết demo",
  excerpt: "Mock article khi chưa cấu hình Supabase.",
  cover_image_url: null,
  content_html: "<h1>Bài viết demo</h1><p>Chưa có Supabase env nên đang dùng mock.</p>",
  is_featured: true,
  is_active: true,
  published_at: null,
  created_at: new Date(0).toISOString(),
};

