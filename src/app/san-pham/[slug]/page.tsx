import { Footer } from "@/components/layout/footer";
import { HeaderServer } from "@/components/layout/header.server";
import { CatalogProductDetailView } from "@/components/catalog/product-detail/product-detail";
import { getCatalogProductPageBySlug } from "@/data/catalog";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCatalogProductPageBySlug(slug);

  if (!data?.product) {
    return (
      <main className="min-h-screen bg-[color:var(--lc-surface)]">
        <HeaderServer />
        <div className="mx-auto max-w-[1200px] px-3 py-10 sm:px-4">
          <div className="rounded-2xl border bg-white p-6 text-sm text-slate-700">Product not found.</div>
        </div>
        <Footer />
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <HeaderServer />
      <CatalogProductDetailView data={data} />
      <Footer />
    </main>
  );
}

