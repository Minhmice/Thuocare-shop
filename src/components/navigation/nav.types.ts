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

export type NavTile = {
  id: string;
  label: string;
  icon: NavIconKey;
  href?: string;
};

export type NavSidebarItem = {
  id: string;
  label: string;
  icon: NavIconKey;
  tiles: NavTile[];
  bestSellers: ProductCard[];
};

export type NavPanel = {
  id: string;
  sidebar: NavSidebarItem[];
};

export type TopNavItem = {
  id: string;
  label: string;
  href?: string;
  panel?: NavPanel;
};

