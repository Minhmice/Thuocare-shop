"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CART_KEY, localDb } from "@/lib/local-db";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import type { CartLine } from "@/types/commerce";
import type { ProductCard } from "@/types/commerce";
import { getDefaultCategoryProducts } from "@/components/longchau-category-listing";

type SortKey = "ban-chay" | "gia-thap" | "gia-cao";

const SUB_TILES = [
  { label: "Sinh lý nam", count: "20 sản phẩm", icon: "🧑" },
  { label: "Cân bằng nội tiết tố", count: "11 sản phẩm", icon: "🧬" },
  { label: "Sinh lý nữ", count: "6 sản phẩm", icon: "👩" },
  { label: "Tiền mãn kinh - mãn kinh", count: "8 sản phẩm", icon: "🌿" },
];

const PRODUCTS: ProductCard[] = [
  ...getDefaultCategoryProducts().slice(0, 1),
  {
    id: "sam-nhung-bo-than-nv-hai-linh-30v-321",
    country: "Việt Nam",
    title: "Viên uống hỗ trợ bổ thận, tăng cường sinh lực Sâm Nhung Bổ Thận NV (30 viên)",
    price: { amount: 125000, display: "125.000đ" },
    unit: "Hộp 30 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_0_30b8d2a1e0.png",
  },
  {
    id: "best-king-jpanwell-60",
    country: "Nhật Bản",
    title: "Viên uống hỗ trợ tăng cường sinh lý và tăng khả năng sinh sản ở nam giới Best King Jpanwell (60 viên)",
    price: { amount: 1300000, display: "1.300.000đ" },
    unit: "Hộp 60 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Best_King_Jpanwell_60_vien_5b9a2a0b1e.png",
  },
  {
    id: "maca-f-female-empower-60",
    country: "Hoa Kỳ",
    title: "Viên uống hỗ trợ tăng sinh lý nữ, tăng cường nội tiết tố nữ Maca F Female Empower (60 viên)",
    price: { amount: 660000, display: "660.000đ" },
    unit: "Hộp 60 viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Maca_F_Female_Empower_60_vien_4e1d9a2c3f.png",
  },
  {
    id: "maca-m-male-power-60",
    country: "Hoa Kỳ",
    title: "Viên uống giúp bổ thận, tráng dương, tăng cường sinh lực nam Maca M Male Power (60 viên)",
    price: { amount: 660000, display: "660.000đ" },
    unit: "Hộp 60 viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Maca_M_Male_Power_60_vien_7a2b1c0d9e.png",
  },
  {
    id: "vitatree-oyster-extract-90",
    country: "Úc",
    title: "Viên uống hỗ trợ duy trì sức khỏe sinh sản cho nam giới Vitatree Oyster Extract (90 viên)",
    price: { amount: 660000, display: "660.000đ" },
    unit: "Hộp 90 viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Vitatree_Oyster_Extract_90_vien_4c2b1a0d9f.png",
  },
];

function Breadcrumbs() {
  return (
    <div className="mx-auto max-w-[1200px] px-3 pt-4 text-xs text-slate-500 sm:px-4">
      <a className="hover:text-[color:var(--lc-blue-700)] hover:underline" href="#">
        Trang chủ
      </a>{" "}
      /{" "}
      <Link className="hover:text-[color:var(--lc-blue-700)] hover:underline" href="/supplements">
        Thực phẩm chức năng
      </Link>{" "}
      / <span className="text-slate-700">Sinh lý - Nội tiết tố</span>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="border-t pt-4 first:border-t-0 first:pt-0">
      <div className="mb-2 text-sm font-extrabold text-slate-900">{title}</div>
      {children}
    </div>
  );
}

export function LongChauSubcategoryListing({ className }: { className?: string }) {
  const [sort, setSort] = React.useState<SortKey>("ban-chay");
  const [cartLines, setCartLines] = useLocalStorageState<CartLine[]>(CART_KEY, []);

  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);

  const sorted = React.useMemo(() => {
    const items = [...PRODUCTS];
    if (sort === "gia-thap") items.sort((a, b) => a.price.amount - b.price.amount);
    if (sort === "gia-cao") items.sort((a, b) => b.price.amount - a.price.amount);
    return items;
  }, [sort]);

  return (
    <section className={cn("bg-[color:var(--lc-surface)] pb-10", className)}>
      <Breadcrumbs />

      <div className="mx-auto max-w-[1200px] px-3 pb-4 pt-2 sm:px-4">
        <h1 className="text-lg font-extrabold text-slate-900">Sinh lý - Nội tiết tố</h1>

        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {SUB_TILES.map((t) => (
            <a
              key={t.label}
              href="#"
              className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
            >
              <div className="grid size-10 place-items-center rounded-xl bg-[color:var(--lc-surface)] text-lg">
                {t.icon}
              </div>
              <div>
                <div className="text-sm font-extrabold text-slate-900">{t.label}</div>
                <div className="text-xs text-slate-500">{t.count}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-4 px-3 sm:px-4 lg:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-2xl bg-white p-4 shadow-sm lg:block">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <span className="text-base">☰</span> Bộ lọc nâng cao
          </div>

          <FilterGroup title="Đối tượng sử dụng">
            <div className="space-y-2 text-sm">
              {[
                "Tất cả",
                "Người trưởng thành",
                "Người lớn",
                "Nữ giới trưởng thành",
                "Phụ nữ tuổi tiền mãn kinh và mãn kinh",
              ].map((t, i) => (
                <label key={t} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked={i === 0} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Giá bán">
            <div className="grid gap-2">
              {["Dưới 100.000đ", "100.000đ đến 300.000đ", "300.000đ đến 500.000đ", "Trên 500.000đ"].map((t) => (
                <button key={t} type="button" className="h-9 rounded-lg border bg-white text-xs font-semibold text-slate-700">
                  {t}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Chỉ định">
            <div className="space-y-2 text-sm">
              {["Tất cả", "Hội chứng tiền mãn kinh", "Yếu sinh lý", "Mãn kinh nữ", "Đau lưng"].map((t, i) => (
                <label key={t} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked={i === 0} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Thương hiệu">
            <div className="space-y-2 text-sm">
              {["Tất cả", "Ecogreen", "Á Âu", "Blackmores", "CEVRAI"].map((t, i) => (
                <label key={t} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked={i === 0} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </FilterGroup>
        </aside>

        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-extrabold text-slate-900">Danh sách sản phẩm</div>
              <div className="mt-1 text-xs text-slate-500">
                Lưu ý: Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ
              </div>
            </div>

            <div className="flex items-center gap-2 rounded-full bg-slate-100 p-1">
              {[
                { id: "ban-chay", label: "Bán chạy" },
                { id: "gia-thap", label: "Giá thấp" },
                { id: "gia-cao", label: "Giá cao" },
              ].map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSort(s.id as SortKey)}
                  className={cn(
                    "h-8 rounded-full px-3 text-xs font-semibold",
                    sort === s.id ? "bg-white text-[color:var(--lc-blue-700)] shadow" : "text-slate-700"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sorted.map((p) => {
              const isSamNhung = p.id === "sam-nhung-bo-than-nv-hai-linh-30v-321";
              const CardWrapper: React.FC<React.PropsWithChildren> = ({ children }) =>
                isSamNhung ? (
                  <Link href="/product/sam-nhung-kidney-tonic-nv-hai-linh-30-capsules-321" className="block">
                    {children}
                  </Link>
                ) : (
                  <a href="#" className="block">
                    {children}
                  </a>
                );

              return (
                <article key={p.id} className="rounded-2xl border bg-white p-3 shadow-sm transition hover:shadow">
                  <div className="mb-2 text-xs font-semibold text-slate-500">{p.country ?? ""}</div>
                  <CardWrapper>
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
                    </div>
                    <div className="mt-3 line-clamp-3 text-sm font-semibold text-slate-900">{p.title}</div>
                    <div className="mt-2 text-sm font-extrabold text-[color:var(--lc-blue-700)]">
                      {p.price.display} <span className="text-xs font-semibold text-slate-500">/ Hộp</span>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{p.unit ?? ""}</div>
                  </CardWrapper>

                  <Button
                    className="mt-3 h-9 w-full rounded-full bg-[color:var(--lc-blue-700)] text-white hover:bg-[color:var(--lc-blue-800)]"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      const next = localDb.cart.upsert(p.id, 1);
                      setCartLines(next);
                    }}
                  >
                    Chọn mua
                  </Button>
                </article>
              );
            })}
          </div>

          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Cart(localStorage): <span className="font-semibold text-slate-700">{cartCount}</span>
            </div>
            <Button variant="secondary" className="h-9 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200">
              Xem thêm 35 sản phẩm
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

