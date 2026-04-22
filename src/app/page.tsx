import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { Hero } from "@/components/sections/hero";
import { QuickActions } from "@/components/sections/quick-actions";
import {
  ArticleFeatureSection,
  BestSellers,
  BrandStrip,
  HealthSegments,
  PromoCommerce,
  TrustBand,
} from "@/components/sections/home-sections";
import { getHomepageCollections } from "@/data/collections";
import { getFeaturedArticle } from "@/data/articles";

export default async function Home() {
  const [collections, featuredArticle] = await Promise.all([getHomepageCollections(), getFeaturedArticle()]);

  const promo = collections.find((c) => c.id === "home_promo")?.products ?? [];
  const best = collections.find((c) => c.id === "home_best_sellers")?.products ?? [];

  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <Header />
      <Hero />
      <QuickActions />
      <PromoCommerce className="border-t" products={promo} />
      <BestSellers className="border-t" products={best.length ? best : promo} />
      <BrandStrip className="border-t" />
      <ArticleFeatureSection className="border-t" featuredArticle={featuredArticle} />
      <HealthSegments className="border-t" />
      <TrustBand className="border-t" />
      <Footer />
    </main>
  );
}
