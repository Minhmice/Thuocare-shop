"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export function QuantitySelector({
  qty,
  setQty,
  className,
  size = "md",
}: {
  qty: number;
  setQty: React.Dispatch<React.SetStateAction<number>>;
  className?: string;
  size?: "sm" | "md";
}) {
  const btnSize = size === "sm" ? "size-8" : "size-9";
  const textSize = size === "sm" ? "text-xs" : "text-sm";
  const qtyWidth = size === "sm" ? "w-7" : "min-w-10";

  return (
    <div className={cn("inline-flex items-center gap-2", className)}>
      <button
        type="button"
        className={cn("grid place-items-center rounded-full border bg-white text-slate-700 hover:bg-slate-50", btnSize)}
        onClick={() => setQty((q) => Math.max(1, q - 1))}
        aria-label="Giảm số lượng"
      >
        −
      </button>
      <div className={cn("text-center font-semibold", textSize, qtyWidth)}>{qty}</div>
      <button
        type="button"
        className={cn("grid place-items-center rounded-full border bg-white text-slate-700 hover:bg-slate-50", btnSize)}
        onClick={() => setQty((q) => q + 1)}
        aria-label="Tăng số lượng"
      >
        +
      </button>
    </div>
  );
}

