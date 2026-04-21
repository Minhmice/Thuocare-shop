import { LongChauFooter } from "@/components/longchau-footer";
import { LongChauHeader } from "@/components/longchau-header";
import { LongChauCategoryListing } from "@/components/longchau-category-listing";
import { getProductsByCategorySlug } from "@/data/products";
import { getCategoryMetaBySlug } from "@/data/categories";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, products] = await Promise.all([getCategoryMetaBySlug(slug), getProductsByCategorySlug(slug)]);

  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <LongChauHeader />
      <LongChauCategoryListing title={category?.name_en ?? category?.name ?? slug} products={products} />
      <LongChauFooter />
    </main>
  );
}

