import { createClient } from "@supabase/supabase-js";

export type SupabaseEnv = {
  url: string;
  anonKey: string;
  serviceRoleKey?: string;
};

export function isSupabaseConfigured() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey);
}

export function getSupabaseEnv(): SupabaseEnv {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.SUPABASE_ANON_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url) throw new Error("Missing env: SUPABASE_URL");
  if (!anonKey) throw new Error("Missing env: SUPABASE_ANON_KEY");

  return {
    url,
    anonKey,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  };
}

export function createSupabaseAnonServerClient() {
  const { url, anonKey } = getSupabaseEnv();
  return createClient(url, anonKey, { auth: { persistSession: false } });
}

export function createSupabaseServiceRoleServerClient() {
  const { url, serviceRoleKey } = getSupabaseEnv();
  if (!serviceRoleKey) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY");
  return createClient(url, serviceRoleKey, { auth: { persistSession: false } });
}

