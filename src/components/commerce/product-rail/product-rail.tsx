"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { ProductCard as ProductCardModel } from "@/types/commerce";
import { CART_KEY, localDb } from "@/lib/local-db";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import type { CartLine } from "@/types/commerce";
import { ProductCard } from "@/components/commerce/product-card";

function formatCartCount(lines: { qty: number }[]) {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

export function ProductRail({
  title,
  products,
  className,
}: {
  title: string;
  products: ProductCardModel[];
  className?: string;
}) {
  const [cartLines, setCartLines] = useLocalStorageState<CartLine[]>(CART_KEY, []);
  React.useEffect(() => {
    setCartLines(localDb.cart.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cartCount = formatCartCount(cartLines);

  return (
    <section className={cn("bg-white", className)}>
      <div className="mx-auto max-w-[1200px] px-3 py-6 sm:px-4">
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
            <div className="text-xs text-slate-500">Giỏ hàng (localStorage): {cartCount}</div>
          </div>
          <a className="text-sm font-semibold text-(--lc-blue-700) hover:underline" href="#">
            Xem tất cả
          </a>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} variant="compact" className="w-[220px] shrink-0 hover:translate-y-0" />
          ))}
        </div>
      </div>
    </section>
  );
}

