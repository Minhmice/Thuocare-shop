import { Footer } from "@/components/layout/footer";
import { HeaderServer } from "@/components/layout/header.server";
import { Hero } from "@/components/sections/hero";
import {
  ArticleFeatureSection,
  BestSellers,
  BrandStrip,
  HealthSegments,
  PromoCommerce,
  TrustBand,
} from "@/components/sections/home-sections";
import { getHomepageFeaturedProducts } from "@/data/home";
import { getFeaturedArticle } from "@/data/articles";

export default async function Home() {
  const [featuredProducts, featuredArticle] = await Promise.all([getHomepageFeaturedProducts(12), getFeaturedArticle()]);

  const promo = featuredProducts;
  const best = featuredProducts;

  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <HeaderServer />
      <Hero />
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
