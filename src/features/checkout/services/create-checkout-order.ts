import { ApiError } from "@/infrastructure/validation/api-error";
import { zodToFieldErrors } from "@/infrastructure/validation/zod";
import { CreateCheckoutOrderInputSchema } from "@/features/checkout/schemas/checkout-order.schema";
import type { CreateCheckoutOrderInput, CreateCheckoutOrderResult } from "@/features/checkout/types/checkout";
import { getActiveProductPricesById } from "@/features/catalog/repositories/product-pricing.repository";
import { insertOrderWithItems } from "@/features/orders/repositories/orders.repository";

function normalizePhone(phone: string) {
  return phone.replace(/[^\d+]/g, "").trim();
}

export async function createCheckoutOrder(input: CreateCheckoutOrderInput): Promise<CreateCheckoutOrderResult> {
  const parsed = CreateCheckoutOrderInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new ApiError({
      code: "VALIDATION_ERROR",
      status: 400,
      message: "Dữ liệu không hợp lệ.",
      details: { fieldErrors: zodToFieldErrors(parsed.error) },
    });
  }

  const phone = normalizePhone(parsed.data.phone);
  if (phone.length < 8) {
    throw new ApiError({ code: "VALIDATION_ERROR", status: 400, message: "Số điện thoại không hợp lệ." });
  }

  const productIds = parsed.data.items.map((i) => i.productId);
  const priceById = await getActiveProductPricesById(productIds);

  const orderItems = parsed.data.items
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

  if (orderItems.length === 0) {
    throw new ApiError({
      code: "VALIDATION_ERROR",
      status: 400,
      message: "Sản phẩm không hợp lệ hoặc đã ngừng bán.",
    });
  }

  const subtotalAmount = orderItems.reduce((sum, it) => sum + it.qty * it.unit_price_amount, 0);
  const orderId = crypto.randomUUID();

  await insertOrderWithItems(
    {
      id: orderId,
      phone,
      customer_name: parsed.data.customerName ?? null,
      note: parsed.data.note ?? null,
      subtotal_amount: subtotalAmount,
      status: "new",
      source: "web",
    },
    orderItems.map((it) => ({ order_id: orderId, ...it }))
  );

  return { orderId, subtotalAmount };
}

