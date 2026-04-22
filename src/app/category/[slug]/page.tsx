import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CategoryListing } from "@/components/catalog/listing/category-listing";
import { getProductsByCategorySlug } from "@/data/products";
import { getCategoryMetaBySlug } from "@/data/categories";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [category, products] = await Promise.all([getCategoryMetaBySlug(slug), getProductsByCategorySlug(slug)]);

  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <Header />
      <CategoryListing title={category?.name_en ?? category?.name ?? slug} products={products} />
      <Footer />
    </main>
  );
}

