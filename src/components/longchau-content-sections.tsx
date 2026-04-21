import { cn } from "@/lib/utils";
import type React from "react";

function SectionShell({
  title,
  children,
  className,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("bg-white", className)}>
      <div className="mx-auto max-w-[1200px] px-3 py-8 sm:px-4">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 className="text-lg font-extrabold text-slate-900">{title}</h2>
          <a className="text-sm font-semibold text-[color:var(--lc-blue-700)] hover:underline" href="#">
            Xem tất cả
          </a>
        </div>
        {children}
      </div>
    </section>
  );
}

export function LongChauFeaturedCategories({ className }: { className?: string }) {
  const items = [
    { label: "Thần kinh não", count: "58 sản phẩm" },
    { label: "Vitamin & Khoáng chất", count: "83 sản phẩm" },
    { label: "Sinh lý - Nội tiết tố", count: "47 sản phẩm" },
    { label: "Tim mạch - Huyết áp", count: "26 sản phẩm" },
    { label: "Miễn dịch - Đề kháng", count: "54 sản phẩm" },
    { label: "Tiêu hóa", count: "76 sản phẩm" },
  ];

  return (
    <SectionShell title="Danh mục nổi bật" className={className}>
      <div className="grid gap-3 sm:grid-cols-3">
        {items.map((it) => (
          <a
            key={it.label}
            href="#"
            className="rounded-2xl border bg-[color:var(--lc-surface)] p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <div className="text-sm font-extrabold text-slate-900">{it.label}</div>
            <div className="mt-1 text-xs text-slate-600">{it.count}</div>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

export function LongChauHealthChecks({ className }: { className?: string }) {
  const items = [
    "Bài kiểm tra trí nhớ và mức độ tập trung chú ý",
    "Bài kiểm tra sàng lọc nguy cơ tiền đái tháo đường",
    "Bài kiểm tra khả năng suy giáp",
    "Đánh giá mức độ kiểm soát bệnh hen",
    "Bài kiểm tra nguy cơ mắc bệnh tim mạch",
    "Bài kiểm tra nguy cơ mắc bệnh Alzheimer",
    "Bài kiểm tra nguy cơ mắc bệnh trào ngược dạ dày",
    "Bài kiểm tra nguy cơ phụ thuộc bình xịt cắt cơn",
  ];

  return (
    <SectionShell title="Kiểm tra sức khỏe" className={className}>
      <p className="mb-4 text-sm text-slate-600">
        Kết quả đánh giá sẽ cho bạn lời khuyên xử trí phù hợp!
      </p>
      <div className="grid gap-3 sm:grid-cols-4">
        {items.map((t) => (
          <a
            key={t}
            href="#"
            className="rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <div className="text-sm font-semibold text-slate-900">{t}</div>
            <div className="mt-3 inline-flex rounded-full bg-[color:var(--lc-blue-700)] px-3 py-1 text-xs font-semibold text-white">
              Bắt đầu
            </div>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

export function LongChauSeasonalDiseases({ className }: { className?: string }) {
  const tags = ["Tay chân miệng", "Viêm não mô cầu", "Cúm", "Sốt xuất huyết"];
  return (
    <SectionShell title="Bệnh theo mùa" className={className}>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <a
            key={t}
            href="#"
            className="rounded-full border bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm hover:border-[color:var(--lc-blue-700)] hover:text-[color:var(--lc-blue-700)]"
          >
            {t}
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

export function LongChauShortVideos({ className }: { className?: string }) {
  const titles = [
    "Một đứa trẻ có thể chỉ sốt nhẹ buổi sáng… nhưng vài giờ sau đã rơi vào nguy kịch",
    "Đến 2030: Đi khám không còn bệnh án giấy?",
    "Bạn có biết: Tinh trùng nam giới cũng có thể “lên xuống phong độ” theo mùa?",
    "4 lưu ý khi tắm mùa nóng để tránh đột quỵ, nhồi máu cơ tim",
    "Tay chân miệng và sốt xuất huyết đang vào mùa, nguy cơ lây lan tăng nhanh, đặc biệt ở trẻ nhỏ",
    "Vì sao thời tiết nắng nóng có thể làm gia tăng các vấn đề tâm lý?",
  ];

  return (
    <SectionShell title="Video ngắn nổi bật" className={className}>
      <div className="grid gap-3 sm:grid-cols-3">
        {titles.map((t) => (
          <a
            key={t}
            href="#"
            className="rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <div className="mb-3 aspect-video w-full rounded-xl bg-[color:var(--lc-surface)]" />
            <div className="line-clamp-3 text-sm font-semibold text-slate-900">{t}</div>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

export function LongChauHealthCorner({ className }: { className?: string }) {
  const items = [
    "Thuocare đưa 3 đột phá y khoa về Việt Nam: Mở cơ hội cho bệnh nhân nặng và hiếm gặp",
    "Lần đầu tiên tại Việt Nam: Thuocare ra mắt “Ví Khỏe Nhà Ta” – Ví sức khỏe tích thưởng cho cả nhà cùng hưởng",
    "THUOCARE VÀ OMRON ĐỒNG HÀNH TẦM SOÁT RUNG NHĨ - PHÁT HIỆN SỚM NGUY CƠ ĐỘT QUỴ TẠI 200 NHÀ THUỐC TRÊN TOÀN QUỐC",
    "Thuocare cùng Abbott triển khai tiêm cúm miễn phí cho người dân miền Trung, mở rộng chuỗi chương trình phòng bệnh cho cộng đồng",
    "Thuocare hợp tác hãng dược Nhật Bản Santen ra mắt bộ câu hỏi tầm soát khô mắt chuẩn y khoa, chỉ 30 giây để hiểu tình trạng đôi mắt",
    "Thuocare phối hợp STADA Pymepharco lan toả kiến thức y khoa về phòng tránh thừa cân, béo phì và giảm cân an toàn",
  ];

  return (
    <SectionShell title="Góc sức khỏe" className={className}>
      <div className="grid gap-3 md:grid-cols-2">
        {items.map((t) => (
          <a
            key={t}
            href="#"
            className="rounded-2xl border bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow"
          >
            <div className="text-xs font-semibold text-slate-500">Truyền thông</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{t}</div>
          </a>
        ))}
      </div>
    </SectionShell>
  );
}

export function LongChauDiseaseBlocks({ className }: { className?: string }) {
  const blocks: Array<{ title: string; items: string[] }> = [
    { title: "BỆNH NAM GIỚI", items: ["Loãng xương ở nam", "Di tinh, mộng tinh", "Hẹp bao quy đầu", "Yếu sinh lý"] },
    {
      title: "BỆNH NỮ GIỚI",
      items: ["Hội chứng tiền kinh nguyệt", "Hội chứng tiền mãn kinh", "Chậm kinh", "Mất kinh"],
    },
    { title: "BỆNH NGƯỜI GIÀ", items: ["Alzheimer", "Parkinson", "Parkinson thứ phát", "Đục thủy tinh thể ở người già"] },
    { title: "BỆNH TRẺ EM", items: ["Bại não trẻ em", "Tự kỷ", "Uốn ván", "Tắc ruột sơ sinh"] },
  ];

  return (
    <SectionShell title="Bệnh" className={className}>
      <div className="grid gap-3 sm:grid-cols-2">
        {blocks.map((b) => (
          <div key={b.title} className="rounded-2xl border bg-white p-5 shadow-sm">
            <div className="text-sm font-extrabold text-slate-900">{b.title}</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              {b.items.map((t) => (
                <li key={t}>
                  <a className="hover:text-[color:var(--lc-blue-700)] hover:underline" href="#">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}

