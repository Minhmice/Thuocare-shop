"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { QuantitySelector } from "@/components/catalog/product-detail/quantity-selector";

export function MobileStickyBuyBar({
  title,
  priceDisplay,
  unitLabel,
  qty,
  setQty,
  onAddToCart,
}: {
  title: string;
  priceDisplay: string;
  unitLabel: string;
  qty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
  onAddToCart: () => void;
}) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur sm:hidden">
      <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-3 py-3">
        <div className="min-w-0 flex-1">
          <div className="truncate text-xs font-semibold text-slate-900">{title}</div>
          <div className="mt-0.5 flex items-baseline gap-2">
            <div className="text-sm font-extrabold text-(--lc-blue-700)">{priceDisplay}</div>
            <div className="text-xs text-slate-500">{unitLabel}</div>
          </div>
        </div>

        <QuantitySelector qty={qty} setQty={setQty} size="sm" className="gap-1" />

        <Button className="h-10 rounded-full bg-(--lc-blue-700) px-5 text-white hover:bg-(--lc-blue-800)" onClick={onAddToCart}>
          Chọn mua
        </Button>
      </div>
    </div>
  );
}

