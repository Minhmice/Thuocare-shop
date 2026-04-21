export type MoneyVnd = {
  /** raw number in VND (no decimals) */
  amount: number;
  /** formatted display like "388.800đ" */
  display: string;
};

export type ProductCard = {
  id: string;
  title: string;
  /** brand/manufacturer label for scan speed */
  brand?: string;
  /** origin/country label (short) */
  originLabel?: string;
  /** short benefit/use-case tag, e.g. "Hỗ trợ miễn dịch" */
  benefitTag?: string;
  /** short format tag, e.g. "Viên nén", "Siro", "Viên nang" */
  formatTag?: string;
  /** packaging note, e.g. "Hộp 30 viên" */
  packNote?: string;
  /** trust microcopy, e.g. "Tư vấn dược sĩ" / "Hỗ trợ đơn thuốc" */
  trustLabel?: string;
  /** show authenticity affordance when available */
  isAuthenticitySupported?: boolean;
  /** legacy: kept for older components */
  country?: string;
  badge?: string;
  imageUrl?: string;
  price: MoneyVnd;
  compareAt?: MoneyVnd;
  unit?: string;
};

export type CartLine = {
  productId: string;
  qty: number;
};

