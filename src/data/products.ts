import type { ProductCard } from "@/types/commerce";
import { formatVnd } from "@/lib/money";
import { createSupabaseAnonServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { DbBrand, DbProduct, DbProductImage } from "@/lib/supabase/types";
import { MOCK_PRODUCTS } from "@/data/mock";

type ProductRow = DbProduct & {
  brand?: Pick<DbBrand, "name" | "name_en" | "slug"> | null;
};

function toProductCard(p: ProductRow): ProductCard {
  return {
    id: p.id,
    title: p.title_en ?? p.title,
    country: p.country ?? undefined,
    badge: p.badge ?? undefined,
    imageUrl: p.image_url ?? undefined,
    price: { amount: p.price_amount, display: formatVnd(p.price_amount) },
    compareAt: p.compare_at_amount ? { amount: p.compare_at_amount, display: formatVnd(p.compare_at_amount) } : undefined,
    unit: p.unit ?? undefined,
    brand: p.brand?.name_en ?? p.brand?.name ?? undefined,
    originLabel: p.origin_label ?? undefined,
    benefitTag: p.benefit_tag ?? undefined,
    formatTag: p.format_tag ?? undefined,
    packNote: p.pack_note ?? undefined,
    trustLabel: p.trust_label ?? undefined,
    isAuthenticitySupported: true,
  };
}

export type ProductDetailData = {
  product: ProductRow;
  images: DbProductImage[];
  related: ProductCard[];
};

export async function getProductBySlug(slug: string): Promise<ProductDetailData | null> {
  if (!isSupabaseConfigured()) {
    const first = MOCK_PRODUCTS[0];
    if (!first) return null;
    if (slug !== "demo" && slug !== first.id && slug !== "sam-nhung-bo-than-nv-hai-linh-30v-321") return null;
    const product: ProductRow = {
      id: first.id,
      slug,
      title: first.title,
      title_en: null,
      short_title: null,
      short_title_en: null,
      brand_id: null,
      category_id: null,
      image_url: null,
      price_amount: first.price.amount,
      compare_at_amount: first.compareAt?.amount ?? null,
      unit: first.unit ?? null,
      pack_note: first.packNote ?? null,
      origin_label: first.originLabel ?? null,
      country: first.country ?? null,
      badge: first.badge ?? null,
      benefit_tag: first.benefitTag ?? null,
      format_tag: first.formatTag ?? null,
      trust_label: first.trustLabel ?? null,
      short_description: null,
      description_html: "<p>Mock description</p>",
      usage_html: "<p>Mock usage</p>",
      ingredients_html: "<p>Mock ingredients</p>",
      stock_qty: 0,
      is_active: true,
      sort: 0,
      created_at: new Date(0).toISOString(),
      updated_at: new Date(0).toISOString(),
      brand: null,
    };
    return { product, images: [], related: MOCK_PRODUCTS };
  }
  const supabase = createSupabaseAnonServerClient();

  const { data: product, error } = await supabase
    .from("products")
    .select(
      `
      *,
      brand:brands(name,slug)
    `
    )
    .eq("slug", slug)
    .limit(1)
    .maybeSingle<ProductRow>();

  if (error) throw error;
  if (!product) return null;

  const { data: images, error: imagesError } = await supabase
    .from("product_images")
    .select("*")
    .eq("product_id", product.id)
    .order("sort", { ascending: true })
    .returns<DbProductImage[]>();

  if (imagesError) throw imagesError;

  const related = await getRelatedProducts(product.id, product.category_id);

  return { product, images: images ?? [], related };
}

export async function getRelatedProducts(productId: string, categoryId: string | null, limit = 8): Promise<ProductCard[]> {
  if (!categoryId) return [];
  if (!isSupabaseConfigured()) return MOCK_PRODUCTS.slice(0, limit);
  const supabase = createSupabaseAnonServerClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, brand:brands(name,slug)")
    .eq("category_id", categoryId)
    .neq("id", productId)
    .order("sort", { ascending: true })
    .limit(limit)
    .returns<ProductRow[]>();

  if (error) throw error;
  return (data ?? []).map(toProductCard);
}

export async function getProductsByCategorySlug(slug: string, limit = 48): Promise<ProductCard[]> {
  if (!isSupabaseConfigured()) return MOCK_PRODUCTS.slice(0, limit);
  const supabase = createSupabaseAnonServerClient();

  const { data: cat, error: catErr } = await supabase.from("categories").select("id").eq("slug", slug).limit(1).maybeSingle();
  if (catErr) throw catErr;
  if (!cat?.id) return [];

  const { data, error } = await supabase
    .from("products")
    .select("*, brand:brands(name,slug)")
    .eq("category_id", cat.id)
    .order("sort", { ascending: true })
    .limit(limit)
    .returns<ProductRow[]>();

  if (error) throw error;
  return (data ?? []).map(toProductCard);
}

