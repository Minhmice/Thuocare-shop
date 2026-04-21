import { LongChauFooter } from "@/components/longchau-footer";
import { LongChauHeader } from "@/components/longchau-header";
import { LongChauCategoryListing } from "@/components/longchau-category-listing";
import { getProductsByCategorySlug } from "@/data/products";

export default async function Page() {
  const products = await getProductsByCategorySlug("thuc-pham-chuc-nang");
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <LongChauHeader />
      <LongChauCategoryListing products={products} />
      <LongChauFooter />
    </main>
  );
}

