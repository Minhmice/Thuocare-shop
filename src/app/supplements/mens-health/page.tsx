import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { MaleListing } from "@/components/catalog/listing/male-listing";

export default async function Page() {
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <Header />
      <MaleListing />
      <Footer />
    </main>
  );
}

