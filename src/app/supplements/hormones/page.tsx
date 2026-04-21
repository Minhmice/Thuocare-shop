import { LongChauFooter } from "@/components/longchau-footer";
import { LongChauHeader } from "@/components/longchau-header";
import { LongChauSubcategoryListing } from "@/components/longchau-subcategory-listing";

export default async function Page() {
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <LongChauHeader />
      <LongChauSubcategoryListing />
      <LongChauFooter />
    </main>
  );
}

