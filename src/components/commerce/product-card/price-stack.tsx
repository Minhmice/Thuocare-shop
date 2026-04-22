"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ProductCard } from "@/types/commerce";

export function PriceStack({
  price,
  compareAt,
  className,
}: {
  price: ProductCard["price"];
  compareAt?: ProductCard["compareAt"];
  className?: string;
}) {
  const discountPct =
    compareAt && compareAt.amount > price.amount
      ? Math.round(((compareAt.amount - price.amount) / compareAt.amount) * 100)
      : null;

  return (
    <div className={cn("flex items-baseline gap-2", className)}>
      <div className="text-base font-extrabold text-[color:var(--lc-blue-800)]">{price.display}</div>
      {compareAt ? <div className="text-xs text-slate-400 line-through">{compareAt.display}</div> : null}
      {discountPct ? (
        <div className="rounded-full bg-red-50 px-2 py-0.5 text-[11px] font-semibold text-red-700">-{discountPct}%</div>
      ) : null}
    </div>
  );
}

