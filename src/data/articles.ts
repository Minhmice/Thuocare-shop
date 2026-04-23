import { createSupabaseAnonServerClient } from "@/lib/supabase/server";
import type { DbArticle } from "@/lib/supabase/types";

export async function getFeaturedArticle(): Promise<DbArticle | null> {
  try {
    const supabase = createSupabaseAnonServerClient();
    const { data, error } = await supabase
      .from("articles")
      .select("*")
      .eq("is_featured", true)
      .order("published_at", { ascending: false })
      .limit(1)
      .maybeSingle<DbArticle>();
    if (error) return null;
    return data ?? null;
  } catch {
    return null;
  }
}

export async function getArticleBySlug(slug: string): Promise<DbArticle | null> {
  try {
    const supabase = createSupabaseAnonServerClient();
    const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).limit(1).maybeSingle<DbArticle>();
    if (error) return null;
    return data ?? null;
  } catch {
    return null;
  }
}

