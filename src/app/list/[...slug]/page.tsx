import { LongChauFooter } from "@/components/longchau-footer";
import { LongChauHeader } from "@/components/longchau-header";
import { LongChauCategoryListing } from "@/components/longchau-category-listing";
import { getProductsByCategorySlug } from "@/data/products";
import { getCategoryMetaBySlug } from "@/data/categories";

function joinSlug(parts: string[] | string) {
  return Array.isArray(parts) ? parts.join("/") : parts;
}

export default async function Page({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const fullSlug = joinSlug(slug);

  const [category, products] = await Promise.all([getCategoryMetaBySlug(fullSlug), getProductsByCategorySlug(fullSlug, 96)]);

  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <LongChauHeader />
      <LongChauCategoryListing title={category?.name_en ?? category?.name ?? fullSlug} products={products} />
      <LongChauFooter />
    </main>
  );
}

