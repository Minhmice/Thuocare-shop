"use client";

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { ArrowRight, BadgeCheck, ClipboardList, LayoutGrid, ShoppingCart } from "lucide-react";

type QuickAction = {
  label: string;
  desc: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ACTIONS: QuickAction[] = [
  {
    label: "Danh mục TPCN",
    desc: "Xem danh sách theo nhóm",
    href: "/supplements",
    icon: LayoutGrid,
  },
  {
    label: "Thực phẩm chức năng",
    desc: "Trang danh mục mẫu",
    href: "/thuc-pham-chuc-nang",
    icon: ClipboardList,
  },
  {
    label: "Sinh lý - Nội tiết tố",
    desc: "Listing con (demo)",
    href: "/thuc-pham-chuc-nang/sinh-ly-noi-tiet-to",
    icon: BadgeCheck,
  },
  {
    label: "Sản phẩm mẫu",
    desc: "Đi tới trang chi tiết",
    href: "/thuc-pham-chuc-nang/sam-nhung-bo-than-nv-hai-linh-30v-321",
    icon: ArrowRight,
  },
  {
    label: "Giỏ hàng / Checkout",
    desc: "Xác nhận đơn nhanh",
    href: "/checkout",
    icon: ShoppingCart,
  },
];

export function QuickActions({ className }: { className?: string }) {
  return (
    <section className={cn("bg-white", className)}>
      <div className="mx-auto max-w-[1200px] px-3 py-6 sm:px-4 sm:py-8">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-extrabold text-slate-900 sm:text-lg">Truy cập nhanh</h2>
            <p className="mt-1 text-sm text-slate-600">Lối tắt phổ biến — dễ tìm, dễ bấm, rõ đường đi.</p>
          </div>
          <Link className="shrink-0 text-sm font-semibold text-(--lc-blue-700) hover:underline" href="/supplements">
            Xem tất cả
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {ACTIONS.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="group rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--lc-blue-700)/30"
              aria-label={`${a.label} — ${a.desc}`}
            >
              <Card className="h-full p-4 transition group-hover:-translate-y-0.5 group-hover:shadow">
                <div className="flex items-start gap-3">
                  <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-(--lc-surface) text-(--lc-blue-800)">
                    <a.icon className="size-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-extrabold text-slate-900">{a.label}</div>
                    <div className="mt-1 line-clamp-2 text-xs text-slate-600">{a.desc}</div>
                  </div>
                </div>

                <div className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-(--lc-blue-700) opacity-90 group-hover:opacity-100">
                  Mở
                  <ArrowRight className="size-3.5" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

