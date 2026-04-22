import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ProductDetail } from "@/components/catalog/product-detail/product-detail";

export default async function Page() {
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <Header />
      <ProductDetail />
      <Footer />
    </main>
  );
}

