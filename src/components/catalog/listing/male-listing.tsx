"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { ProductCard } from "@/types/commerce";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { SortPills, type SortKey } from "@/components/catalog/listing/sort-pills";
import { FilterGroup } from "@/components/catalog/listing/filters/filter-group";
import { FilterCheckboxList } from "@/components/catalog/listing/filters/filter-checkbox-list";
import { ProductGrid } from "@/components/catalog/listing/product-grid";

type ListingProduct = ProductCard & { badge?: string };

const PRODUCTS: ListingProduct[] = [
  {
    id: "sam-nhung-bo-than-nv-hai-linh-30v-321",
    country: "Việt Nam",
    title: "Viên uống hỗ trợ bổ thận, tăng cường sinh lực Sâm Nhung Bổ Thận NV (30 viên)",
    price: { amount: 125000, display: "125.000đ" },
    unit: "Hộp 30 Viên",
    imageUrl: undefined,
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
];

export function MaleListing({ className }: { className?: string }) {
  const [sort, setSort] = React.useState<SortKey>("ban-chay");

  const sorted = React.useMemo(() => {
    const items = [...PRODUCTS];
    if (sort === "gia-thap") items.sort((a, b) => a.price.amount - b.price.amount);
    if (sort === "gia-cao") items.sort((a, b) => b.price.amount - a.price.amount);
    return items;
  }, [sort]);

  return (
    <section className={cn("bg-(--lc-surface) pb-10", className)}>
      <Breadcrumbs
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Thực phẩm chức năng", href: "/supplements" },
          { label: "Sinh lý - Nội tiết tố", href: "/supplements/hormones" },
          { label: "Sinh lý nam" },
        ]}
      />

      <div className="mx-auto max-w-[1200px] px-3 pb-4 pt-2 sm:px-4">
        <h1 className="text-lg font-extrabold text-slate-900">Sinh lý nam</h1>
      </div>

      <div className="mx-auto grid max-w-[1200px] gap-4 px-3 sm:px-4 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <Card className="p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-extrabold text-slate-900">
              <span className="text-base">☰</span> Bộ lọc nâng cao
            </div>

            <FilterGroup title="Đối tượng sử dụng">
              <FilterCheckboxList items={["Tất cả", "Người trưởng thành", "Nam giới trưởng thành"]} />
            </FilterGroup>

            <FilterGroup title="Giá bán">
              <div className="grid gap-2">
                {["Dưới 100.000đ", "100.000đ đến 300.000đ", "300.000đ đến 500.000đ", "Trên 500.000đ"].map((t) => (
                  <Button key={t} type="button" variant="outline" className="h-9 justify-start rounded-lg text-xs font-semibold text-slate-700">
                    {t}
                  </Button>
                ))}
              </div>
            </FilterGroup>

            <FilterGroup title="Chỉ định">
              <FilterCheckboxList items={["Tất cả", "Yếu sinh lý", "Mỏi gối", "Đau lưng", "Mãn dục nam"]} />
            </FilterGroup>

            <FilterGroup title="Thương hiệu">
              <FilterCheckboxList items={["Tất cả", "Ecogreen", "Tw3", "Blackmores", "CEVRAI"]} />
            </FilterGroup>
          </Card>
        </aside>

        <Card className="p-4">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-sm font-extrabold text-slate-900">Danh sách sản phẩm</div>
              <div className="mt-1 text-xs text-slate-500">Lưu ý: Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ</div>
            </div>

            <SortPills value={sort} onValueChange={setSort} />
          </div>

          <ProductGrid products={sorted} />
        </Card>
      </div>
    </section>
  );
}

