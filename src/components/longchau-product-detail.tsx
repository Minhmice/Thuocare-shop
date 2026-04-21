"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CART_KEY, localDb } from "@/lib/local-db";
import { useLocalStorageState } from "@/hooks/use-local-storage";
import type { CartLine } from "@/types/commerce";
import { formatVnd } from "@/lib/money";
import type { ProductDetailData } from "@/data/products";
import { LongChauProductCardV2 } from "@/components/longchau-product-card";

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
      src: "https://cdn.nhathuoclongchau.com.vn/unsafe/800x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_0_30b8d2a1e0.png",
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
          <p>
            Vị thuốc cẩu tích và đỗ trọng có trong Sâm Nhung Bổ Thận NV có tác dụng bổ can thận, giảm đau lưng, tiểu nhiều
            lần, thận hư yếu...
          </p>
          <h3>Tăng cường sinh lý, làm chậm mãn dục nam</h3>
          <p>
            Cũng chính bởi khả năng tăng cường chức năng thận mà các vấn đề như yếu sinh lý, xuất tinh sớm ở nam giới...
            cũng có xu hướng thuyên giảm...
          </p>
          <h3>Tăng cường sinh lực, giúp cơ thể khỏe mạnh</h3>
          <p>
            Song song với khả năng bổ thận, tăng cường chức năng sinh lý nam giới, Sâm Nhung Bổ Thận NV còn giúp kiện tỳ,
            ích khí, bồi bổ thể trạng...
          </p>
          <h3>An toàn, lành tính, hiệu quả lâu dài</h3>
          <p>
            Sâm Nhung Bổ Thận NV được chiết xuất từ 100% thảo dược tự nhiên, không chứa các thành phần tân dược...
          </p>
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
            <strong>Cách dùng:</strong> Ngày uống 2 lần vào sáng và chiều, mỗi lần 2 viên. Uống lúc đói. Mỗi đợt dùng 4 -
            6 tuần.
          </p>
          <p>
            <strong>Đối tượng sử dụng:</strong> Thích hợp dùng cho nam giới khả năng sinh lý suy giảm, mãn dục sớm: Đau
            lưng, mỏi gối, yếu sinh lý, chức năng thận suy giảm.
          </p>
        </div>
      ),
    },
    {
      id: "tac-dung-phu",
      label: "Tác dụng phụ",
      content: (
        <div className="prose prose-slate max-w-none">
          <h2>Tác dụng phụ</h2>
          <p>Chưa có thông tin về tác dụng phụ của sản phẩm.</p>
        </div>
      ),
    },
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

const TAB_ORDER = PRODUCT.tabs.map((t) => t.id);

function Breadcrumbs() {
  const crumbs = ["Trang chủ", "Thực phẩm chức năng", "Sinh lý - Nội tiết tố", "Sinh lý nam"];
  return (
    <div className="mx-auto max-w-[1200px] px-3 pt-4 text-xs text-slate-500 sm:px-4">
      <div className="flex flex-wrap items-center gap-1">
        {crumbs.map((c, i) => (
          <React.Fragment key={c}>
            <a className="hover:text-[color:var(--lc-blue-700)] hover:underline" href="#">
              {c}
            </a>
            {i < crumbs.length - 1 ? <span>/</span> : null}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

export function LongChauProductDetail({ className }: { className?: string }) {
  const [activeImgIdx, setActiveImgIdx] = React.useState(0);
  const [qty, setQty] = React.useState(1);
  const [activeTab, setActiveTab] = React.useState<string>(TAB_ORDER[0] ?? "mo-ta");
  const [cartLines, setCartLines] = useLocalStorageState<CartLine[]>(CART_KEY, []);
  const [activeSectionId, setActiveSectionId] = React.useState<string>(TAB_ORDER[0] ?? "mo-ta");
  const [ingredientsOpen, setIngredientsOpen] = React.useState(false);

  const detailCardRef = React.useRef<HTMLDivElement | null>(null);
  const scrollAreaRef = React.useRef<HTMLDivElement | null>(null);
  const sectionElsRef = React.useRef<Record<string, HTMLElement | null>>({});

  const activeImg = PRODUCT.images[activeImgIdx] ?? PRODUCT.images[0]!;

  React.useEffect(() => {
    const root = scrollAreaRef.current;
    if (!root) return;

    const ids = PRODUCT.tabs.map((t) => t.id);
    const elements = ids.map((id) => sectionElsRef.current[id]).filter(Boolean) as HTMLElement[];
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const inView = entries.filter((e) => e.isIntersecting) as Array<
          IntersectionObserverEntry & { target: HTMLElement }
        >;
        if (inView.length === 0) return;

        // Choose the section closest to the top of the scroll container.
        inView.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const nextId = inView[0]?.target.id;
        if (nextId) setActiveSectionId(nextId);
      },
      {
        root,
        threshold: [0.15, 0.3, 0.6],
        rootMargin: "-15% 0px -75% 0px",
      }
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const scrollToSection = React.useCallback((id: string) => {
    setActiveSectionId(id);

    // 1) Bring the card into viewport (page scroll) only if it's fully outside viewport.
    // Avoid "ugly" jumps when the card is already partially visible.
    const cardEl = detailCardRef.current;
    if (cardEl) {
      const rect = cardEl.getBoundingClientRect();
      const viewportH = window.innerHeight || 0;
      const desiredTopOffset = 96; // accounts for sticky header + breathing room
      const isCompletelyAbove = rect.bottom <= 0;
      const isCompletelyBelow = rect.top >= viewportH;

      if (isCompletelyAbove || isCompletelyBelow) {
        const targetY = window.scrollY + rect.top - desiredTopOffset;
        window.scrollTo({ top: Math.max(0, targetY), behavior: "smooth" });
      }
    }

    // 2) Scroll inside card (scroll container) to the selected section.
    // Use scrollTop math instead of element.scrollIntoView() to prevent page scrolling.
    // Two rAFs improves reliability after layout/scroll changes.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const root = scrollAreaRef.current;
        const el = sectionElsRef.current[id];
        if (!root || !el) return;

        const rootRect = root.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const paddingTop = 12;
        const nextTop = root.scrollTop + (elRect.top - rootRect.top) - paddingTop;
        root.scrollTo({ top: Math.max(0, nextTop), behavior: "smooth" });
      });
    });
  }, []);

  function addToCart() {
    const next = localDb.cart.upsert(PRODUCT.id, qty);
    setCartLines(next);
  }

  return (
    <section className={cn("bg-[color:var(--lc-surface)] pb-20 sm:pb-10", className)}>
      <Breadcrumbs />

      <div className="mx-auto max-w-[1200px] px-3 pb-8 pt-3 sm:px-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[520px_1fr]">
            {/* Gallery */}
            <div>
              <div className="relative overflow-hidden rounded-2xl border bg-white">
                <Image
                  src={activeImg.src}
                  alt={activeImg.alt}
                  width={900}
                  height={900}
                  className="h-auto w-full object-contain"
                  priority
                />
              </div>

              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {PRODUCT.images.map((img, idx) => (
                  <button
                    key={img.src}
                    type="button"
                    onClick={() => setActiveImgIdx(idx)}
                    className={cn(
                      "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white",
                      idx === activeImgIdx && "border-[color:var(--lc-blue-700)] ring-2 ring-[color:var(--lc-blue-700)]/20"
                    )}
                    aria-label={`Chọn ảnh ${idx + 1}`}
                  >
                    <Image src={img.src} alt={img.alt} width={96} height={96} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
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

              <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                <span className="font-mono">000110594</span>
                <span>•</span>
                <span className="text-amber-600">4.9</span>
                <span>★</span>
                <span>126 đánh giá</span>
                <span>•</span>
                <span>1250 bình luận</span>
              </div>

              <div className="mt-4 flex items-end gap-2">
                <div className="text-3xl font-extrabold text-[color:var(--lc-blue-700)]">{PRODUCT.priceDisplay}</div>
                <div className="pb-1 text-sm text-slate-600">/ {PRODUCT.unitLabel}</div>
              </div>

              <div className="mt-4 grid gap-3 sm:max-w-[420px]">
                <div className="grid grid-cols-[120px_1fr] items-center gap-3 text-sm">
                  <div className="text-slate-600">Chọn đơn vị tính</div>
                  <div className="inline-flex h-9 items-center rounded-full border bg-white px-4 font-semibold">
                    {PRODUCT.unitLabel}
                  </div>
                </div>

                <div className="grid grid-cols-[120px_1fr] items-center gap-3 text-sm">
                  <div className="text-slate-600">Chọn số lượng</div>
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      className="grid size-9 place-items-center rounded-full border bg-white text-slate-700 hover:bg-slate-50"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Giảm số lượng"
                    >
                      −
                    </button>
                    <div className="min-w-10 text-center text-sm font-semibold">{qty}</div>
                    <button
                      type="button"
                      className="grid size-9 place-items-center rounded-full border bg-white text-slate-700 hover:bg-slate-50"
                      onClick={() => setQty((q) => q + 1)}
                      aria-label="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    className="h-11 rounded-full bg-[color:var(--lc-blue-700)] text-white hover:bg-[color:var(--lc-blue-800)]"
                    onClick={addToCart}
                  >
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
                  <a className="text-xs font-semibold text-[color:var(--lc-blue-700)] hover:underline" href="#">
                    Xem giấy công bố sản phẩm
                  </a>
                </div>

                <div className="mt-2 grid grid-cols-[120px_1fr] gap-3">
                  <div className="text-slate-600">Thành phần</div>
                  <div className="text-slate-700">
                    <span className="line-clamp-2">{PRODUCT.ingredientsPreview}</span>{" "}
                    <Dialog open={ingredientsOpen} onOpenChange={setIngredientsOpen}>
                      <DialogTrigger asChild>
                        <a
                          className="text-xs font-semibold text-[color:var(--lc-blue-700)] hover:underline"
                          href="#"
                          onClick={(e) => e.preventDefault()}
                        >
                          Xem tất cả thông tin
                        </a>
                      </DialogTrigger>
                      <DialogContent className="max-h-[85vh] overflow-hidden">
                        <DialogHeader>
                          <DialogTitle>Bảng chi tiết thành phần</DialogTitle>
                          <DialogClose />
                        </DialogHeader>
                        <div className="max-h-[calc(85vh-84px)] overflow-y-auto px-6 py-5">
                          <div className="mb-3 text-sm font-semibold text-slate-700">Thành phần cho 1 viên:</div>

                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Thông tin thành phần</TableHead>
                                <TableHead className="text-right">Hàm lượng</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {INGREDIENT_ROWS.map((r) => (
                                <TableRow key={r.name}>
                                  <TableCell className="bg-slate-50">{r.name}</TableCell>
                                  <TableCell className="bg-slate-50 text-right font-semibold">{r.amount}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Cart(localStorage):{" "}
                <span className="font-semibold text-slate-700">
                  {cartLines.reduce((s, l) => s + l.qty, 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Tabs (mobile/tablet) */}
          <div className="mt-8 border-t pt-5 lg:hidden">
            <div className="flex flex-wrap gap-2">
              {PRODUCT.tabs.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold",
                    activeTab === t.id
                      ? "border-[color:var(--lc-blue-700)] bg-[color:var(--lc-blue-700)] text-white"
                      : "bg-white text-slate-800 hover:border-[color:var(--lc-blue-700)] hover:text-[color:var(--lc-blue-700)]"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-5">
              {PRODUCT.tabs.find((t) => t.id === activeTab)?.content ?? PRODUCT.tabs[0]?.content}
            </div>
          </div>

          {/* Desktop content card: sidebar + scrollable content */}
          <div ref={detailCardRef} className="mt-8 hidden lg:block">
            <div className="rounded-2xl border bg-white p-4 shadow-sm">
              <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
                {/* Sidebar */}
                <aside className="border-r pr-4">
                  <div className="sticky top-4">
                    <nav className="grid gap-2">
                      {PRODUCT.tabs.map((t) => {
                        const isActive = activeSectionId === t.id;
                        return (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => scrollToSection(t.id)}
                            className={cn(
                              "w-full rounded-xl px-3 py-2 text-left text-sm font-semibold transition",
                              isActive
                                ? "bg-slate-100 text-slate-900"
                                : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                            )}
                            aria-current={isActive ? "true" : undefined}
                          >
                            {t.label}
                          </button>
                        );
                      })}
                    </nav>
                  </div>
                </aside>

                {/* Scroll area */}
                <div
                  ref={scrollAreaRef}
                  className="max-h-[640px] overflow-y-auto scroll-smooth rounded-xl bg-white pr-2"
                >
                  <div className="space-y-8 pb-2">
                    {PRODUCT.tabs.map((t) => (
                      <section
                        key={t.id}
                        id={t.id}
                        ref={(el) => {
                          sectionElsRef.current[t.id] = el;
                        }}
                        className="scroll-mt-4"
                      >
                        {t.content}
                      </section>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile sticky bar */}
      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-3 py-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-slate-900">{PRODUCT.title}</div>
            <div className="mt-0.5 flex items-baseline gap-2">
              <div className="text-sm font-extrabold text-[color:var(--lc-blue-700)]">{PRODUCT.priceDisplay}</div>
              <div className="text-xs text-slate-500">{PRODUCT.unitLabel}</div>
            </div>
          </div>
          <div className="inline-flex items-center gap-1">
            <button
              type="button"
              className="grid size-8 place-items-center rounded-full border bg-white text-slate-700"
              onClick={() => setQty((q) => Math.max(1, q - 1))}
              aria-label="Giảm"
            >
              −
            </button>
            <div className="w-7 text-center text-xs font-semibold">{qty}</div>
            <button
              type="button"
              className="grid size-8 place-items-center rounded-full border bg-white text-slate-700"
              onClick={() => setQty((q) => q + 1)}
              aria-label="Tăng"
            >
              +
            </button>
          </div>
          <Button
            className="h-10 rounded-full bg-[color:var(--lc-blue-700)] px-5 text-white hover:bg-[color:var(--lc-blue-800)]"
            onClick={addToCart}
          >
            Chọn mua
          </Button>
        </div>
      </div>
    </section>
  );
}

// Backward-compat wrapper used by dynamic product route (`/p/[slug]`).
// It currently renders the static demo detail layout; can be upgraded to data-driven rendering later.
export function LongChauProductDetailView({ detail }: { detail: ProductDetailData }) {
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

  const activeImg = images[activeImgIdx] ?? images[0];
  const cartCount = cartLines.reduce((s, l) => s + l.qty, 0);

  function addToCart() {
    const next = localDb.cart.upsert(p.id, qty);
    setCartLines(next);
  }

  const tabHtml =
    activeTab === "mo-ta"
      ? p.description_html
      : activeTab === "cach-dung"
        ? p.usage_html
        : p.ingredients_html;

  return (
    <section className="bg-[color:var(--lc-surface)] pb-20 sm:pb-10">
      <div className="mx-auto max-w-[1200px] px-3 pt-4 text-xs text-slate-500 sm:px-4">
        <Link className="hover:text-[color:var(--lc-blue-700)] hover:underline" href="/">
          Trang chủ
        </Link>{" "}
        /{" "}
        <Link className="hover:text-[color:var(--lc-blue-700)] hover:underline" href="/supplements">
          Thực phẩm chức năng
        </Link>{" "}
        /{" "}
        <span className="text-slate-700">{p.title}</span>
      </div>

      <div className="mx-auto max-w-[1200px] px-3 pb-8 pt-3 sm:px-4">
        <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
          <div className="grid gap-6 lg:grid-cols-[520px_1fr]">
            <div>
              <div className="relative overflow-hidden rounded-2xl border bg-white">
                {activeImg ? (
                  <Image src={activeImg.src} alt={activeImg.alt} width={900} height={900} className="h-auto w-full object-contain" priority />
                ) : (
                  <div className="aspect-square w-full bg-[color:var(--lc-surface)]" />
                )}
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {images.map((img, idx) => (
                  <button
                    key={`${img.src}-${idx}`}
                    type="button"
                    onClick={() => setActiveImgIdx(idx)}
                    className={cn(
                      "relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border bg-white",
                      idx === activeImgIdx && "border-[color:var(--lc-blue-700)] ring-2 ring-[color:var(--lc-blue-700)]/20"
                    )}
                    aria-label={`Chọn ảnh ${idx + 1}`}
                  >
                    <Image src={img.src} alt={img.alt} width={96} height={96} className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                {p.country ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 font-semibold">
                    <span className="inline-block size-2 rounded-full bg-red-500" />
                    {p.country}
                  </span>
                ) : null}
                <span className="text-slate-400">|</span>
                <span>
                  Thương hiệu: <span className="font-semibold text-slate-800">{p.brand?.name ?? "—"}</span>
                </span>
              </div>

              <h1 className="mt-2 text-xl font-extrabold leading-snug text-slate-900 sm:text-2xl">{p.title}</h1>

              <div className="mt-4 flex items-end gap-2">
                <div className="text-3xl font-extrabold text-[color:var(--lc-blue-700)]">{formatVnd(p.price_amount)}</div>
                <div className="pb-1 text-sm text-slate-600">/ {p.unit ?? "Hộp"}</div>
              </div>

              {p.short_description ? <p className="mt-4 text-sm leading-relaxed text-slate-700">{p.short_description}</p> : null}

              <div className="mt-5 grid gap-3 sm:max-w-[420px]">
                <div className="grid grid-cols-[120px_1fr] items-center gap-3 text-sm">
                  <div className="text-slate-600">Chọn số lượng</div>
                  <div className="inline-flex items-center gap-2">
                    <button
                      type="button"
                      className="grid size-9 place-items-center rounded-full border bg-white text-slate-700 hover:bg-slate-50"
                      onClick={() => setQty((q) => Math.max(1, q - 1))}
                      aria-label="Giảm số lượng"
                    >
                      −
                    </button>
                    <div className="min-w-10 text-center text-sm font-semibold">{qty}</div>
                    <button
                      type="button"
                      className="grid size-9 place-items-center rounded-full border bg-white text-slate-700 hover:bg-slate-50"
                      onClick={() => setQty((q) => q + 1)}
                      aria-label="Tăng số lượng"
                    >
                      +
                    </button>
                  </div>
                </div>

                <Button className="h-11 rounded-full bg-[color:var(--lc-blue-700)] text-white hover:bg-[color:var(--lc-blue-800)]" onClick={addToCart}>
                  Chọn mua
                </Button>
                <div className="text-xs text-slate-500">
                  Cart(localStorage): <span className="font-semibold text-slate-700">{cartCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t pt-5">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "mo-ta", label: "Mô tả sản phẩm" },
                { id: "cach-dung", label: "Cách dùng" },
                { id: "thanh-phan", label: "Thành phần" },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setActiveTab(t.id as typeof activeTab)}
                  className={cn(
                    "rounded-full border px-4 py-2 text-sm font-semibold",
                    activeTab === t.id
                      ? "border-[color:var(--lc-blue-700)] bg-[color:var(--lc-blue-700)] text-white"
                      : "bg-white text-slate-800 hover:border-[color:var(--lc-blue-700)] hover:text-[color:var(--lc-blue-700)]"
                  )}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="mt-5">
              {tabHtml ? (
                <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: tabHtml }} />
              ) : (
                <div className="text-sm text-slate-600">Chưa có nội dung.</div>
              )}
            </div>
          </div>

          {detail.related.length ? (
            <div className="mt-10 border-t pt-6">
              <div className="mb-3 text-lg font-extrabold text-slate-900">Sản phẩm liên quan</div>
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {detail.related.slice(0, 8).map((rp) => (
                  <LongChauProductCardV2 key={rp.id} product={rp} />
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t bg-white/95 backdrop-blur sm:hidden">
        <div className="mx-auto flex max-w-[1200px] items-center gap-3 px-3 py-3">
          <div className="min-w-0 flex-1">
            <div className="truncate text-xs font-semibold text-slate-900">{p.title}</div>
            <div className="mt-0.5 flex items-baseline gap-2">
              <div className="text-sm font-extrabold text-[color:var(--lc-blue-700)]">{formatVnd(p.price_amount)}</div>
              <div className="text-xs text-slate-500">{p.unit ?? "Hộp"}</div>
            </div>
          </div>
          <Button className="h-10 rounded-full bg-[color:var(--lc-blue-700)] px-5 text-white hover:bg-[color:var(--lc-blue-800)]" onClick={addToCart}>
            Chọn mua
          </Button>
        </div>
      </div>
    </section>
  );
}

