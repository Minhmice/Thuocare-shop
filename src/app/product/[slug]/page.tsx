import { LongChauFooter } from "@/components/longchau-footer";
import { LongChauHeader } from "@/components/longchau-header";
import { LongChauProductDetailView } from "@/components/longchau-product-detail";
import { getProductBySlug } from "@/data/products";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const detail = await getProductBySlug(slug);

  if (!detail) {
    return (
      <main className="min-h-screen bg-[color:var(--lc-surface)]">
        <LongChauHeader />
        <div className="mx-auto max-w-[1200px] px-3 py-10 sm:px-4">
          <div className="rounded-2xl border bg-white p-6 text-sm text-slate-700">Product not found.</div>
        </div>
        <LongChauFooter />
      </main>
    );
  }
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <LongChauHeader />
      <LongChauProductDetailView detail={detail} />
      <LongChauFooter />
    </main>
  );
}

