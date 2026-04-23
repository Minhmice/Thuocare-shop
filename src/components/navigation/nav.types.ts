import type { ProductCard } from "@/types/commerce";

export type NavIconKey =
  | "vitamins"
  | "shield"
  | "hormones"
  | "eye"
  | "stomach"
  | "brain"
  | "sparkles"
  | "droplet"
  | "heart"
  | "lungs"
  | "bones"
  | "face"
  | "body"
  | "skin"
  | "hair"
  | "makeup"
  | "eyeCare"
  | "leaf"
  | "pill"
  | "flask"
  | "mortar"
  | "syringe"
  | "bandage"
  | "activity"
  | "family"
  | "shopping"
  | "drops"
  | "stethoscope"
  | "ribbon"
  | "badge"
  | "megaphone"
  | "star";

export type NavLink = {
  id: string;
  label: string;
  href: string;
  description?: string;
  icon?: NavIconKey;
};

export type NavPromoCard = {
  kind: "promoCard";
  id: string;
  title: string;
  description?: string;
  href: string;
  imageUrl?: string;
};

export type NavMegaBlock =
  | {
      kind: "links";
      id: string;
      title: string;
      links: NavLink[];
      viewAll?: NavLink;
    }
  | {
      kind: "bestSellers";
      id: string;
      title: string;
      products: ProductCard[];
      href?: string;
    }
  | NavPromoCard;

export type NavTopItem = {
  id: string;
  label: string;
  href: string;
  kind: "category" | "service" | "content";
  mega?: {
    id: string;
    blocks: NavMegaBlock[]; // expected: A/B/C blocks (shallow)
  };
};

export type HeaderNavModel = {
  utility: NavTopItem[];
  main: NavTopItem[];
  source: "supabase" | "static" | "fallback";
};

