import { LongChauFooter } from "@/components/longchau-footer";
import { LongChauHeader } from "@/components/longchau-header";
import { LongChauHero } from "@/components/longchau-hero";
import { LongChauQuickActions } from "@/components/longchau-quick-actions";
import {
  LongChauArticleFeatureSection,
  LongChauBestSellers,
  LongChauBrandStrip,
  LongChauHealthSegments,
  LongChauPromoCommerce,
  LongChauTrustBand,
} from "@/components/longchau-home-sections";
import { getHomepageCollections } from "@/data/collections";
import { getFeaturedArticle } from "@/data/articles";

export default async function Home() {
  const [collections, featuredArticle] = await Promise.all([getHomepageCollections(), getFeaturedArticle()]);

  const promo = collections.find((c) => c.id === "home_promo")?.products ?? [];
  const best = collections.find((c) => c.id === "home_best_sellers")?.products ?? [];

  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <LongChauHeader />
      <LongChauHero />
      <LongChauQuickActions />
      <LongChauPromoCommerce className="border-t" products={promo} />
      <LongChauBestSellers className="border-t" products={best.length ? best : promo} />
      <LongChauBrandStrip className="border-t" />
      <LongChauArticleFeatureSection className="border-t" featuredArticle={featuredArticle} />
      <LongChauHealthSegments className="border-t" />
      <LongChauTrustBand className="border-t" />
      <LongChauFooter />
    </main>
  );
}
