"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import type { ProductCard } from "@/types/commerce";
import { Button } from "@/components/ui/button";
import { CART_KEY, localDb } from "@/lib/local-db";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import type { CartLine } from "@/types/commerce";

function formatCartCount(lines: { qty: number }[]) {
  const n = lines.reduce((sum, l) => sum + l.qty, 0);
  return n;
}

export function LongChauProductRail({
  title,
  products,
  className,
}: {
  title: string;
  products: ProductCard[];
  className?: string;
}) {
  const [cartLines, setCartLines] = useLocalStorageState<CartLine[]>(CART_KEY, []);
  // NOTE: keep backward compat even if key changes later
  React.useEffect(() => {
    // normalize to localDb getter on mount
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
          <a className="text-sm font-semibold text-[color:var(--lc-blue-700)] hover:underline" href="#">
            Xem tất cả
          </a>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {products.map((p) => (
            <article
              key={p.id}
              className="w-[220px] shrink-0 rounded-2xl border bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              <div className="relative overflow-hidden rounded-xl bg-[color:var(--lc-surface)]">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.title}
                    width={256}
                    height={256}
                    className="h-36 w-full object-contain"
                  />
                ) : (
                  <div className="h-36 w-full" />
                )}
                {p.badge ? (
                  <div className="absolute left-2 top-2 rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white">
                    {p.badge}
                  </div>
                ) : null}
                {p.country ? (
                  <div className="absolute right-2 top-2 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                    {p.country}
                  </div>
                ) : null}
              </div>

              <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-slate-900">{p.title}</h3>

              <div className="mt-2 flex items-baseline gap-2">
                <div className="text-base font-extrabold text-[color:var(--lc-blue-800)]">{p.price.display}</div>
                {p.compareAt ? (
                  <div className="text-xs text-slate-400 line-through">{p.compareAt.display}</div>
                ) : null}
              </div>

              <div className="mt-0.5 text-xs text-slate-500">{p.unit ?? ""}</div>

              <Button
                className="mt-3 h-9 w-full rounded-full bg-[color:var(--lc-blue-700)] text-white hover:bg-[color:var(--lc-blue-800)]"
                onClick={() => {
                  const next = localDb.cart.upsert(p.id, 1);
                  setCartLines(next);
                }}
              >
                Chọn mua
              </Button>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}


