import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export default async function Page() {
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <Header />
      <div className="mx-auto max-w-[800px] px-3 py-8 sm:px-4">
        <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-xl font-extrabold text-slate-900">Checkout</h1>
          <p className="mt-1 text-sm text-slate-600">Phase 1: chỉ lấy số điện thoại để nhân viên gọi xác nhận.</p>
          <CheckoutForm />
        </div>
      </div>
      <Footer />
    </main>
  );
}

