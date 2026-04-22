import { createCheckoutOrder } from "@/features/checkout/services/create-checkout-order";
import { fail, getRequestId, ok, parseJson } from "@/infrastructure/http/route-handler";

export async function POST(req: Request) {
  const requestId = getRequestId(req);
  try {
    const body = await parseJson<{
      phone: string;
      customerName?: string;
      note?: string;
      items: Array<{ productId: string; qty: number }>;
    }>(req);

    const result = await createCheckoutOrder({
      phone: body.phone,
      customerName: body.customerName,
      note: body.note,
      items: body.items,
    });

    return ok(result, { headers: { "x-request-id": requestId } });
  } catch (e) {
    return fail(e, requestId);
  }
}

