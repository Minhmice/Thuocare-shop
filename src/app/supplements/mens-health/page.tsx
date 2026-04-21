import { LongChauFooter } from "@/components/longchau-footer";
import { LongChauHeader } from "@/components/longchau-header";
import { LongChauMaleListing } from "@/components/longchau-male-listing";

export default async function Page() {
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <LongChauHeader />
      <LongChauMaleListing />
      <LongChauFooter />
    </main>
  );
}

