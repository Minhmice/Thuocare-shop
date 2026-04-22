import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { CategoryListing } from "@/components/catalog/listing/category-listing";
import { getProductsByCategorySlug } from "@/data/products";

export default async function Page() {
  const products = await getProductsByCategorySlug("thuc-pham-chuc-nang");
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <Header />
      <CategoryListing products={products} />
      <Footer />
    </main>
  );
}

