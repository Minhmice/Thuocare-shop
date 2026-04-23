import { Footer } from "@/components/layout/footer";
import { HeaderServer } from "@/components/layout/header.server";

export default async function Page() {
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <HeaderServer />
      <div className="mx-auto max-w-[900px] px-3 py-8 sm:px-4">
        <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-2xl font-extrabold text-slate-900">Hệ thống nhà thuốc</h1>
          <p className="mt-2 text-sm text-slate-600">Trang dịch vụ (stub). Sắp có tìm cửa hàng gần bạn và giờ mở cửa.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}

