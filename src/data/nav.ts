import type { HeaderNavModel, NavTopItem } from "@/components/navigation/nav.types";
import { createSupabaseAnonServerClient } from "@/lib/supabase/server";
import { STATIC_HEADER_NAV } from "@/components/navigation/nav.data";

type HeaderNavRpcItem = { id: string; name: string; routePath: string };
type HeaderNavRpcResponse = { items: HeaderNavRpcItem[] };

function isHeaderNavRpcResponse(v: unknown): v is HeaderNavRpcResponse {
  if (!v || typeof v !== "object") return false;
  const items = (v as { items?: unknown }).items;
  if (!Array.isArray(items)) return false;
  return items.every((it) => {
    if (!it || typeof it !== "object") return false;
    const o = it as { id?: unknown; name?: unknown; routePath?: unknown };
    return typeof o.id === "string" && typeof o.name === "string" && typeof o.routePath === "string";
  });
}

export async function getHeaderNav(): Promise<HeaderNavModel> {
  let supabase: ReturnType<typeof createSupabaseAnonServerClient> | null = null;
  try {
    supabase = createSupabaseAnonServerClient();
  } catch {
    return { ...STATIC_HEADER_NAV, source: "fallback" };
  }

  // Prefer new RPC contract (catalog_nodes-based). Fall back to legacy nav tables.
  try {
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_header_navigation");
    if (!rpcError && isHeaderNavRpcResponse(rpcData)) {
      const items = rpcData.items;
      // Map to existing HeaderNavModel minimally (main categories as links).
      const main: NavTopItem[] = items.flatMap((it) => {
        if (!it.routePath) return [];
        return [{ id: it.id, label: it.name, href: it.routePath, kind: "category" }];
      });
      if (main.length) return { utility: STATIC_HEADER_NAV.utility, main, source: "supabase" };
    }
  } catch {
    // Supabase may throw if the upstream is not JSON (e.g. Cloudflare tunnel error page).
  }

  // No legacy fallback (Supabase-only). If RPC fails or returns empty, use static nav.
  return { ...STATIC_HEADER_NAV, source: "fallback" };
}

