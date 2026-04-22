import { createSupabaseServiceRoleServerClient } from "@/lib/supabase/admin-server";
import { ApiError } from "@/infrastructure/validation/api-error";

type ProductPriceRow = {
  id: string;
  price_amount: number;
  is_active: boolean;
};

export async function getActiveProductPricesById(productIds: string[]) {
  const unique = Array.from(new Set(productIds)).filter(Boolean);
  if (unique.length === 0) return new Map<string, number>();

  const supabase = createSupabaseServiceRoleServerClient();
  const { data, error } = await supabase.from("products").select("id,price_amount,is_active").in("id", unique).returns<ProductPriceRow[]>();
  if (error) {
    throw new ApiError({
      code: "INFRA_ERROR",
      status: 500,
      message: "Không thể tải sản phẩm.",
      details: { source: "supabase", error },
    });
  }

  const priceById = new Map<string, number>();
  for (const p of data ?? []) {
    if (!p.is_active) continue;
    priceById.set(p.id, p.price_amount);
  }
  return priceById;
}

