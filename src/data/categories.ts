import { createSupabaseAnonServerClient, isSupabaseConfigured } from "@/lib/supabase/server";

export type CategoryMeta = { id: string; slug: string; name: string; name_en: string | null; parent_id: string | null };

export async function getCategoryMetaBySlug(slug: string): Promise<CategoryMeta | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createSupabaseAnonServerClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id,slug,name,name_en,parent_id")
    .eq("slug", slug)
    .limit(1)
    .maybeSingle<CategoryMeta>();
  if (error) throw error;
  return data ?? null;
}

