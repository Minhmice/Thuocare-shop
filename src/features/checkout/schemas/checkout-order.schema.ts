import { z } from "@/infrastructure/validation/zod";

export const CheckoutLineInputSchema = z.object({
  productId: z.string().min(1, "Thiếu productId"),
  qty: z.number().int("Số lượng phải là số nguyên").positive("Số lượng phải > 0"),
});

export const CreateCheckoutOrderInputSchema = z.object({
  phone: z.string().min(1, "Thiếu số điện thoại"),
  customerName: z.string().trim().min(1, "Tên không hợp lệ").optional(),
  note: z.string().trim().max(2000, "Ghi chú quá dài").optional(),
  items: z.array(CheckoutLineInputSchema).min(1, "Giỏ hàng trống"),
});

