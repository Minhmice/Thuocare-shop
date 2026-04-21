import { createSupabaseServiceRoleServerClient } from "@/lib/supabase/server";

export type CreateOrderInput = {
  phone: string;
  customerName?: string;
  note?: string;
  items: Array<{ productId: string; qty: number }>;
};

export type CreateOrderResult = {
  orderId: string;
  subtotalAmount: number;
};

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").trim();
}

export async function createOrderFromLocalCart(input: CreateOrderInput): Promise<CreateOrderResult> {
  const phone = normalizePhone(input.phone);
  if (phone.length < 8) throw new Error("Số điện thoại không hợp lệ.");
  if (input.items.length === 0) throw new Error("Giỏ hàng trống.");

  const supabase = createSupabaseServiceRoleServerClient();

  const productIds = Array.from(new Set(input.items.map((i) => i.productId)));
  const { data: products, error: productsErr } = await supabase
    .from("products")
    .select("id,price_amount,is_active")
    .in("id", productIds);
  if (productsErr) throw productsErr;

  const priceById = new Map<string, number>();
  for (const p of products ?? []) {
    if (!p.is_active) continue;
    priceById.set(p.id, p.price_amount);
  }

  const orderItems = input.items
    .map((i) => ({
      product_id: i.productId,
      qty: i.qty,
      unit_price_amount: priceById.get(i.productId),
    }))
    .filter((i) => typeof i.unit_price_amount === "number" && i.qty > 0) as Array<{
    product_id: string;
    qty: number;
    unit_price_amount: number;
  }>;

  if (orderItems.length === 0) throw new Error("Sản phẩm không hợp lệ hoặc đã ngừng bán.");

  const subtotalAmount = orderItems.reduce((sum, it) => sum + it.qty * it.unit_price_amount, 0);
  const orderId = crypto.randomUUID();

  const { error: orderErr } = await supabase.from("orders").insert({
    id: orderId,
    phone,
    customer_name: input.customerName ?? null,
    note: input.note ?? null,
    subtotal_amount: subtotalAmount,
    status: "new",
    source: "web",
  });
  if (orderErr) throw orderErr;

  const { error: itemsErr } = await supabase.from("order_items").insert(
    orderItems.map((it) => ({ order_id: orderId, ...it }))
  );
  if (itemsErr) throw itemsErr;

  return { orderId, subtotalAmount };
}

