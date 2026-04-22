import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CategoryListing } from "@/components/catalog/listing/category-listing";
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
      <Header />
      <CategoryListing title={category?.name_en ?? category?.name ?? fullSlug} products={products} />
      <Footer />
    </main>
  );
}

