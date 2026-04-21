"use client";

import * as React from "react";
import Image from "next/image";
import type {
  LongChauNavIconKey,
  LongChauNavPanel,
  LongChauNavSidebarItem,
  LongChauNavTile,
} from "@/components/longchau-nav.data";
import { cn } from "@/lib/utils";
import type { ProductCard } from "@/types/commerce";
import {
  Activity,
  BadgeCheck,
  Bandage,
  Brain,
  Droplet,
  Eye,
  FlaskConical,
  HeartPulse,
  Leaf,
  Megaphone,
  Pill,
  Ribbon,
  Shield,
  ShoppingBag,
  Sparkles,
  Stethoscope,
  Syringe,
  Star,
  TestTube,
} from "lucide-react";

function Icon({ name, className }: { name: LongChauNavIconKey; className?: string }) {
  const props = { className: cn("size-4", className) };
  switch (name) {
    case "vitamins":
      return <TestTube {...props} />;
    case "shield":
      return <Shield {...props} />;
    case "hormones":
      return <FlaskConical {...props} />;
    case "eye":
      return <Eye {...props} />;
    case "stomach":
      return <FlaskConical {...props} />;
    case "brain":
      return <Brain {...props} />;
    case "sparkles":
      return <Sparkles {...props} />;
    case "droplet":
      return <Droplet {...props} />;
    case "heart":
      return <HeartPulse {...props} />;
    case "lungs":
      return <HeartPulse {...props} />;
    case "bones":
      return <Activity {...props} />;
    case "face":
      return <Sparkles {...props} />;
    case "body":
      return <Activity {...props} />;
    case "skin":
      return <Sparkles {...props} />;
    case "hair":
      return <Sparkles {...props} />;
    case "makeup":
      return <Sparkles {...props} />;
    case "eyeCare":
      return <Eye {...props} />;
    case "leaf":
      return <Leaf {...props} />;
    case "pill":
      return <Pill {...props} />;
    case "flask":
      return <FlaskConical {...props} />;
    case "mortar":
      return <FlaskConical {...props} />;
    case "syringe":
      return <Syringe {...props} />;
    case "bandage":
      return <Bandage {...props} />;
    case "activity":
      return <Activity {...props} />;
    case "family":
      return <BadgeCheck {...props} />;
    case "shopping":
      return <ShoppingBag {...props} />;
    case "drops":
      return <Droplet {...props} />;
    case "stethoscope":
      return <Stethoscope {...props} />;
    case "ribbon":
      return <Ribbon {...props} />;
    case "badge":
      return <BadgeCheck {...props} />;
    case "megaphone":
      return <Megaphone {...props} />;
    case "star":
      return <Star {...props} />;
    default:
      return <Star {...props} />;
  }
}

function BestSellerCard({ p }: { p: ProductCard }) {
  return (
    <a
      href="#"
      className="group rounded-xl p-2 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--lc-blue-700)]/30"
    >
      <div className="flex gap-2">
        <div className="relative size-14 shrink-0 overflow-hidden rounded-lg bg-[color:var(--lc-surface)] ring-1 ring-slate-200/70">
          {p.imageUrl ? (
            <Image src={p.imageUrl} alt={p.title} width={112} height={112} className="h-full w-full object-contain" />
          ) : null}
        </div>
        <div className="min-w-0">
          <div className="line-clamp-2 text-xs font-semibold text-slate-800 group-hover:text-[color:var(--lc-blue-800)]">
            {p.title}
          </div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <div className="text-xs font-extrabold text-[color:var(--lc-blue-800)]">{p.price.display}</div>
            <div className="text-[11px] text-slate-500">/ {p.unit ?? "Hộp"}</div>
          </div>
        </div>
      </div>
    </a>
  );
}

function Tiles({ tiles }: { tiles: LongChauNavTile[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {tiles.map((t) => (
        <a
          key={t.id}
          href={t.href ?? "#"}
          className="group flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
        >
          <div className="grid size-9 place-items-center rounded-xl bg-[color:var(--lc-surface)] text-[color:var(--lc-blue-800)]">
            <Icon name={t.icon} className="size-5" />
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-slate-900 group-hover:text-[color:var(--lc-blue-800)]">
              {t.label}
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

function SidebarItem({
  item,
  active,
  onEnter,
}: {
  item: LongChauNavSidebarItem;
  active: boolean;
  onEnter: () => void;
}) {
  return (
    <button
      type="button"
      onMouseEnter={onEnter}
      onFocus={onEnter}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-sm font-semibold transition",
        active
          ? "bg-[color:var(--lc-sky-200)]/55 text-[color:var(--lc-blue-900)]"
          : "text-slate-700 hover:bg-slate-50"
      )}
    >
      <span className={cn("grid size-9 place-items-center rounded-xl", active ? "bg-white" : "bg-slate-50")}>
        <Icon name={item.icon} className={cn(active ? "text-[color:var(--lc-blue-800)]" : "text-slate-500")} />
      </span>
      <span className="truncate">{item.label}</span>
    </button>
  );
}

export function LongChauNavPanelView({
  panel,
  mode,
  activeSidebarId,
  setActiveSidebarId,
  className,
}: {
  panel: LongChauNavPanel;
  mode: "desktop" | "mobile";
  activeSidebarId: string | null;
  setActiveSidebarId: (id: string) => void;
  className?: string;
}) {
  const first = panel.sidebar[0];
  const active = panel.sidebar.find((s) => s.id === activeSidebarId) ?? first;

  React.useEffect(() => {
    if (first) setActiveSidebarId(first.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [panel.id]);

  if (!first || !active) return null;

  const shellClass =
    mode === "desktop"
      ? "rounded-3xl border bg-white shadow-[0_18px_50px_rgba(15,23,42,0.18)]"
      : "rounded-3xl border bg-white shadow-sm";

  return (
    <div className={cn(shellClass, "p-3 sm:p-4", className)}>
      <div className="grid gap-4 sm:grid-cols-[260px_1fr]">
        <aside className="rounded-2xl bg-white sm:border-r sm:pr-4">
          <div className="grid gap-1">
            {panel.sidebar.map((s) => (
              <SidebarItem
                key={s.id}
                item={s}
                active={s.id === active.id}
                onEnter={() => setActiveSidebarId(s.id)}
              />
            ))}
          </div>
        </aside>

        <section className="min-w-0">
          <div className="mb-4">
            <Tiles tiles={active.tiles} />
          </div>

          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-extrabold text-slate-900">Bán chạy nhất</div>
            <a className="text-xs font-semibold text-[color:var(--lc-blue-700)] hover:underline" href="#">
              Xem tất cả
            </a>
          </div>

          <div className="mt-2 grid gap-1 sm:grid-cols-2">
            {active.bestSellers.slice(0, 6).map((p) => (
              <BestSellerCard key={p.id} p={p} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

