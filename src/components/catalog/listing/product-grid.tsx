"use client";

import * as React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/commerce/product-card";
import type { ProductCard as ProductCardModel } from "@/types/commerce";

export function ProductGrid({
  products,
  linksById,
}: {
  products: ProductCardModel[];
  linksById?: Record<string, string>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p, idx) => {
        const href = linksById?.[p.id] ?? null;
        const card = <ProductCard product={p} imagePriority={idx < 4} />;
        return href ? (
          <Link key={p.id} href={href} className="block">
            {card}
          </Link>
        ) : (
          <div key={p.id}>{card}</div>
        );
      })}
    </div>
  );
}

