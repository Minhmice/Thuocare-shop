"use client";

import * as React from "react";
import Link from "next/link";
import { ProductCard } from "@/components/commerce/product-card";
import type { ProductCard as ProductCardModel } from "@/types/commerce";

export function ProductGrid({
  products,
  linkForProductId,
}: {
  products: ProductCardModel[];
  linkForProductId?: (productId: string) => string | null | undefined;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => {
        const href = linkForProductId?.(p.id) ?? null;
        const card = <ProductCard product={p} />;
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

