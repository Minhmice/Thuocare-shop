export type DbBrand = {
  id: string;
  name: string;
  name_en: string | null;
  slug: string;
  logo_url: string | null;
  country: string | null;
  is_active: boolean;
  sort: number;
};

export type DbCategory = {
  id: string;
  name: string;
  name_en: string | null;
  slug: string;
  parent_id: string | null;
  is_active: boolean;
  sort: number;
};

export type DbProduct = {
  id: string;
  slug: string;
  title: string;
  title_en: string | null;
  short_title: string | null;
  short_title_en: string | null;
  brand_id: string | null;
  category_id: string | null;
  image_url: string | null;
  price_amount: number;
  compare_at_amount: number | null;
  unit: string | null;
  pack_note: string | null;
  origin_label: string | null;
  country: string | null;
  badge: string | null;
  benefit_tag: string | null;
  format_tag: string | null;
  trust_label: string | null;
  short_description: string | null;
  description_html: string | null;
  usage_html: string | null;
  ingredients_html: string | null;
  stock_qty: number;
  is_active: boolean;
  sort: number;
  created_at: string;
  updated_at: string;
};

export type DbProductImage = {
  id: number;
  product_id: string;
  image_url: string;
  sort: number;
};

export type DbNavTopItem = {
  id: string;
  label: string;
  href: string | null;
  sort: number;
  is_active: boolean;
};

export type DbNavSidebarItem = {
  id: string;
  top_id: string;
  label: string;
  icon_key: string;
  sort: number;
  is_active: boolean;
};

export type DbNavTile = {
  id: string;
  sidebar_id: string;
  label: string;
  icon_key: string;
  href: string | null;
  sort: number;
  is_active: boolean;
};

export type DbCollection = {
  id: string;
  title: string | null;
  description: string | null;
  type: string;
  sort: number;
  is_active: boolean;
};

export type DbCollectionItem = {
  collection_id: string;
  product_id: string;
  sort: number;
};

export type DbArticle = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  cover_image_url: string | null;
  content_html: string | null;
  is_featured: boolean;
  is_active: boolean;
  published_at: string | null;
  created_at: string;
};

