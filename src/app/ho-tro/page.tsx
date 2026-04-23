import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { HeaderServer } from "@/components/layout/header.server";

export default async function Page() {
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <HeaderServer />
      <div className="mx-auto max-w-[900px] px-3 py-8 sm:px-4">
        <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-2xl font-extrabold text-slate-900">Hỗ trợ</h1>
          <p className="mt-2 text-sm text-slate-600">Trang hỗ trợ (stub). Sắp có FAQ, chat dược sĩ, chính sách.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link className="rounded-full border px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/tra-cuu-don">
              Tra cứu đơn
            </Link>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}

