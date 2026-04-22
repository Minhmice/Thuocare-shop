export type CheckoutLineInput = {
  productId: string;
  qty: number;
};

export type CreateCheckoutOrderInput = {
  phone: string;
  customerName?: string;
  note?: string;
  items: CheckoutLineInput[];
};

export type CreateCheckoutOrderResult = {
  orderId: string;
  subtotalAmount: number;
};

