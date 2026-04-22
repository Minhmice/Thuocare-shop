import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { SubcategoryListing } from "@/components/catalog/listing/subcategory-listing";

export default async function Page() {
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <Header />
      <SubcategoryListing />
      <Footer />
    </main>
  );
}

