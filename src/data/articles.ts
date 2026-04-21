import { createSupabaseAnonServerClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { DbArticle } from "@/lib/supabase/types";
import { MOCK_FEATURED_ARTICLE } from "@/data/mock";

export async function getFeaturedArticle(): Promise<DbArticle | null> {
  if (!isSupabaseConfigured()) return MOCK_FEATURED_ARTICLE;
  const supabase = createSupabaseAnonServerClient();
  const { data, error } = await supabase
    .from("articles")
    .select("*")
    .eq("is_featured", true)
    .order("published_at", { ascending: false })
    .limit(1)
    .maybeSingle<DbArticle>();
  if (error) throw error;
  return data ?? null;
}

export async function getArticleBySlug(slug: string): Promise<DbArticle | null> {
  if (!isSupabaseConfigured()) {
    return slug === MOCK_FEATURED_ARTICLE.slug ? MOCK_FEATURED_ARTICLE : null;
  }
  const supabase = createSupabaseAnonServerClient();
  const { data, error } = await supabase.from("articles").select("*").eq("slug", slug).limit(1).maybeSingle<DbArticle>();
  if (error) throw error;
  return data ?? null;
}

