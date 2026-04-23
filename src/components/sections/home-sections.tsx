import { cn } from "@/lib/utils";
import type React from "react";
import type { ProductCard } from "@/types/commerce";
import { ProductCard as ProductCardView } from "@/components/commerce/product-card";
import { Button } from "@/components/ui/button";
import type { DbArticle } from "@/lib/supabase/types";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Clock,
  MapPin,
  Newspaper,
  Play,
  ShieldCheck,
  Stethoscope,
  Truck,
  Undo2,
} from "lucide-react";

function SectionShell({
  title,
  description,
  actionLabel = "Xem tất cả",
  className,
  children,
}: {
  title: string;
  description?: string;
  actionLabel?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <section className={cn("bg-white", className)}>
      <div className="mx-auto max-w-[1200px] px-3 py-8 sm:px-4">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
            {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
          </div>
          <a className="shrink-0 text-sm font-semibold text-(--lc-blue-700) hover:underline" href="#">
            {actionLabel}
          </a>
        </div>
        {children}
      </div>
    </section>
  );
}

export function PromoCommerce({
  className,
  title = "Ưu đãi nổi bật",
  subtitle = "Flash deals có kiểm soát — dễ đọc, dễ mua, vẫn giữ tone y tế.",
  endsInLabel = "Kết thúc sau",
  products,
}: {
  className?: string;
  title?: string;
  subtitle?: string;
  endsInLabel?: string;
  products: ProductCard[];
}) {
  return (
    <section className={cn("bg-(--lc-surface)", className)}>
      <div className="mx-auto max-w-[1200px] px-3 py-8 sm:px-4">
        <div className="rounded-3xl border bg-white shadow-sm">
          <div className="grid gap-4 p-5 md:grid-cols-[340px_1fr] md:gap-6 md:p-6">
            <div className="rounded-2xl bg-gradient-to-b from-(--lc-blue-900) to-(--lc-blue-700) p-5 text-white">
              <div className="text-xs font-semibold opacity-90">{subtitle}</div>
              <div className="mt-2 text-xl font-extrabold tracking-tight">{title}</div>

              <div className="mt-4 rounded-2xl bg-white/12 p-4">
                <div className="text-xs font-semibold opacity-90">{endsInLabel}</div>
                <div className="mt-2 flex items-center gap-2 text-sm font-extrabold">
                  <span className="rounded-lg bg-white/15 px-2 py-1">02</span>:<span className="rounded-lg bg-white/15 px-2 py-1">14</span>:
                  <span className="rounded-lg bg-white/15 px-2 py-1">32</span>
                </div>
                <div className="mt-3 text-xs opacity-90">Ưu đãi có thời hạn • Số lượng có hạn</div>
              </div>

              <Button className="mt-5 h-10 w-full rounded-full bg-white text-(--lc-blue-900) hover:bg-white/90">
                Mua ngay
                <ArrowRight className="size-4" />
              </Button>

              <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-white/90">
                <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1">
                  <BadgeCheck className="size-3.5" />
                  Chính hãng
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1">
                  <Truck className="size-3.5" />
                  Giao nhanh
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-white/12 px-3 py-1">
                  <Stethoscope className="size-3.5" />
                  Tư vấn dược sĩ
                </span>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {products.slice(0, 6).map((p) => (
                <ProductCardView key={p.id} product={p} variant="compact" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function BestSellers({ className, products }: { className?: string; products: ProductCard[] }) {
  return (
    <SectionShell title="Sản phẩm bán chạy" description="So sánh nhanh theo công dụng, dạng bào chế và quy cách." className={className}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {products.slice(0, 12).map((p) => (
          <ProductCardView key={p.id} product={p} />
        ))}
      </div>
    </SectionShell>
  );
}

export function BrandStrip({ className }: { className?: string }) {
  const brands = ["Abbott", "Omron", "Panadol", "Blackmores", "DHC", "Nature’s Way", "Huggies", "Cetaphil"];
  return (
    <SectionShell title="Thương hiệu uy tín" description="Chọn lọc từ các hãng được tin dùng trong chăm sóc sức khỏe." className={className}>
      <div className="grid gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {brands.map((b) => (
          <a
            key={b}
            href="#"
            className="grid h-14 place-items-center rounded-2xl border bg-white text-sm font-semibold text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            {b}
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

export function SeasonalSolutions({ className, products }: { className?: string; products: ProductCard[] }) {
  const tabs = ["Cúm mùa", "Sốt xuất huyết", "Tay chân miệng", "Dị ứng thời tiết"];
  return (
    <SectionShell
      title="Giải pháp theo mùa"
      description="Vừa có hướng dẫn ngắn gọn, vừa có gợi ý sản phẩm/ dịch vụ để xử trí."
      className={className}
    >
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            className="rounded-full border bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-(--lc-blue-700) hover:text-(--lc-blue-700)"
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <div className="rounded-3xl border bg-(--lc-surface) p-5 shadow-sm">
          <div className="text-xs font-semibold text-slate-600">Hướng dẫn nhanh</div>
          <div className="mt-1 text-base font-extrabold text-slate-900">Nhận biết triệu chứng & khi nào cần gặp bác sĩ</div>
          <p className="mt-2 text-sm leading-relaxed text-slate-700">
            Nội dung mang tính tham khảo. Nếu sốt cao kéo dài, khó thở, mất nước, hoặc người có bệnh nền — hãy liên hệ cơ sở y tế.
          </p>

          <div className="mt-4 grid gap-2 text-sm text-slate-800">
            {[
              { title: "Theo dõi dấu hiệu nặng", desc: "Sốt cao, lừ đừ, đau ngực, phát ban lan nhanh…" },
              { title: "Chăm sóc tại nhà đúng cách", desc: "Uống đủ nước, nghỉ ngơi, vệ sinh mũi họng…" },
              { title: "Hỏi dược sĩ khi cần", desc: "Chọn đúng sản phẩm, đúng đối tượng, đúng liều dùng." },
            ].map((it) => (
              <div key={it.title} className="flex items-start gap-2">
                <span className="mt-0.5 inline-block size-2 rounded-full bg-(--lc-blue-700)" />
                <div>
                  <div className="font-semibold">{it.title}</div>
                  <div className="text-sm text-slate-600">{it.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <Button className="h-9 rounded-full bg-(--lc-blue-700) text-white hover:bg-(--lc-blue-800)">
              Hỏi dược sĩ
              <ArrowRight className="size-4" />
            </Button>
            <Button variant="outline" className="h-9 rounded-full">
              Tìm nhà thuốc gần bạn
              <MapPin className="size-4" />
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.slice(0, 6).map((p) => (
            <ProductCardView key={p.id} product={p} variant="compact" />
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export function VideoRail({ className }: { className?: string }) {
  const featured = { title: "Dược sĩ tư vấn: 4 lưu ý khi chăm sóc sức khỏe mùa nắng nóng", duration: "06:32" };
  const items = [
    { title: "Tay chân miệng vào mùa — dấu hiệu cần đi khám sớm", duration: "04:18" },
    { title: "Vì sao dị ứng thời tiết tăng mạnh? Cách phòng ngừa", duration: "05:01" },
    { title: "Cúm mùa: phân biệt triệu chứng và thời điểm dùng thuốc", duration: "07:10" },
    { title: "Đọc nhãn sản phẩm: hoạt chất, liều dùng, chống chỉ định", duration: "03:55" },
  ];
  return (
    <SectionShell title="Video sức khỏe" description="Nội dung ngắn gọn, dễ hiểu, ưu tiên tính y khoa và ứng dụng." className={className}>
      <div className="grid gap-3 lg:grid-cols-[1.2fr_0.8fr]">
        <a href="#" className="group rounded-3xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
          <div className="relative overflow-hidden rounded-2xl bg-(--lc-surface)">
            <div className="aspect-video w-full" />
            <div className="absolute bottom-3 left-3 inline-flex items-center gap-2 rounded-full bg-black/55 px-3 py-1 text-xs font-semibold text-white">
              <Play className="size-3.5" />
              {featured.duration}
            </div>
          </div>
          <div className="mt-3 text-sm font-extrabold text-slate-900">{featured.title}</div>
          <div className="mt-1 text-xs text-slate-600">Chuyên mục • Dược sĩ tư vấn</div>
        </a>

        <div className="grid gap-3">
          {items.map((v) => (
            <a key={v.title} href="#" className="flex gap-3 rounded-3xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
              <div className="relative w-36 overflow-hidden rounded-2xl bg-(--lc-surface)">
                <div className="aspect-video w-full" />
                <div className="absolute bottom-2 left-2 rounded-full bg-black/55 px-2 py-0.5 text-[11px] font-semibold text-white">{v.duration}</div>
              </div>
              <div className="min-w-0">
                <div className="line-clamp-2 text-sm font-semibold text-slate-900">{v.title}</div>
                <div className="mt-1 inline-flex items-center gap-1 text-xs text-slate-600">
                  <Clock className="size-3.5" />
                  Video
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export function ArticleFeatureSection({ className, featuredArticle }: { className?: string; featuredArticle: DbArticle | null }) {
  const featured = featuredArticle
    ? { title: featuredArticle.title, category: "Kiến thức y khoa", meta: "8 phút đọc", href: `/goc-suc-khoe/${featuredArticle.slug}` }
    : { title: "Bài viết nổi bật", category: "Kiến thức y khoa", meta: "", href: "#" };
  const items = [
    { title: "Triệu chứng cảm cúm: khi nào nên đi khám?", meta: "5 phút đọc" },
    { title: "Cách đọc thành phần: hoạt chất, hàm lượng, chống chỉ định", meta: "6 phút đọc" },
    { title: "Dị ứng thời tiết: dấu hiệu và phòng ngừa", meta: "4 phút đọc" },
    { title: "Bổ sung vitamin đúng cách theo độ tuổi", meta: "7 phút đọc" },
    { title: "Sức khỏe tiêu hóa: thói quen tốt mỗi ngày", meta: "5 phút đọc" },
  ];
  return (
    <SectionShell title="Bài viết & Tin sức khỏe" description="Nội dung đáng tin cậy — giúp bạn quyết định mua đúng và chăm sóc đúng." className={className}>
      <div className="grid gap-3 lg:grid-cols-[1.1fr_0.9fr]">
        <a href={featured.href} className="rounded-3xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
          <div className="overflow-hidden rounded-2xl bg-(--lc-surface)">
            <div className="aspect-[16/9] w-full" />
          </div>
          <div className="mt-3 flex items-center gap-2 text-xs font-semibold text-slate-600">
            <Newspaper className="size-4 text-(--lc-blue-700)" />
            {featured.category}
            <span className="text-slate-400">•</span>
            {featured.meta}
          </div>
          <div className="mt-2 text-base font-extrabold text-slate-900">{featured.title}</div>
          <div className="mt-2 inline-flex items-center gap-1 text-sm font-semibold text-(--lc-blue-700)">
            Đọc bài
            <ArrowRight className="size-4" />
          </div>
        </a>

        <div className="grid gap-2">
          {items.map((a) => (
            <a key={a.title} href="#" className="flex items-start gap-3 rounded-3xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow">
              <div className="mt-0.5 size-16 shrink-0 overflow-hidden rounded-2xl bg-(--lc-surface)" />
              <div className="min-w-0">
                <div className="line-clamp-2 text-sm font-semibold text-slate-900">{a.title}</div>
                <div className="mt-1 text-xs text-slate-600">{a.meta}</div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

export function HealthSegments({ className }: { className?: string }) {
  const segments = [
    { title: "Sức khỏe Nam giới", items: ["Sinh lý nam", "Tim mạch", "Gan mật", "Xương khớp"] },
    { title: "Sức khỏe Nữ giới", items: ["Nội tiết", "Da liễu", "Tiền mãn kinh", "Sức khỏe sinh sản"] },
    { title: "Chăm sóc Người cao tuổi", items: ["Trí nhớ", "Huyết áp", "Xương khớp", "Tiểu đường"] },
    { title: "Chăm sóc Trẻ em", items: ["Miễn dịch", "Dinh dưỡng", "Hô hấp", "Da liễu"] },
  ];
  return (
    <SectionShell title="Khám phá theo nhóm nhu cầu" description="Điểm vào rõ ràng cho các miền sức khỏe lớn — học nhanh, mua đúng." className={className}>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {segments.map((s) => (
          <div key={s.title} className="rounded-3xl border bg-white p-5 shadow-sm">
            <div className="text-sm font-extrabold text-slate-900">{s.title}</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {s.items.map((t) => (
                <li key={t}>
                  <a className="hover:text-(--lc-blue-700) hover:underline" href="#">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
            <a href="#" className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-(--lc-blue-700) hover:underline">
              Khám phá
              <ArrowRight className="size-4" />
            </a>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

export function TrustBand({ className }: { className?: string }) {
  const items = [
    { icon: BadgeCheck, title: "Thuốc chính hãng", desc: "Minh bạch nguồn gốc" },
    { icon: Stethoscope, title: "Tư vấn dược sĩ", desc: "Hỗ trợ chọn đúng" },
    { icon: Truck, title: "Giao nhanh", desc: "Theo khu vực" },
    { icon: Undo2, title: "Đổi trả dễ", desc: "Theo chính sách" },
    { icon: ShieldCheck, title: "Mạng lưới nhà thuốc", desc: "Toàn quốc" },
    { icon: CalendarDays, title: "Hỗ trợ đơn thuốc", desc: "Tư vấn & nhắc lịch" },
  ];
  return (
    <section className={cn("bg-white", className)}>
      <div className="mx-auto max-w-[1200px] px-3 py-8 sm:px-4">
        <div className="grid gap-3 rounded-3xl border bg-(--lc-surface) p-5 shadow-sm sm:grid-cols-2 lg:grid-cols-6">
          {items.map((it) => (
            <div key={it.title} className="flex items-start gap-3 rounded-2xl bg-white p-4">
              <div className="grid size-10 shrink-0 place-items-center rounded-2xl bg-(--lc-surface)">
                <it.icon className="size-5 text-(--lc-blue-700)" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-extrabold text-slate-900">{it.title}</div>
                <div className="mt-1 text-xs text-slate-600">{it.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export const demoProducts: ProductCard[] = [
  {
    id: "p1",
    brand: "Blackmores",
    title: "Vitamin C 1000mg hỗ trợ miễn dịch (Viên nang)",
    originLabel: "Úc",
    benefitTag: "Hỗ trợ miễn dịch",
    formatTag: "Viên nang",
    packNote: "Hộp 30 viên",
    trustLabel: "Tư vấn dược sĩ",
    isAuthenticitySupported: true,
    badge: "Giá tốt",
    imageUrl: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x256/filters:quality(90):format(webp)/products/2024/02/00000000.png",
    price: { amount: 388800, display: "388.800đ" },
    compareAt: { amount: 459000, display: "459.000đ" },
    unit: "Hộp",
  },
  {
    id: "p2",
    brand: "Abbott",
    title: "Sữa Abbott cho người lớn tuổi hỗ trợ tim mạch",
    originLabel: "Mỹ",
    benefitTag: "Tim mạch",
    formatTag: "Dạng bột",
    packNote: "Lon 850g",
    trustLabel: "Chính hãng",
    isAuthenticitySupported: true,
    badge: "Ưu đãi",
    imageUrl: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x256/filters:quality(90):format(webp)/products/2024/02/00000000.png",
    price: { amount: 699000, display: "699.000đ" },
    compareAt: { amount: 789000, display: "789.000đ" },
    unit: "Lon",
  },
  {
    id: "p3",
    brand: "Cetaphil",
    title: "Sữa rửa mặt dịu nhẹ cho da nhạy cảm",
    originLabel: "Canada",
    benefitTag: "Da nhạy cảm",
    formatTag: "Gel",
    packNote: "Chai 236ml",
    trustLabel: "Gợi ý bởi dược sĩ",
    isAuthenticitySupported: true,
    badge: "Bán chạy",
    imageUrl: "https://cdn.nhathuoclongchau.com.vn/unsafe/256x256/filters:quality(90):format(webp)/products/2024/02/00000000.png",
    price: { amount: 245000, display: "245.000đ" },
    compareAt: { amount: 299000, display: "299.000đ" },
    unit: "Chai",
  },
];

