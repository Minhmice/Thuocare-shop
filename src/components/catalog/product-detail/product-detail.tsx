"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { CART_KEY, localDb } from "@/lib/local-db";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import type { CartLine } from "@/types/commerce";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { ProductGallery } from "@/components/catalog/product-detail/product-gallery";
import { QuantitySelector } from "@/components/catalog/product-detail/quantity-selector";
import { MobileStickyBuyBar } from "@/components/catalog/product-detail/mobile-sticky-buy-bar";
import { formatVnd } from "@/lib/money";
import type { CatalogProductPage } from "@/data/catalog";

export function CatalogProductDetailView({ data }: { data: CatalogProductPage }) {
  const p = data.product;
  const [activeImgIdx, setActiveImgIdx] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [cartLines, setCartLines] = useLocalStorageState<CartLine[]>(CART_KEY, []);

  function addToCart() {
    if (!p) return;
    const next = localDb.cart.upsert(p.id, qty);
    setCartLines(next);
  }

  if (!p) return null;

  const gallery = Array.isArray(p.gallery) ? (p.gallery.filter((x): x is string => typeof x === "string") as string[]) : [];
  const images = gallery.length
    ? gallery.map((src) => ({ src, alt: p.name }))
    : p.thumbnail_url
      ? [{ src: p.thumbnail_url, alt: p.name }]
      : [];

  return (
    <section className="bg-(--lc-surface) pb-20 sm:pb-10">
      <Breadcrumbs items={[{ label: "Trang chủ", href: "/" }, { label: data.primaryNode?.name ?? "Sản phẩm", href: data.primaryNode?.routePath ?? "/thuoc" }, { label: p.name }]} />

      <div className="mx-auto max-w-[1200px] px-3 pb-8 pt-3 sm:px-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[520px_1fr]">
            <ProductGallery images={images} activeIdx={activeImgIdx} setActiveIdx={setActiveImgIdx} />

            <div>
              <h1 className="text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">{p.name}</h1>

              <div className="mt-4 flex items-end gap-2">
                <div className="text-3xl font-extrabold text-(--lc-blue-700)">{p.price == null ? "Liên hệ" : formatVnd(p.price)}</div>
                <div className="pb-1 text-sm text-slate-600">/ Hộp</div>
              </div>

              <div className="mt-4 grid gap-3 sm:max-w-[420px]">
                <div className="grid grid-cols-[120px_1fr] items-center gap-3 text-sm">
                  <div className="text-slate-600">Chọn số lượng</div>
                  <QuantitySelector qty={qty} setQty={setQty} />
                </div>

                <Button className="h-11 rounded-full bg-(--lc-blue-700) text-white hover:bg-(--lc-blue-800)" onClick={addToCart}>
                  Chọn mua
                </Button>
              </div>

              {p.short_description ? <p className="mt-4 text-sm leading-relaxed text-slate-700">{p.short_description}</p> : null}
              {p.description ? <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-slate-700">{p.description}</p> : null}

              {data.tags.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {data.tags.slice(0, 12).map((t) => (
                    <span key={t.id} className="rounded-full border bg-white px-3 py-1 text-xs font-semibold text-slate-700">
                      {t.name}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-4 text-xs text-slate-500">
                Cart(localStorage): <span className="font-semibold text-slate-700">{cartLines.reduce((s, l) => s + l.qty, 0)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileStickyBuyBar
        title={p.name}
        priceDisplay={p.price == null ? "Liên hệ" : formatVnd(p.price)}
        unitLabel="Hộp"
        qty={qty}
        setQty={setQty}
        onAddToCart={addToCart}
      />
    </section>
  );
}

