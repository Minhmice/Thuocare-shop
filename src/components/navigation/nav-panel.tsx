"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import type { NavMegaBlock, NavTopItem } from "@/components/navigation/nav.types";
import { cn } from "@/lib/utils";
import type { ProductCard } from "@/types/commerce";

function BestSellerCard({ product, href }: { product: ProductCard; href: string }) {
  return (
    <Link
      href={href}
      className={cn(
        "group rounded-2xl p-2",
        "transition-[background-color,transform] duration-150 ease-out",
        "hover:bg-[color:var(--lc-surface)] active:translate-y-px",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
      )}
    >
      <div className="flex gap-2">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-xl bg-(--lc-surface) ring-1 ring-border/70">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={112}
              height={112}
              className="h-full w-full object-contain"
            />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="line-clamp-2 text-xs font-semibold text-slate-800 transition-colors group-hover:text-(--lc-accent-900)">{product.title}</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <div className="text-xs font-extrabold text-(--lc-accent-800)">{product.price.display}</div>
            <div className="text-[11px] text-slate-500">/ {product.unit ?? "Hộp"}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}

function LinksBlock({
  block,
}: {
  block: Extract<NavMegaBlock, { kind: "links" }>;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-extrabold text-slate-900">{block.title}</div>
        {block.viewAll ? (
          <Link className="text-xs font-semibold text-(--lc-accent-700) hover:underline" href={block.viewAll.href}>
            {block.viewAll.label}
          </Link>
        ) : null}
      </div>
      <div className="mt-3 grid gap-2">
        {block.links.map((l) => (
          <Link
            key={l.id}
            href={l.href}
            className={cn(
              "group flex items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3",
              "border-border shadow-[0_8px_18px_rgba(0,52,40,0.06)]",
              "transition-[transform,box-shadow,background-color] duration-150 ease-out",
              "hover:-translate-y-0.5 hover:bg-[color:var(--lc-surface)] hover:shadow-[0_14px_30px_rgba(0,52,40,0.08)]",
              "active:translate-y-0 active:shadow-[0_10px_22px_rgba(0,52,40,0.07)]",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35"
            )}
          >
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-(--lc-accent-900)">{l.label}</div>
              {l.description ? <div className="mt-0.5 line-clamp-1 text-xs text-slate-500">{l.description}</div> : null}
            </div>
            <span className="text-xs font-semibold text-slate-400">→</span>
          </Link>
        ))}
      </div>
    </div>
  );
}

function BestSellersBlock({
  block,
}: {
  block: Extract<NavMegaBlock, { kind: "bestSellers" }>;
}) {
  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="text-sm font-extrabold text-slate-900">{block.title}</div>
        {block.href ? (
          <Link className="text-xs font-semibold text-(--lc-accent-700) hover:underline" href={block.href}>
            Xem tất cả
          </Link>
        ) : null}
      </div>
      <div className="mt-2 grid gap-1">{block.products.slice(0, 4).map((p) => <BestSellerCard key={p.id} product={p} href={block.href ?? "/"} />)}</div>
    </div>
  );
}

export function NavPanelView({ topItem, className }: { topItem: NavTopItem | null; className?: string }) {
  const mega = topItem?.mega;
  if (!topItem || !mega) return null;

  const blocks = mega.blocks;
  const a = blocks.find((b) => b.kind === "links") as Extract<NavMegaBlock, { kind: "links" }> | undefined;
  const b = blocks.filter((x) => x.kind === "links")[1] as Extract<NavMegaBlock, { kind: "links" }> | undefined;
  const c = blocks.find((x) => x.kind === "bestSellers") as Extract<NavMegaBlock, { kind: "bestSellers" }> | undefined;

  return (
    <div
      className={cn(
        "mx-auto w-[calc(100%-24px)] max-w-[1200px] sm:w-[calc(100%-32px)]",
        "rounded-3xl border bg-white p-5",
        "border-border",
        "shadow-[0_26px_70px_rgba(0,52,40,0.12)]",
        className
      )}
    >
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="text-base font-extrabold text-slate-900">{topItem.label}</div>
        <Link className="text-sm font-semibold text-(--lc-accent-700) hover:underline" href={topItem.href}>
          Xem tất cả
        </Link>
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        {a ? <LinksBlock block={a} /> : null}
        {b ? <LinksBlock block={b} /> : null}
        {c ? <BestSellersBlock block={c} /> : null}
      </div>
    </div>
  );
}

