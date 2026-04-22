import { createSupabaseServiceRoleServerClient } from "@/lib/supabase/admin-server";
import { ApiError } from "@/infrastructure/validation/api-error";

export type CreateOrderDbInput = {
  id: string;
  phone: string;
  customer_name: string | null;
  note: string | null;
  subtotal_amount: number;
  status: string;
  source: string;
};

export type CreateOrderItemDbInput = {
  order_id: string;
  product_id: string;
  qty: number;
  unit_price_amount: number;
};

export async function insertOrderWithItems(order: CreateOrderDbInput, items: CreateOrderItemDbInput[]) {
  const supabase = createSupabaseServiceRoleServerClient();

  const { error: orderErr } = await supabase.from("orders").insert(order);
  if (orderErr) {
    throw new ApiError({
      code: "INFRA_ERROR",
      status: 500,
      message: "Không thể tạo đơn hàng.",
      details: { source: "supabase", error: orderErr },
    });
  }

  const { error: itemsErr } = await supabase.from("order_items").insert(items);
  if (itemsErr) {
    throw new ApiError({
      code: "INFRA_ERROR",
      status: 500,
      message: "Không thể tạo đơn hàng.",
      details: { source: "supabase", error: itemsErr },
    });
  }
}

