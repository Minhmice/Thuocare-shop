"use client";

import * as React from "react";
import { ShieldCheck } from "lucide-react";
import type { ProductCard } from "@/types/commerce";

export function TrustMicro({ product }: { product: ProductCard }) {
  if (!product.trustLabel) return null;
  return (
    <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-[color:var(--lc-surface)] px-2.5 py-1 text-[11px] font-semibold text-slate-700">
      <ShieldCheck className="size-3.5 text-[color:var(--lc-blue-700)]" />
      {product.trustLabel}
    </div>
  );
}

