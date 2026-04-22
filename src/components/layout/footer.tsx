import { cn } from "@/lib/utils";
import { CreditCard } from "lucide-react";

export function Footer({ className }: { className?: string }) {
  return (
    <footer className={cn("mt-auto border-t bg-white", className)}>
      <div className="mx-auto max-w-[1200px] px-3 py-10 text-sm text-slate-700 sm:px-4">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="text-base font-extrabold text-slate-900">Nền tảng nhà thuốc & chăm sóc sức khỏe</div>
            <p className="mt-2 text-sm text-slate-600">
              Mua thuốc trực tuyến, nhận tư vấn dược sĩ, tra cứu chính hãng và tìm nhà thuốc gần bạn.
            </p>
          </div>

          <div>
            <div className="text-base font-extrabold text-slate-900">Hỗ trợ khách hàng</div>
            <ul className="mt-3 space-y-2">
              {["Hướng dẫn mua hàng", "Chính sách đổi trả", "Chính sách giao hàng", "Phương thức thanh toán", "Câu hỏi thường gặp"].map((t) => (
                <li key={t}>
                  <a className="hover:text-(--lc-blue-700) hover:underline" href="#">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-base font-extrabold text-slate-900">Dịch vụ</div>
            <ul className="mt-3 space-y-2">
              {["Hỏi dược sĩ", "Tiêm chủng", "Tra cứu chính hãng", "Nhà thuốc gần bạn", "Hỗ trợ đơn thuốc"].map((t) => (
                <li key={t}>
                  <a className="hover:text-(--lc-blue-700) hover:underline" href="#">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <div className="text-base font-extrabold text-slate-900">Về Thuocare</div>
            <ul className="mt-3 space-y-2">
              {["Giới thiệu", "Hệ thống cửa hàng", "Quy chế hoạt động", "Chính sách bảo mật", "Điều khoản sử dụng"].map((t) => (
                <li key={t}>
                  <a className="hover:text-(--lc-blue-700) hover:underline" href="#">
                    {t}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 grid gap-4 border-t pt-6 text-xs text-slate-500 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>© 2007 - 2026 Thuocare. Thông tin trên trang mang tính tham khảo.</div>
          <div className="flex flex-wrap items-center gap-2">
            {["Visa", "MoMo", "Banking"].map((t) => (
              <span key={t} className="inline-flex items-center gap-1 rounded-full border bg-white px-3 py-1">
                <CreditCard className="size-3.5 text-slate-500" />
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

