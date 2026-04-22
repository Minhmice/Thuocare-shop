"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import type { ProductCard } from "@/types/commerce";
import { ProductGrid } from "@/components/catalog/listing/product-grid";
import { SortPills, type SortKey } from "@/components/catalog/listing/sort-pills";
import { FilterGroup } from "@/components/catalog/listing/filters/filter-group";
import { FilterCheckboxList } from "@/components/catalog/listing/filters/filter-checkbox-list";

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
    title:
      "Siro bổ sung lợi khuẩn cho hệ tiêu hóa, giảm rối loạn tiêu hóa, cân bằng đường ruột Bio Plus Kenko (10 gói x 15g)",
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

export function getDefaultCategoryProducts() {
  return DEFAULT_PRODUCTS;
}

export function CategoryListing({
  className,
  products,
  title = "Danh mục",
}: {
  className?: string;
  products: ProductCard[];
  title?: string;
}) {
  const [sort, setSort] = React.useState<SortKey>("ban-chay");
  const [mobileFiltersOpen, setMobileFiltersOpen] = React.useState(false);

  const sorted = React.useMemo(() => {
    const items = [...products];
    if (sort === "gia-thap") items.sort((a, b) => a.price.amount - b.price.amount);
    if (sort === "gia-cao") items.sort((a, b) => b.price.amount - a.price.amount);
    return items;
  }, [products, sort]);

  return (
    <section className={cn("bg-(--lc-surface) pb-10", className)}>
      <Breadcrumbs items={[{ label: "Trang chủ", href: "/" }, { label: "Thực phẩm chức năng" }]} />

      <div className="mx-auto max-w-[1200px] px-3 pb-6 pt-2 sm:px-4">
        <h1 className="text-lg font-extrabold text-slate-900">{title}</h1>

        <div className="mt-3 flex flex-wrap gap-2">
          {CATEGORY_CHIPS.map((c) => (
            <a
              key={c}
              href="#"
              className="rounded-full border bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:border-(--lc-blue-700) hover:text-(--lc-blue-700)"
            >
              {c}
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-4 px-3 sm:px-4 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <span className="text-base">☰</span> Bộ lọc nâng cao
            </div>

            <FilterGroup title="Đối tượng sử dụng">
              <FilterCheckboxList items={["Tất cả", "Trẻ em", "Người lớn", "Người trưởng thành", "Phụ nữ có thai"]} />
            </FilterGroup>

            <FilterGroup title="Giá bán">
              <div className="grid gap-2">
                {["Dưới 100.000đ", "100.000đ đến 300.000đ", "300.000đ đến 500.000đ", "Trên 500.000đ"].map((t) => (
                  <Button
                    key={t}
                    type="button"
                    variant="outline"
                    className="h-9 justify-start rounded-lg text-xs font-semibold text-slate-700 hover:border-(--lc-blue-700) hover:text-(--lc-blue-700)"
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Nước sản xuất">
              <FilterCheckboxList items={["Tất cả", "Việt Nam", "Hoa Kỳ", "Nhật Bản", "Úc"]} />
            </FilterGroup>
          </Card>
        </aside>

        <Card className="p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-extrabold text-slate-900">Danh sách sản phẩm</div>
              <div className="mt-1 text-xs text-slate-500">Lưu ý: Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ</div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-9 rounded-full px-3 text-xs font-semibold text-slate-800 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                Lọc
              </Button>

              <SortPills value={sort} onValueChange={setSort} />
            </div>
          </div>

          <ProductGrid products={sorted} />

          <div className="mt-6 flex items-center justify-end gap-3">
            <Button variant="secondary" className="h-9 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200">
              Xem thêm 573 sản phẩm
            </Button>
          </div>
        </Card>
      </div>

      {mobileFiltersOpen ? (
        <div className="fixed inset-0 z-50 bg-black/40 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-y-0 left-0 w-[320px] max-w-[88vw] bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="text-sm font-extrabold text-slate-900">Bộ lọc nâng cao</div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="size-9 rounded-full"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Đóng"
              >
                ✕
              </Button>
            </div>

            <FilterGroup title="Đối tượng sử dụng">
              <FilterCheckboxList items={["Tất cả", "Trẻ em", "Người lớn", "Người trưởng thành", "Phụ nữ có thai"]} />
            </FilterGroup>

            <FilterGroup title="Giá bán">
              <div className="grid gap-2">
                {["Dưới 100.000đ", "100.000đ đến 300.000đ", "300.000đ đến 500.000đ", "Trên 500.000đ"].map((t) => (
                  <Button key={t} type="button" variant="outline" className="h-9 justify-start rounded-lg text-xs font-semibold">
                    {t}
                  </Button>
                ))}
              </div>
            </FilterGroup>
          </div>
        </div>
      ) : null}
    </section>
  );
}

