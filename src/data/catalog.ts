import { createSupabaseAnonServerClient } from "@/lib/supabase/server";

export type CatalogNodeChild = { id: string; name: string; slug: string; routePath: string };
export type CatalogBreadcrumbItem = { id: string; name: string; routePath: string };

export type CatalogNodePage = {
  node: {
    id: string;
    name: string;
    slug: string;
    routePath: string;
    description: string | null;
    heroTitle: string | null;
    heroDescription: string | null;
    seoTitle: string | null;
    seoDescription: string | null;
  };
  breadcrumb: CatalogBreadcrumbItem[];
  children: CatalogNodeChild[];
  featuredLinks: Array<{ id: string; type: string; label: string; description: string | null; href: string }>;
  productPreview: Array<{ id: string; name: string; slug: string; routePath: string; thumbnailUrl: string | null; price: number | null }>;
};

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v && typeof v === "object");
}

export async function getNodePageByPath(routePath: string): Promise<CatalogNodePage | null> {
  let supabase: ReturnType<typeof createSupabaseAnonServerClient> | null = null;
  try {
    supabase = createSupabaseAnonServerClient();
  } catch {
    return null;
  }
  try {
    const { data, error } = await supabase.rpc("get_node_page_by_path", { p_route_path: routePath });
    if (error) return null;
    if (!isRecord(data)) return null;
    return data as CatalogNodePage;
  } catch {
    return null;
  }
}

export type CatalogProductPage = {
  product: {
    id: string;
    name: string;
    slug: string;
    route_path: string;
    short_description: string | null;
    description: string | null;
    thumbnail_url: string | null;
    gallery: unknown;
    price: number | null;
    compare_at_price: number | null;
  } | null;
  primaryNode: { id: string; name: string; routePath: string } | null;
  tags: Array<{ id: string; name: string; slug: string; type: string }>;
  related: Array<{ id: string; name: string; slug: string; routePath: string; thumbnailUrl: string | null; price: number | null }>;
};

export async function getCatalogProductPageBySlug(slug: string): Promise<CatalogProductPage | null> {
  let supabase: ReturnType<typeof createSupabaseAnonServerClient> | null = null;
  try {
    supabase = createSupabaseAnonServerClient();
  } catch {
    return null;
  }
  try {
    const { data, error } = await supabase.rpc("get_product_page_by_slug", { p_slug: slug });
    if (error) return null;
    if (!isRecord(data)) return null;
    return data as CatalogProductPage;
  } catch {
    return null;
  }
}

export type CatalogNodeProductsPage = {
  node: { id: string; name: string; routePath: string };
  page: number;
  pageSize: number;
  totalCount: number;
  items: Array<{ id: string; name: string; slug: string; routePath: string; thumbnailUrl: string | null; price: number | null }>;
};

function isCatalogNodeProductsPage(v: unknown): v is CatalogNodeProductsPage {
  if (!isRecord(v)) return false;
  if (!isRecord(v.node)) return false;
  const node = v.node as Record<string, unknown>;
  if (typeof node.id !== "string" || typeof node.name !== "string" || typeof node.routePath !== "string") return false;
  if (typeof v.page !== "number" || typeof v.pageSize !== "number" || typeof v.totalCount !== "number") return false;
  if (!Array.isArray(v.items)) return false;
  return v.items.every((it) => {
    if (!isRecord(it)) return false;
    return (
      typeof it.id === "string" &&
      typeof it.name === "string" &&
      typeof it.slug === "string" &&
      typeof it.routePath === "string" &&
      (it.thumbnailUrl === null || typeof it.thumbnailUrl === "string") &&
      (it.price === null || typeof it.price === "number")
    );
  });
}

export async function getNodeProductsByPath(args: {
  routePath: string;
  page?: number;
  pageSize?: number;
  sort?: "featured" | "newest" | "price_asc" | "price_desc";
}): Promise<CatalogNodeProductsPage | null> {
  let supabase: ReturnType<typeof createSupabaseAnonServerClient> | null = null;
  try {
    supabase = createSupabaseAnonServerClient();
  } catch {
    return null;
  }
  try {
    const { data, error } = await supabase.rpc("get_node_products_by_path", {
      p_route_path: args.routePath,
      p_page: args.page ?? 1,
      p_page_size: args.pageSize ?? 24,
      p_sort: args.sort ?? "featured",
    });
    if (error) return null;
    if (!isCatalogNodeProductsPage(data)) return null;
    return data;
  } catch {
    return null;
  }
}

