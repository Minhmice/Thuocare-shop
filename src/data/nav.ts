import type { ProductCard } from "@/types/commerce";
import type {
  NavIconKey,
  NavPanel,
  NavSidebarItem,
  NavTile,
  TopNavItem,
} from "@/components/navigation/nav.types";
import { createSupabaseAnonServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import { formatVnd } from "@/lib/money";
import type { DbBrand, DbNavSidebarItem, DbNavTile, DbProduct } from "@/lib/supabase/types";
import { MOCK_NAV } from "@/data/mock";
import type { DbCategory } from "@/lib/supabase/types";

type ProductRow = DbProduct & {
  brand?: Pick<DbBrand, "name" | "name_en" | "slug"> | null;
};

function toProductCard(p: ProductRow): ProductCard {
  return {
    id: p.id,
    title: p.title_en ?? p.title,
    country: p.country ?? undefined,
    badge: p.badge ?? undefined,
    imageUrl: p.image_url ?? undefined,
    price: { amount: p.price_amount, display: formatVnd(p.price_amount) },
    compareAt: p.compare_at_amount ? { amount: p.compare_at_amount, display: formatVnd(p.compare_at_amount) } : undefined,
    unit: p.unit ?? undefined,
    brand: p.brand?.name_en ?? p.brand?.name ?? undefined,
    originLabel: p.origin_label ?? undefined,
    benefitTag: p.benefit_tag ?? undefined,
    formatTag: p.format_tag ?? undefined,
    packNote: p.pack_note ?? undefined,
    trustLabel: p.trust_label ?? undefined,
    isAuthenticitySupported: true,
  };
}

function asIconKey(iconKey: string): NavIconKey {
  return iconKey as NavIconKey;
}

export async function getTopNav(): Promise<TopNavItem[]> {
  if (!isSupabaseConfigured()) return MOCK_NAV;
  const supabase = createSupabaseAnonServerClient();

  const { data: tops, error: topsErr } = await supabase
    .from("nav_top_items")
    .select("id,label,href,sort")
    .order("sort", { ascending: true });

  if (topsErr) throw topsErr;
  // Fallback: if nav tables not seeded yet, build a minimal nav from categories.
  if (!tops || tops.length === 0) {
    const { data: roots, error: rootsErr } = await supabase
      .from("categories")
      .select("id,slug,name,name_en,sort")
      .is("parent_id", null)
      .order("sort", { ascending: true })
      .order("name", { ascending: true })
      .limit(12);
    if (rootsErr) throw rootsErr;

    // Build basic top nav. Only add dropdown for nodes that have children.
    const rootIds = (roots ?? []).map((r) => r.id);
    const { data: children, error: childErr } = await supabase
      .from("categories")
      .select("id,slug,name,name_en,parent_id,sort")
      .in("parent_id", rootIds)
      .order("sort", { ascending: true })
      .order("name", { ascending: true });
    if (childErr) throw childErr;

    type CategoryLite = Pick<DbCategory, "id" | "slug" | "name" | "name_en" | "parent_id" | "sort">;
    const childrenByRoot = new Map<string, CategoryLite[]>();
    for (const c of (children ?? []) as CategoryLite[]) {
      const parentId = c.parent_id ?? "";
      const arr = childrenByRoot.get(parentId) ?? [];
      arr.push(c);
      childrenByRoot.set(parentId, arr);
    }

    return (roots ?? []).map((r) => {
      const kids = childrenByRoot.get(r.id) ?? [];
      const sidebar: NavSidebarItem[] = kids.map((k) => ({
        id: k.id,
        label: k.name_en ?? k.name,
        icon: "pill",
        tiles: [],
        bestSellers: [],
      }));
      const panel: NavPanel | undefined = sidebar.length ? { id: `panel-${r.id}`, sidebar } : undefined;
      return {
        id: r.id,
        label: r.name_en ?? r.name,
        href: `/list/${r.slug}`,
        panel,
      };
    });
  }
  const topIds = (tops ?? []).map((t) => t.id);

  const { data: sidebarsRaw, error: sidebarsErr } = await supabase
    .from("nav_sidebar_items")
    .select("id,top_id,label,icon_key,sort")
    .in("top_id", topIds)
    .order("sort", { ascending: true })
    .returns<DbNavSidebarItem[]>();
  if (sidebarsErr) throw sidebarsErr;

  const sidebarIds = (sidebarsRaw ?? []).map((s) => s.id);

  const { data: tilesRaw, error: tilesErr } = await supabase
    .from("nav_tiles")
    .select("id,sidebar_id,label,icon_key,href,sort")
    .in("sidebar_id", sidebarIds)
    .order("sort", { ascending: true })
    .returns<DbNavTile[]>();
  if (tilesErr) throw tilesErr;

  const { data: bestRaw, error: bestErr } = await supabase
    .from("nav_best_sellers")
    .select("sidebar_id,sort,product:products(*, brand:brands(name,slug))")
    .in("sidebar_id", sidebarIds)
    .order("sort", { ascending: true });
  if (bestErr) throw bestErr;

  const tilesBySidebar = new Map<string, NavTile[]>();
  for (const t of tilesRaw ?? []) {
    const arr = tilesBySidebar.get(t.sidebar_id) ?? [];
    arr.push({ id: t.id, label: t.label, icon: asIconKey(t.icon_key), href: t.href ?? undefined });
    tilesBySidebar.set(t.sidebar_id, arr);
  }

  const bestBySidebar = new Map<string, ProductCard[]>();
  for (const row of (bestRaw ?? []) as unknown as Array<{
    sidebar_id: string;
    product: ProductRow | ProductRow[] | null;
  }>) {
    const product = Array.isArray(row.product) ? (row.product[0] ?? null) : row.product;
    if (!product) continue;
    const arr = bestBySidebar.get(row.sidebar_id) ?? [];
    arr.push(toProductCard(product));
    bestBySidebar.set(row.sidebar_id, arr);
  }

  const sidebarsByTop = new Map<string, NavSidebarItem[]>();
  for (const s of sidebarsRaw ?? []) {
    const sidebar: NavSidebarItem = {
      id: s.id,
      label: s.label,
      icon: asIconKey(s.icon_key),
      tiles: tilesBySidebar.get(s.id) ?? [],
      bestSellers: bestBySidebar.get(s.id) ?? [],
    };
    const arr = sidebarsByTop.get(s.top_id) ?? [];
    arr.push(sidebar);
    sidebarsByTop.set(s.top_id, arr);
  }

  return (tops ?? []).map((t) => {
    const sidebar = sidebarsByTop.get(t.id);
    const panel: NavPanel | undefined = sidebar ? { id: `panel-${t.id}`, sidebar } : undefined;
    return { id: t.id, label: t.label, href: t.href ?? undefined, panel };
  });
}

