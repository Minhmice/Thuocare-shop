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

type SortKey = "ban-chay" | "gia-thap" | "gia-cao";

type ListingProduct = ProductCard & {
  compareAtDisplay?: string;
  badge?: string;
};

const PRODUCTS: ListingProduct[] = [
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
    id: "maca-m-male-power-60",
    country: "Hoa Kỳ",
    title: "Viên uống giúp bổ thận, tráng dương, tăng cường sinh lực nam Maca M Male Power (60 viên)",
    price: { amount: 660000, display: "660.000đ" },
    unit: "Hộp 60 viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Maca_M_Male_Power_60_vien_7a2b1c0d9e.png",
  },
  {
    id: "tw3-platinum-60",
    country: "Việt Nam",
    title: "Viên uống hỗ trợ bổ thận tráng dương, cải thiện sinh lý nam Sâm Nhung Bổ Thận TW3 Platinum (60 viên)",
    price: { amount: 688000, display: "688.000đ" },
    unit: "Hộp 60 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Sam_Nhung_Bo_Than_TW3_Platinum_60_vien_0a1b2c3d4e.png",
  },
  {
    id: "kaki-ekisu-60",
    country: "Nhật Bản",
    title: "Viên uống hỗ trợ tăng cường sinh lý nam giới Kaki Ekisu Tohchukasou Kenkan (60 viên)",
    price: { amount: 515000, display: "515.000đ" },
    unit: "Hộp 60 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Kaki_Ekisu_Tohchukasou_Kenkan_60_vien_1a2b3c4d5e.png",
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
  {
    id: "via-him-lab-well-30",
    country: "Hoa Kỳ",
    title: "Viên uống giúp tăng cường sinh lực và khả năng sinh lý nam Via Him Lab Well (30 viên)",
    price: { amount: 318000, display: "318.000đ" },
    unit: "Hộp 30 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Via_Him_Lab_Well_30_vien_1b2c3d4e5f.png",
  },
  {
    id: "bang-cevrai-60",
    country: "Pháp",
    title: "Viên nam lực cải thiện chức năng sinh lý cho người trưởng thành Bang Cevrai (60 viên)",
    price: { amount: 530000, display: "530.000đ" },
    unit: "Chai 60 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Bang_Cevrai_60_vien_0f1e2d3c4b.png",
  },
  {
    id: "rocket-1h-6",
    country: "Việt Nam",
    title: "Viên hỗ trợ tăng cường sinh lực nam giới Rocket 1h Sao Thái Dương (6 viên)",
    price: { amount: 300000, display: "300.000đ" },
    unit: "Hộp 6 viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Rocket_1h_6_vien_0a9b8c7d6e.png",
  },
  {
    id: "tw3-platinum-30",
    country: "Việt Nam",
    title: "Viên uống bổ Thận tráng dương TW3 Platinum (30 viên)",
    price: { amount: 362000, display: "362.000đ" },
    unit: "Hộp 30 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/TW3_Platinum_30_vien_2a3b4c5d6e.png",
  },
  {
    id: "orihiro-new-oyster-120",
    country: "Nhật Bản",
    title: "Viên uống tăng cường sinh lý cho nam giới Orihiro New Oyster Extract (120 viên)",
    price: { amount: 550000, display: "550.000đ" },
    unit: "Hộp 120 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Orihiro_New_Oyster_Extract_120_vien_0a1b2c3d4e.png",
  },
  {
    id: "blackmores-multivitamin-men-50",
    country: "Úc",
    badge: "-10%",
    title: "Viên hỗ trợ sức khỏe nam giới Blackmores Multivitamin For Men (50 viên)",
    price: { amount: 504900, display: "504.900đ" },
    compareAtDisplay: "561.000đ",
    unit: "Hộp 50 Viên",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/Blackmores_Multivitamin_For_Men_50_vien_0a1b2c3d4e.png",
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
      /{" "}
      <Link className="hover:text-[color:var(--lc-blue-700)] hover:underline" href="/supplements/hormones">
        Sinh lý - Nội tiết tố
      </Link>{" "}
      / <span className="text-slate-700">Sinh lý nam</span>
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

export function LongChauMaleListing({ className }: { className?: string }) {
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
        <h1 className="text-lg font-extrabold text-slate-900">Sinh lý nam</h1>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-4 px-3 sm:px-4 lg:grid-cols-[280px_1fr]">
        <aside className="hidden rounded-2xl bg-white p-4 shadow-sm lg:block">
          <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
            <span className="text-base">☰</span> Bộ lọc nâng cao
          </div>

          <FilterGroup title="Đối tượng sử dụng">
            <div className="space-y-2 text-sm">
              {["Tất cả", "Người trưởng thành", "Nam giới trưởng thành"].map((t, i) => (
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
              {["Tất cả", "Yếu sinh lý", "Mỏi gối", "Đau lưng", "Mãn dục nam"].map((t, i) => (
                <label key={t} className="flex items-center gap-2">
                  <input type="checkbox" defaultChecked={i === 0} />
                  <span>{t}</span>
                </label>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Thương hiệu">
            <div className="space-y-2 text-sm">
              {["Tất cả", "Ecogreen", "Tw3", "Blackmores", "CEVRAI"].map((t, i) => (
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
              const Wrapper: React.FC<React.PropsWithChildren> = ({ children }) =>
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
                  <div className="mb-2 flex items-center justify-between gap-2 text-xs">
                    <div className="font-semibold text-slate-500">{p.country ?? ""}</div>
                    {p.badge ? (
                      <div className="rounded-full bg-red-600 px-2 py-0.5 font-semibold text-white">{p.badge}</div>
                    ) : null}
                  </div>

                  <Wrapper>
                    <div className="relative overflow-hidden rounded-xl bg-[color:var(--lc-surface)]">
                      {p.imageUrl ? (
                        <Image src={p.imageUrl} alt={p.title} width={256} height={256} className="h-36 w-full object-contain" />
                      ) : (
                        <div className="h-36 w-full" />
                      )}
                    </div>
                    <div className="mt-3 line-clamp-3 text-sm font-semibold text-slate-900">{p.title}</div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <div className="text-sm font-extrabold text-[color:var(--lc-blue-700)]">
                        {p.price.display} <span className="text-xs font-semibold text-slate-500">/ Hộp</span>
                      </div>
                      {p.compareAtDisplay ? (
                        <div className="text-xs font-semibold text-slate-400 line-through">{p.compareAtDisplay}</div>
                      ) : null}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{p.unit ?? ""}</div>
                  </Wrapper>

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
              Xem thêm 8 sản phẩm
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

