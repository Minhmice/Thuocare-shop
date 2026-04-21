import fs from "node:fs";
import path from "node:path";
import { createClient } from "@supabase/supabase-js";

/* eslint-disable @typescript-eslint/no-explicit-any */

function loadDotEnv() {
  const envPath = path.resolve(".env");
  if (!fs.existsSync(envPath)) return;
  const raw = fs.readFileSync(envPath, "utf8");
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!key) continue;
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

type ScrapedProduct = {
  id: string;
  slug: string;
  title: string;
  short_title?: string | null;
  brand?: { name?: string | null; slug?: string | null; country?: string | null } | null;
  category?: { slug?: string | null; name?: string | null; parent_slug?: string | null } | null;
  price_amount?: number | null;
  compare_at_amount?: number | null;
  unit?: string | null;
  pack_note?: string | null;
  image_url?: string | null;
  images?: string[] | null;
  origin_label?: string | null;
  country?: string | null;
  badge?: string | null;
  benefit_tag?: unknown;
  format_tag?: string | null;
  trust_label?: string | null;
  short_description?: string | null;
  description_html?: string | null;
  usage_html?: string | null;
  ingredients_html?: unknown;
  stock_qty?: number | null;
};

function env(name: string): string | undefined {
  return process.env[name];
}

function mustEnv(name: string): string {
  const v = env(name);
  if (!v) throw new Error(`Missing env: ${name}`);
  return v;
}

function getSupabaseUrl() {
  return env("SUPABASE_URL") ?? env("NEXT_PUBLIC_SUPABASE_URL") ?? mustEnv("NEXT_PUBLIC_SUPABASE_URL");
}

function getServiceKey() {
  return (
    env("SUPABASE_SERVICE_ROLE_KEY") ??
    env("SERVICE_SUPABASESERVICE_KEY") ??
    env("SUPABASE_SERVICE_KEY") ??
    mustEnv("SUPABASE_SERVICE_ROLE_KEY")
  );
}

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function firstText(x: unknown): string | null {
  if (!x) return null;
  if (typeof x === "string") return x.trim() || null;
  if (Array.isArray(x)) {
    const v = x.find((i) => typeof i === "string") as string | undefined;
    return v?.trim() || null;
  }
  return null;
}

function ingredientsToHtml(x: unknown): string | null {
  if (!x) return null;
  if (typeof x === "string") return x.trim() || null;
  if (!Array.isArray(x)) return null;
  const items = x
    .map((i) => {
      if (!i || typeof i !== "object") return null;
      const name = (i as any).name as string | undefined;
      const sd = (i as any).shortDescription as string | undefined;
      const n = (name ?? "").trim();
      const s = (sd ?? "").trim();
      if (!n && !s) return null;
      return `<li>${escapeHtml(n || "—")}${s ? ` - ${escapeHtml(s)}` : ""}</li>`;
    })
    .filter(Boolean) as string[];
  if (!items.length) return null;
  return `<ul>${items.join("")}</ul>`;
}

function escapeHtml(s: string) {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function normalizeNull(s: unknown): string | null {
  if (typeof s !== "string") return null;
  const t = s.trim();
  return t ? t : null;
}

async function main() {
  loadDotEnv();
  const file = path.resolve("src/data/longchau/products.json");
  if (!fs.existsSync(file)) throw new Error(`Missing file: ${file}`);

  const url = getSupabaseUrl();
  const serviceKey = getServiceKey();
  const sb = createClient(url, serviceKey, { auth: { persistSession: false } });

  const raw = fs.readFileSync(file, "utf8");
  const items = JSON.parse(raw) as ScrapedProduct[];

  const brandMap = new Map<string, { id: string; name: string; slug: string; country: string | null; is_active: boolean; sort: number }>();
  const catMap = new Map<string, { id: string; name: string; slug: string; parent_id: string | null; is_active: boolean; sort: number }>();
  const products: any[] = [];
  const images: Array<{ product_id: string; image_url: string; sort: number }> = [];

  for (const p of items) {
    const brandSlug = p.brand?.slug ? p.brand.slug.trim() : null;
    if (brandSlug) {
      brandMap.set(brandSlug, {
        id: brandSlug,
        slug: brandSlug,
        name: (p.brand?.name ?? brandSlug).trim(),
        country: normalizeNull(p.brand?.country),
        is_active: true,
        sort: 0,
      });
    }

    const catSlug = p.category?.slug ? p.category.slug.trim() : null;
    const parentSlug = p.category?.parent_slug ? p.category.parent_slug.trim() : null;
    if (catSlug) {
      catMap.set(catSlug, {
        id: catSlug,
        slug: catSlug,
        name: (p.category?.name ?? catSlug).trim(),
        parent_id: parentSlug,
        is_active: true,
        sort: 0,
      });
    }
    if (parentSlug && !catMap.has(parentSlug)) {
      catMap.set(parentSlug, {
        id: parentSlug,
        slug: parentSlug,
        name: parentSlug,
        parent_id: null,
        is_active: true,
        sort: 0,
      });
    }

    const price = typeof p.price_amount === "number" ? p.price_amount : 0;
    const compareRaw = typeof p.compare_at_amount === "number" ? p.compare_at_amount : null;
    const compare = !compareRaw || compareRaw <= price ? null : compareRaw;

    products.push({
      id: p.id,
      slug: p.slug,
      title: p.title,
      short_title: normalizeNull(p.short_title),
      brand_id: brandSlug,
      category_id: catSlug,
      image_url: normalizeNull(p.image_url),
      price_amount: price,
      compare_at_amount: compare,
      unit: normalizeNull(p.unit),
      pack_note: normalizeNull(p.pack_note),
      origin_label: normalizeNull(p.origin_label),
      country: normalizeNull(p.country),
      badge: normalizeNull(p.badge),
      benefit_tag: firstText(p.benefit_tag),
      format_tag: normalizeNull(p.format_tag),
      trust_label: normalizeNull(p.trust_label),
      short_description: normalizeNull(p.short_description),
      description_html: normalizeNull(p.description_html),
      usage_html: normalizeNull(p.usage_html),
      ingredients_html: ingredientsToHtml(p.ingredients_html),
      stock_qty: typeof p.stock_qty === "number" ? p.stock_qty : 0,
      is_active: true,
      sort: 0,
    });

    if (Array.isArray(p.images)) {
      for (let i = 0; i < p.images.length; i++) {
        const u = (p.images[i] ?? "").trim();
        if (!u) continue;
        images.push({ product_id: p.id, image_url: u, sort: i });
      }
    }
  }

  const brands = Array.from(brandMap.values());
  const categories = Array.from(catMap.values());

  console.log(`rows: products=${products.length} brands=${brands.length} categories=${categories.length} images=${images.length}`);

  // 1) brands
  for (const part of chunk(brands, 500)) {
    const { error } = await sb.from("brands").upsert(part, { onConflict: "id" });
    if (error) throw error;
  }

  // 2) categories
  for (const part of chunk(categories, 500)) {
    const { error } = await sb.from("categories").upsert(part, { onConflict: "id" });
    if (error) throw error;
  }

  // 3) products
  for (const part of chunk(products, 200)) {
    const { error } = await sb.from("products").upsert(part, { onConflict: "id" });
    if (error) throw error;
  }

  // 4) product_images: delete then insert per batch of product_ids
  const productIds = products.map((p) => p.id);
  for (const ids of chunk(productIds, 200)) {
    const { error } = await sb.from("product_images").delete().in("product_id", ids);
    if (error) throw error;
  }
  for (const part of chunk(images, 1000)) {
    const { error } = await sb.from("product_images").insert(part);
    if (error) throw error;
  }

  // verify
  const [{ count: c1 }, { count: c2 }, { count: c3 }] = await Promise.all([
    sb.from("products").select("*", { count: "exact", head: true }),
    sb.from("brands").select("*", { count: "exact", head: true }),
    sb.from("product_images").select("*", { count: "exact", head: true }),
  ]);
  console.log(`done. db counts: products=${c1 ?? "?"} brands=${c2 ?? "?"} images=${c3 ?? "?"}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

