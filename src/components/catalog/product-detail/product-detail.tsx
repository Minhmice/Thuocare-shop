"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CART_KEY, localDb } from "@/lib/local-db";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import type { CartLine } from "@/types/commerce";
import type { ProductDetailData } from "@/data/products";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { IngredientsDialog } from "@/components/catalog/product-detail/ingredients-dialog";
import { ProductGallery } from "@/components/catalog/product-detail/product-gallery";
import { QuantitySelector } from "@/components/catalog/product-detail/quantity-selector";
import { DetailTabsMobile } from "@/components/catalog/product-detail/detail-tabs-mobile";
import { DetailSectionsDesktop } from "@/components/catalog/product-detail/detail-sections-desktop";
import { MobileStickyBuyBar } from "@/components/catalog/product-detail/mobile-sticky-buy-bar";
import { formatVnd } from "@/lib/money";

type ProductDetail = {
  id: string;
  title: string;
  country: string;
  brand: string;
  priceDisplay: string;
  unitLabel: string;
  regNo: string;
  shortDesc: string;
  images: Array<{ src: string; alt: string }>;
  ingredientsPreview: string;
  tabs: Array<{ id: string; label: string; content: React.ReactNode }>;
};

const PRODUCT: ProductDetail = {
  id: "sam-nhung-bo-than-nv-hai-linh-30v-321",
  title: "Viên uống hỗ trợ bổ thận, tăng cường sinh lực Sâm Nhung Bổ Thận NV (30 viên)",
  country: "Việt Nam",
  brand: "Dolexphar",
  priceDisplay: "125.000đ",
  unitLabel: "Hộp",
  regNo: "5209/2019/ÐKSP",
  shortDesc:
    "Sâm Nhung Bổ Thận NV giúp bổ thận, tráng dương, mạnh gân cốt, ăn ngủ tốt, tăng cường sinh lực, giúp giảm tình trạng mãn dục nam, yếu sinh lý, đau lưng, mỏi gối.",
  images: [
    {
      src: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_1_4a8c0f6f2b.png",
      alt: "Sâm Nhung Bổ Thận NV (30 viên)",
    },
    {
      src: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_1_4a8c0f6f2b.png",
      alt: "Sâm Nhung Bổ Thận NV (30 viên) - ảnh 2",
    },
    {
      src: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_2_6abf01b99f.png",
      alt: "Sâm Nhung Bổ Thận NV (30 viên) - ảnh 3",
    },
    {
      src: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_3_2a8587e8d8.png",
      alt: "Sâm Nhung Bổ Thận NV (30 viên) - ảnh 4",
    },
    {
      src: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_4_48cf62b3d0.png",
      alt: "Sâm Nhung Bổ Thận NV (30 viên) - ảnh 5",
    },
  ],
  ingredientsPreview:
    "1 viên chứa: Nhung hươu (2.4mg), Cao ban long (7.2mg), Dâm dương hoắc (200mg), Viễn chí (16mg), Đỗ trọng (24mg), Đảng Sâm (24mg), Xuyên khung (28mg), Trạch tả (30mg), Cẩu tích (30mg), Thỏ ty tử (40mg), Nhân Sâm (80mg), Đương quy (40mg), Bạch linh (40mg), Tục đoạn (58mg), Hà thủ ô đỏ (58mg), Bách hợp (60mg), Ba kích (200mg), Hoài Sơn (76mg), Liên Nhục (88mg), Thục địa (258mg), Cam thảo (5mg), Bạch truật (36mg).",
  tabs: [
    {
      id: "mo-ta",
      label: "Mô tả sản phẩm",
      content: (
        <div className="prose prose-slate max-w-none">
          <h2>Mô tả sản phẩm</h2>
          <h3>Hỗ trợ bổ thận, tăng cường sinh lực phái mạnh</h3>
          <p>
            Sâm Nhung Bổ Thận NV ra đời dựa trên sự kết hợp giữa tinh hoa y học cổ truyền và ứng dụng công nghệ sản xuất
            hiện đại. Sản phẩm có chứa rất nhiều thành phần quý, đặc biệt tốt cho những nam giới bị suy giảm chức năng
            thận.
          </p>
          <h3>Tăng cường chức năng thận</h3>
          <p>Vị thuốc cẩu tích và đỗ trọng có trong Sâm Nhung Bổ Thận NV có tác dụng bổ can thận, giảm đau lưng...</p>
          <h3>Tăng cường sinh lý, làm chậm mãn dục nam</h3>
          <p>Cũng chính bởi khả năng tăng cường chức năng thận mà các vấn đề như yếu sinh lý...</p>
          <h3>Tăng cường sinh lực, giúp cơ thể khỏe mạnh</h3>
          <p>Song song với khả năng bổ thận, tăng cường chức năng sinh lý nam giới, Sâm Nhung Bổ Thận NV còn giúp kiện tỳ...</p>
          <h3>An toàn, lành tính, hiệu quả lâu dài</h3>
          <p>Sâm Nhung Bổ Thận NV được chiết xuất từ 100% thảo dược tự nhiên, không chứa các thành phần tân dược...</p>
        </div>
      ),
    },
    {
      id: "cong-dung",
      label: "Công dụng",
      content: (
        <div className="prose prose-slate max-w-none">
          <h2>Công dụng</h2>
          <p>
            Sâm Nhung Bổ Thận hỗ trợ bổ thận, tăng cường khả năng sinh lý, hỗ trợ tăng cường sinh lực, làm chậm quá trình
            mãn dục nam.
          </p>
        </div>
      ),
    },
    {
      id: "cach-dung",
      label: "Cách dùng",
      content: (
        <div className="prose prose-slate max-w-none">
          <h2>Cách dùng</h2>
          <p>
            <strong>Cách dùng:</strong> Ngày uống 2 lần vào sáng và chiều, mỗi lần 2 viên. Uống lúc đói. Mỗi đợt dùng 4 - 6 tuần.
          </p>
        </div>
      ),
    },
    { id: "tac-dung-phu", label: "Tác dụng phụ", content: <div className="prose prose-slate max-w-none"><h2>Tác dụng phụ</h2><p>Chưa có thông tin về tác dụng phụ của sản phẩm.</p></div> },
    {
      id: "luu-y",
      label: "Lưu ý",
      content: (
        <div className="prose prose-slate max-w-none">
          <h2>Lưu ý</h2>
          <ul>
            <li>Không dùng quá liều khuyến cáo.</li>
            <li>Không sử dụng cho người dưới 18 tuổi, người mẫn cảm với bất kỳ thành phần nào của sản phẩm.</li>
            <li>Sản phẩm này không phải là thuốc và không có tác dụng thay thế thuốc chữa bệnh.</li>
            <li>Đọc kỹ hướng dẫn sử dụng trước khi dùng.</li>
          </ul>
        </div>
      ),
    },
    {
      id: "bao-quan",
      label: "Bảo quản",
      content: (
        <div className="prose prose-slate max-w-none">
          <h2>Bảo quản</h2>
          <ul>
            <li>Bảo quản nơi khô ráo, thoáng mát, tránh ánh sáng trực tiếp.</li>
            <li>Để xa tầm tay trẻ em.</li>
          </ul>
        </div>
      ),
    },
  ],
};

const INGREDIENT_ROWS: Array<{ name: string; amount: string }> = [
  { name: "Nhung hươu", amount: "2.4mg" },
  { name: "Cao ban long", amount: "7.2mg" },
  { name: "Dâm dương hoắc", amount: "200mg" },
  { name: "Viễn chí", amount: "16mg" },
  { name: "Đỗ trọng", amount: "24mg" },
  { name: "Đảng Sâm", amount: "24mg" },
  { name: "Xuyên khung", amount: "28mg" },
  { name: "Trạch tả", amount: "30mg" },
  { name: "Cẩu tích", amount: "30mg" },
  { name: "Thỏ ty tử", amount: "40mg" },
  { name: "Nhân Sâm", amount: "80mg" },
  { name: "Đương quy", amount: "40mg" },
  { name: "Bạch linh", amount: "40mg" },
  { name: "Tục đoạn", amount: "58mg" },
  { name: "Hà thủ ô đỏ", amount: "58mg" },
  { name: "Bách hợp", amount: "60mg" },
  { name: "Ba kích", amount: "200mg" },
  { name: "Hoài Sơn", amount: "76mg" },
  { name: "Liên Nhục", amount: "88mg" },
  { name: "Thục địa", amount: "258mg" },
  { name: "Cam thảo", amount: "5mg" },
  { name: "Bạch truật", amount: "36mg" },
];

export function ProductDetail({ className }: { className?: string }) {
  const [activeImgIdx, setActiveImgIdx] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<string>(PRODUCT.tabs[0]?.id ?? "mo-ta");
  const [ingredientsOpen, setIngredientsOpen] = React.useState(false);
  const [cartLines, setCartLines] = useLocalStorageState<CartLine[]>(CART_KEY, []);

  function addToCart() {
    const next = localDb.cart.upsert(PRODUCT.id, qty);
    setCartLines(next);
  }

  return (
    <section className={cn("bg-(--lc-surface) pb-20 sm:pb-10", className)}>
      <Breadcrumbs
        items={[
          { label: "Trang chủ", href: "/" },
          { label: "Thực phẩm chức năng", href: "/supplements" },
          { label: "Sinh lý - Nội tiết tố", href: "/supplements/hormones" },
          { label: "Sinh lý nam" },
        ]}
      />

      <div className="mx-auto max-w-[1200px] px-3 pb-8 pt-3 sm:px-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[520px_1fr]">
            <ProductGallery images={PRODUCT.images} activeIdx={activeImgIdx} setActiveIdx={setActiveImgIdx} />

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-semibold">
                  <span className="inline-block size-2 rounded-full bg-red-500" />
                  {PRODUCT.country}
                </span>
                <span className="text-slate-400">|</span>
                <span>
                  Thương hiệu: <span className="font-semibold text-slate-800">{PRODUCT.brand}</span>
                </span>
              </div>

              <h1 className="mt-2 text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">{PRODUCT.title}</h1>

              <div className="mt-4 flex items-end gap-2">
                <div className="text-3xl font-extrabold text-(--lc-blue-700)">{PRODUCT.priceDisplay}</div>
                <div className="pb-1 text-sm text-slate-600">/ {PRODUCT.unitLabel}</div>
              </div>

              <div className="mt-4 grid gap-3 sm:max-w-[420px]">
                <div className="grid grid-cols-[120px_1fr] items-center gap-3 text-sm">
                  <div className="text-slate-600">Chọn đơn vị tính</div>
                  <div className="inline-flex h-9 items-center rounded-full border bg-white px-4 font-semibold">{PRODUCT.unitLabel}</div>
                </div>

                <div className="grid grid-cols-[120px_1fr] items-center gap-3 text-sm">
                  <div className="text-slate-600">Chọn số lượng</div>
                  <QuantitySelector qty={qty} setQty={setQty} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button className="h-11 rounded-full bg-(--lc-blue-700) text-white hover:bg-(--lc-blue-800)" onClick={addToCart}>
                    Chọn mua
                  </Button>
                  <Button variant="secondary" className="h-11 rounded-full bg-slate-100 text-slate-800 hover:bg-slate-200">
                    Tìm nhà thuốc
                  </Button>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-700">{PRODUCT.shortDesc}</p>

              <div className="mt-4 grid gap-2 text-sm">
                <div className="grid grid-cols-[120px_1fr] gap-3">
                  <div className="text-slate-600">Số đăng ký</div>
                  <div className="font-semibold text-slate-900">{PRODUCT.regNo}</div>
                </div>
                <div className="grid grid-cols-[120px_1fr] gap-3">
                  <div />
                  <a className="text-xs font-semibold text-(--lc-blue-700) hover:underline" href="#">
                    Xem giấy công bố sản phẩm
                  </a>
                </div>

                <div className="mt-2 grid grid-cols-[120px_1fr] gap-3">
                  <div className="text-slate-600">Thành phần</div>
                  <div className="text-slate-700">
                    <span className="line-clamp-2">{PRODUCT.ingredientsPreview}</span>{" "}
                    <IngredientsDialog open={ingredientsOpen} onOpenChange={setIngredientsOpen} rows={INGREDIENT_ROWS} />
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Cart(localStorage):{" "}
                <span className="font-semibold text-slate-700">{cartLines.reduce((s, l) => s + l.qty, 0)}</span>
              </div>
            </div>
          </div>

          <DetailTabsMobile tabs={PRODUCT.tabs} value={activeTab} onValueChange={setActiveTab} />
          <DetailSectionsDesktop tabs={PRODUCT.tabs} />
        </div>
      </div>

      <MobileStickyBuyBar
        title={PRODUCT.title}
        priceDisplay={PRODUCT.priceDisplay}
        unitLabel={PRODUCT.unitLabel}
        qty={qty}
        setQty={setQty}
        onAddToCart={addToCart}
      />
    </section>
  );
}

export function ProductDetailView({ detail }: { detail: ProductDetailData }) {
  const p = detail.product;
  const images = detail.images.length
    ? detail.images.map((img) => ({ src: img.image_url, alt: p.title }))
    : p.image_url
      ? [{ src: p.image_url, alt: p.title }]
      : [];

  const [activeImgIdx, setActiveImgIdx] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<"mo-ta" | "cach-dung" | "thanh-phan">("mo-ta");
  const [cartLines, setCartLines] = useLocalStorageState<CartLine[]>(CART_KEY, []);

  function addToCart() {
    const next = localDb.cart.upsert(p.id, qty);
    setCartLines(next);
  }

  const tabDefs = [
    { id: "mo-ta", label: "Mô tả", content: <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: p.description_html ?? "" }} /> },
    { id: "cach-dung", label: "Cách dùng", content: <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: p.usage_html ?? "" }} /> },
    { id: "thanh-phan", label: "Thành phần", content: <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: p.ingredients_html ?? "" }} /> },
  ] as const;

  return (
    <section className="bg-(--lc-surface) pb-20 sm:pb-10">
      <Breadcrumbs items={[{ label: "Trang chủ", href: "/" }, { label: "Sản phẩm" }]} />

      <div className="mx-auto max-w-[1200px] px-3 pb-8 pt-3 sm:px-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[520px_1fr]">
            <ProductGallery images={images} activeIdx={activeImgIdx} setActiveIdx={setActiveImgIdx} />

            <div>
              <h1 className="text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">{p.title}</h1>

              <div className="mt-4 flex items-end gap-2">
                <div className="text-3xl font-extrabold text-(--lc-blue-700)">{formatVnd(p.price_amount)}</div>
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

              <div className="mt-4 text-xs text-slate-500">
                Cart(localStorage):{" "}
                <span className="font-semibold text-slate-700">{cartLines.reduce((s, l) => s + l.qty, 0)}</span>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-5">
            <div className="flex flex-wrap gap-2">
              {tabDefs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold",
                    activeTab === t.id ? "border-(--lc-blue-700) bg-(--lc-blue-700) text-white" : "bg-white text-slate-800 hover:border-(--lc-blue-700) hover:text-(--lc-blue-700)"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-5">{tabDefs.find((t) => t.id === activeTab)?.content}</div>
          </div>
        </div>
      </div>

      <MobileStickyBuyBar
        title={p.title}
        priceDisplay={formatVnd(p.price_amount)}
        unitLabel="Hộp"
        qty={qty}
        setQty={setQty}
        onAddToCart={addToCart}
      />
    </section>
  );
}

