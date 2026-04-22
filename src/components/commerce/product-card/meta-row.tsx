"use client";

import * as React from "react";
import type { ProductCard } from "@/types/commerce";

export function MetaRow({ product }: { product: ProductCard }) {
  const left = product.benefitTag ?? product.formatTag ?? null;
  const right = product.packNote ?? product.unit ?? null;

  if (!left && !right) return null;

  return (
    <div className="mt-1 flex items-center justify-between gap-2 text-[11px] text-slate-600">
      <div className="min-w-0 truncate">{left}</div>
      <div className="shrink-0 text-slate-500">{right}</div>
    </div>
  );
}

