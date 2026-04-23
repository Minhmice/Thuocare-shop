import type { ProductCard } from "@/types/commerce";
import { formatVnd } from "@/lib/money";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";

type CatalogProductRow = {
  id: string;
  name: string;
  slug: string;
  route_path: string;
  thumbnail_url: string | null;
  price: number | null;
  compare_at_price: number | null;
};

export async function getHomepageFeaturedProducts(limit = 12): Promise<ProductCard[]> {
  try {
    const supabase = createSupabaseAnonServerClient();
    const { data, error } = await supabase
      .from("catalog_products")
      .select("id,name,slug,route_path,thumbnail_url,price,compare_at_price")
      .eq("is_active", true)
      .order("is_featured", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit)
      .returns<CatalogProductRow[]>();

    if (error) return [];

    return (data ?? []).map((p) => ({
      id: p.id,
      title: p.name,
      imageUrl: p.thumbnail_url ?? undefined,
      unit: undefined,
      price: { amount: p.price ?? 0, display: formatVnd(p.price ?? 0) },
      compareAt: p.compare_at_price ? { amount: p.compare_at_price, display: formatVnd(p.compare_at_price) } : undefined,
    }));
  } catch {
    return [];
  }
}

