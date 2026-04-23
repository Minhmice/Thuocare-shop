import { Footer } from "@/components/layout/footer";
import { HeaderServer } from "@/components/layout/header.server";

export default async function Page() {
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <HeaderServer />
      <div className="mx-auto max-w-[900px] px-3 py-8 sm:px-4">
        <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-2xl font-extrabold text-slate-900">Tra cứu đơn</h1>
          <p className="mt-2 text-sm text-slate-600">Trang tra cứu (stub). Phase sau: nhập SĐT/mã đơn và gọi API.</p>
          <form className="mt-6 grid gap-3">
            <label className="text-sm font-semibold text-slate-700">
              Số điện thoại
              <input
                className="mt-2 h-11 w-full rounded-2xl border bg-white px-4 text-sm outline-none focus:ring-2 focus:ring-(--lc-blue-700)/30"
                placeholder="VD: 0901 234 567"
              />
            </label>
            <button
              type="button"
              className="h-11 rounded-2xl bg-(--lc-blue-700) px-5 text-sm font-extrabold text-white hover:bg-(--lc-blue-800)"
            >
              Tra cứu
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </main>
  );
}

