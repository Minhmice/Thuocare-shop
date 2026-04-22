import { createCheckoutOrder } from "@/features/checkout/services/create-checkout-order";
import type { CreateCheckoutOrderInput, CreateCheckoutOrderResult } from "@/features/checkout/types/checkout";

export type CreateOrderInput = CreateCheckoutOrderInput;
export type CreateOrderResult = CreateCheckoutOrderResult;

export async function createOrderFromLocalCart(input: CreateOrderInput): Promise<CreateOrderResult> {
  return createCheckoutOrder(input);
}

