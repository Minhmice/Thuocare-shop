"use client";

import * as React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CART_KEY, localDb } from "@/lib/local-db";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import type { ProductCard } from "@/types/commerce";
import type { CartLine } from "@/types/commerce";

const CATEGORY_CHIPS = [
  "Vitamin & Khoáng chất",
  "Miễn dịch - Đề kháng",
  "Sinh lý - Nội tiết tố",
  "Mắt - Thị lực",
  "Tiêu hóa",
  "Thần kinh não",
  "Hỗ trợ làm đẹp",
  "Đường huyết - Tiểu đường",
  "Tim mạch - Huyết áp",
  "Hô hấp - Tai mũi họng",
  "Cơ xương khớp",
  "Gan - Mật",
  "Thận - Tiết niệu",
  "Sữa",
];

const DEFAULT_PRODUCTS: ProductCard[] = [
  {
    id: "lactobact-intima-30",
    country: "Đức",
    title: "Viên uống bổ sung lợi khuẩn, D-mannose, việt quất cho phụ nữ Lactobact Intima (30 viên)",
    price: { amount: 685000, display: "685.000đ" },
    unit: "Hộp 30 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Lactobact_Intima_30_vien_ef6b91ed4a.png",
  },
  {
    id: "lacto-biomin-gold-20x5g",
    country: "Việt Nam",
    title: "Cốm vi sinh bổ sung lợi khuẩn đường ruột Lacto Biomin Gold+ New (20 gói x 5g)",
    price: { amount: 149000, display: "149.000đ" },
    unit: "Hộp 20 Gói x 5g",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Lacto_Biomin_Gold_New_20_goi_x_5g_0b3f6b6f0b.png",
  },
  {
    id: "kanzo-gold-60",
    country: "Nhật Bản",
    title: "Viên uống bổ gan hỗ trợ tăng cường chức năng gan Kanzo Gold (60 viên)",
    price: { amount: 960000, display: "960.000đ" },
    unit: "Hộp 60 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Kanzo_Gold_60_vien_f2a1f0b7b0.png",
  },
  {
    id: "hoat-huyet-thong-mach-gold",
    country: "Việt Nam",
    title:
      "Viên uống hỗ trợ giảm nguy cơ tắc mạch, tăng tuần hoàn não Hoạt Huyết Thông Mạch Gold TW3 Foripharm (3 vỉ x 10 viên)",
    price: { amount: 120000, display: "120.000đ" },
    unit: "Hộp 3 Vỉ x 10 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Hoat_Huyet_Thong_Mach_Gold_TW3_3_vi_x_10_vien_8f2d84f8b7.png",
  },
  {
    id: "bo-nao-ich-tri-gold-60",
    country: "Việt Nam",
    title: "Viên uống tăng cường tuần hoàn não, giảm rối loạn tiền đình Bổ Não Ích Trí Gold (60 viên)",
    price: { amount: 210000, display: "210.000đ" },
    unit: "Hộp 60 viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Bo_Nao_Ich_Tri_Gold_60_vien_15a8a2f7d7.png",
  },
  {
    id: "d3-drops-dao-10ml",
    country: "Đan Mạch",
    title: "Dung dịch hỗ trợ phát triển xương, răng cho trẻ D3 Drops DAO Nordic Health (10ml)",
    price: { amount: 270000, display: "270.000đ" },
    unit: "Hộp x 10ml",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/D3_Drops_DAO_Nordic_Health_10ml_2d79f78d1a.png",
  },
  {
    id: "bio-plus-kenko-10x15g",
    country: "Nhật Bản",
    title: "Siro bổ sung lợi khuẩn cho hệ tiêu hóa, giảm rối loạn tiêu hóa, cân bằng đường ruột Bio Plus Kenko (10 gói x 15g)",
    price: { amount: 560000, display: "560.000đ" },
    unit: "Hộp 10 Gói x 15g",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Bio_Plus_Kenko_10_goi_x_15g_4f75bc2ff9.png",
  },
  {
    id: "bo-phe-labebe-120",
    country: "Việt Nam",
    title: "Siro hỗ giúp giảm ho, giảm đờm, giảm đau họng Bổ Phế Lábebé (120ml)",
    price: { amount: 75000, display: "75.000đ" },
    unit: "Hộp x 120ml",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Bo_Phe_Labebe_120ml_3d5e2b4d8a.png",
  },
  {
    id: "omega3-power-dao-120",
    country: "Đan Mạch",
    title:
      "Viên uống hỗ trợ sức khoẻ tim mạch, giảm mỡ máu, tốt cho não và thị lực Omega 3 Power DAO Nordic Health (120 viên)",
    price: { amount: 330000, display: "330.000đ" },
    unit: "Hộp 120 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Omega_3_Power_DAO_Nordic_Health_120_vien_7bdfb2c6ee.png",
  },
  {
    id: "nutrigrow-nutrimed-60",
    country: "Hoa Kỳ",
    title: "Viên uống bổ sung canxi, giúp tăng chiều cao cho trẻ NutriGrow Nutrimed (60 viên)",
    price: { amount: 480000, display: "480.000đ" },
    unit: "Hộp 60 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/NutriGrow_Nutrimed_60_vien_9a3a5f7e4f.png",
  },
  {
    id: "immuvita-easylife-100",
    title: "Viên uống bổ sung vitamin và khoáng chất cho cơ thể, tăng sức khỏe Immuvita Easylife (100 viên)",
    price: { amount: 410000, display: "410.000đ" },
    unit: "Hộp 100 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Immuvita_Easylife_100_vien_3a9f0c1d2b.png",
  },
  {
    id: "canxi-d3-k2-6vix5ong",
    country: "Việt Nam",
    title: "Siro bổ sung canxi & vitamin D3, K2 cho cơ thể Canxi-D3-K2 Kingphar (6 vỉ x 5 ống x 5ml)",
    price: { amount: 115000, display: "115.000đ" },
    unit: "Hộp 6 Vỉ x 5 Ống x 5ml",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Canxi_D3_K2_Kingphar_6_vi_x_5_ong_x_5ml_4a19d54a3f.png",
  },
];

type SortKey = "ban-chay" | "gia-thap" | "gia-cao";

function Breadcrumbs() {
  return (
    <div className="mx-auto max-w-[1200px] px-3 pt-4 text-xs text-slate-500 sm:px-4">
      <a className="hover:text-[color:var(--lc-blue-700)] hover:underline" href="#">
        Trang chủ
      </a>{" "}
      / <span className="text-slate-700">Thực phẩm chức năng</span>
    </div>
  );
}

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t pt-4 first:border-t-0 first:pt-0">
      <div className="mb-2 text-sm font-extrabold text-slate-900">{title}</div>
      {children}
    </div>
  );
}

export function LongChauCategoryListing({
  className,
  products,
  title = "Danh mục",
}: {
  className?: string;
  products: ProductCard[];
  title?: string;
}) {
  const [sort, setSort] = React.useState<SortKey>("ban-chay");
  const [cartLines, setCartLines] = useLocalStorageState<CartLine[]>(CART_KEY, []);
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);

  const sorted = React.useMemo(() => {
    const items = [...products];
    if (sort === "gia-thap") items.sort((a, b) => a.price.amount - b.price.amount);
    if (sort === "gia-cao") items.sort((a, b) => b.price.amount - a.price.amount);
    return items;
  }, [products, sort]);

  return (
    <section className={cn("bg-[color:var(--lc-surface)] pb-10", className)}>
      <Breadcrumbs />

      <div className="mx-auto max-w-[1200px] px-3 pb-6 pt-2 sm:px-4">
        <h1 className="text-lg font-extrabold text-slate-900">{title}</h1>

        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORY_CHIPS.map((c) => (
            <a
              key={c}
              href="#"
              className="rounded-full border bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-[color:var(--lc-blue-700)] hover:text-[color:var(--lc-blue-700)]"
            >
              {c}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-4 px-3 sm:px-4 lg:grid-cols-[280px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden rounded-2xl bg-white p-4 shadow-sm lg:block">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <span className="text-base">☰</span> Bộ lọc nâng cao
          </div>

          <FilterGroup title="Đối tượng sử dụng">
            <div className="space-y-2 text-sm">
              {["Tất cả", "Trẻ em", "Người lớn", "Người trưởng thành", "Phụ nữ có thai"].map((t, i) => (
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
                <button
                  key={t}
                  type="button"
                  className="h-9 rounded-lg border bg-white text-xs font-semibold text-slate-700 hover:border-[color:var(--lc-blue-700)] hover:text-[color:var(--lc-blue-700)]"
                >
                  {t}
                </button>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Nước sản xuất">
            <div className="space-y-2 text-sm">
              {["Tất cả", "Việt Nam", "Hoa Kỳ", "Nhật Bản", "Úc"].map((t, i) => (
                <label key={t} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked={i === 0} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </FilterGroup>
        </aside>

        {/* Content */}
        <div className="rounded-2xl bg-white p-4 shadow-sm">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-extrabold text-slate-900">Danh sách sản phẩm</div>
              <div className="mt-1 text-xs text-slate-500">
                Lưu ý: Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                className="inline-flex h-9 items-center rounded-full border bg-white px-3 text-xs font-semibold text-slate-800 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                Lọc
              </button>

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
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sorted.map((p) => (
              <article key={p.id} className="rounded-2xl border bg-white p-3 shadow-sm transition hover:shadow">
                <div className="mb-2 text-xs font-semibold text-slate-500">{p.country ?? ""}</div>
                <div className="relative overflow-hidden rounded-xl bg-[color:var(--lc-surface)]">
                  {p.imageUrl ? (
                    <Image src={p.imageUrl} alt={p.title} width={256} height={256} className="h-36 w-full object-contain" />
                  ) : (
                    <div className="h-36 w-full" />
                  )}
                </div>

                <div className="mt-3 line-clamp-3 text-sm font-semibold text-slate-900">{p.title}</div>

                <div className="mt-2 text-sm font-extrabold text-[color:var(--lc-blue-700)]">
                  {p.price.display} <span className="text-xs font-semibold text-slate-500">/ Hộp</span>
                </div>
                <div className="mt-1 text-xs text-slate-500">{p.unit ?? ""}</div>

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

          <div className="mt-6 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Cart(localStorage): <span className="font-semibold text-slate-700">{cartCount}</span>
            </div>
            <Button variant="secondary" className="h-9 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200">
              Xem thêm 573 sản phẩm
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile filter sheet (simple) */}
      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-y-0 left-0 w-[320px] max-w-[88vw] bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-extrabold text-slate-900">Bộ lọc nâng cao</div>
              <button
                type="button"
                className="grid size-9 place-items-center rounded-full border"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Đóng"
              >
                ✕
              </button>
            </div>

            <FilterGroup title="Đối tượng sử dụng">
              <div className="space-y-2 text-sm">
                {["Tất cả", "Trẻ em", "Người lớn", "Người trưởng thành", "Phụ nữ có thai"].map((t, i) => (
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
                  <button
                    key={t}
                    type="button"
                    className="h-9 rounded-lg border bg-white text-xs font-semibold text-slate-700"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </FilterGroup>
          </div>
        </div>
      ) : null}
    </section>
  );
}

export function getDefaultCategoryProducts() {
  return DEFAULT_PRODUCTS;
}

