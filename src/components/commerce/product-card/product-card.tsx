"use client";

import * as React from "react";
import Image from "next/image";
import { BadgeCheck, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ProductCard as ProductCardModel } from "@/types/commerce";
import { Button } from "@/components/ui/button";
import { CART_KEY, localDb } from "@/lib/local-db";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import type { CartLine } from "@/types/commerce";
import { MetaRow } from "@/components/commerce/product-card/meta-row";
import { PriceStack } from "@/components/commerce/product-card/price-stack";
import { TrustMicro } from "@/components/commerce/product-card/trust-micro";

function formatCartCount(lines: { qty: number }[]) {
  return lines.reduce((sum, l) => sum + l.qty, 0);
}

export function ProductCard({
  product,
  variant = "grid",
  imagePriority = false,
  className,
}: {
  product: ProductCardModel;
  variant?: "grid" | "compact";
  imagePriority?: boolean;
  className?: string;
}) {
  const [cartLines, setCartLines] = useLocalStorageState<CartLine[]>(CART_KEY, []);
  React.useEffect(() => {
    setCartLines(localDb.cart.get());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cartCount = formatCartCount(cartLines);

  const isCompact = variant === "compact";
  const imageHeight = isCompact ? "h-28" : "h-36";

  return (
    <article
      className={cn(
        "group relative rounded-2xl border bg-white p-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow",
        className
      )}
    >
      <div className="relative overflow-hidden rounded-xl bg-(--lc-surface)">
        <div className={cn("w-full", imageHeight)}>
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={320}
              height={320}
              className="h-full w-full object-contain p-2"
              sizes={isCompact ? "220px" : "240px"}
              priority={imagePriority}
              fetchPriority={imagePriority ? "high" : "auto"}
              loading={imagePriority ? "eager" : "lazy"}
              unoptimized={product.imageUrl.includes("cdn.nhathuoclongchau.com.vn/unsafe/")}
            />
          ) : (
            <div className="h-full w-full" />
          )}
        </div>

        <div className="absolute left-2 top-2 flex flex-wrap gap-1">
          {product.badge ? (
            <div className="rounded-full bg-red-600 px-2 py-0.5 text-[10px] font-semibold text-white">{product.badge}</div>
          ) : null}
          {product.originLabel ? (
            <div className="rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
              {product.originLabel}
            </div>
          ) : null}
        </div>

        {product.isAuthenticitySupported ? (
          <div className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
            <BadgeCheck className="size-3 text-(--lc-blue-700)" />
            Chính hãng
          </div>
        ) : null}
      </div>

      <div className="mt-3">
        {product.brand ? <div className="text-[11px] font-semibold text-slate-500">{product.brand}</div> : null}

        <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-slate-900">{product.title}</h3>

        <MetaRow product={product} />
        <PriceStack className="mt-2" price={product.price} compareAt={product.compareAt} />
        <TrustMicro product={product} />

        <div className="mt-3 flex items-center gap-2">
          <Button
            className="h-9 flex-1 rounded-full bg-(--lc-blue-700) text-white hover:bg-(--lc-blue-800)"
            onClick={() => {
              const next = localDb.cart.upsert(product.id, 1);
              setCartLines(next);
            }}
          >
            <Plus className="size-4" />
            Chọn mua
          </Button>
          <div className="hidden shrink-0 rounded-full border bg-white px-3 py-2 text-[11px] font-semibold text-slate-600 sm:block">
            Giỏ: {cartCount}
          </div>
        </div>
      </div>
    </article>
  );
}

