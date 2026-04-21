import type { ProductCard } from "@/types/commerce";
import { createSupabaseAnonServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { formatVnd } from "@/lib/money";
import type { DbBrand, DbCollection, DbProduct } from "@/lib/supabase/types";
import { MOCK_COLLECTIONS } from "@/data/mock";

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

export type HomepageCollection = DbCollection & { products: ProductCard[] };

export async function getHomepageCollections(): Promise<HomepageCollection[]> {
  if (!isSupabaseConfigured()) return MOCK_COLLECTIONS;
  const supabase = createSupabaseAnonServerClient();

  const { data: cols, error: colsErr } = await supabase
    .from("collections")
    .select("*")
    .order("sort", { ascending: true })
    .returns<DbCollection[]>();
  if (colsErr) throw colsErr;

  const ids = (cols ?? []).map((c) => c.id);
  if (ids.length === 0) return [];

  const { data: itemsRaw, error: itemsErr } = await supabase
    .from("collection_items")
    .select("collection_id,sort,product:products(*, brand:brands(name,slug))")
    .in("collection_id", ids)
    .order("sort", { ascending: true });
  if (itemsErr) throw itemsErr;

  const itemsByCol = new Map<string, ProductCard[]>();
  // Supabase may return a nested relation as object or array depending on relationship shape.
  // Normalize to a single ProductRow (or null) for downstream mapping.
  for (const row of (itemsRaw ?? []) as unknown as Array<{
    collection_id: string;
    product: ProductRow | ProductRow[] | null;
  }>) {
    const product = Array.isArray(row.product) ? (row.product[0] ?? null) : row.product;
    if (!product) continue;
    const arr = itemsByCol.get(row.collection_id) ?? [];
    arr.push(toProductCard(product));
    itemsByCol.set(row.collection_id, arr);
  }

  return (cols ?? []).map((c) => ({ ...c, products: itemsByCol.get(c.id) ?? [] }));
}

