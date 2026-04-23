import "dotenv/config";

import { createClient } from "@supabase/supabase-js";
import { mkdir, readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";

type LongChauProductJson = {
  id: string;
  slug: string; // e.g. "thuoc/foo-bar-123.html"
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
  benefit_tag?: string[] | null;
  format_tag?: string | null;
  trust_label?: string | null;
  short_description?: string | null; // HTML
  description_html?: string | null;
  usage_html?: string | null;
  ingredients_html?: string | null;
};

type CatalogNodeUpsert = {
  node_type: "category_top" | "category_child";
  parent_id: string | null;
  name: string;
  slug: string;
  full_slug: string;
  route_path: string;
  description?: string | null;
  nav_description?: string | null;
  sort_order: number;
  is_active: boolean;
  is_visible_in_nav: boolean;
};

type CatalogProductUpsert = {
  name: string;
  slug: string;
  route_path: string;
  short_description: string | null;
  description: string | null;
  brand_name: string | null;
  sku: string | null;
  thumbnail_url: string | null;
  gallery: string[] | null;
  price: number | null;
  compare_at_price: number | null;
  is_active: boolean;
  is_featured: boolean;
  seo_title: string | null;
  seo_description: string | null;
};

type TagUpsert = {
  name: string;
  slug: string;
  tag_type: string;
  description: string | null;
  is_active: boolean;
};

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function fileSlugToProductSlug(input: string): string | null {
  // from JSON.slug like "thuoc/foo-bar.html" -> "foo-bar"
  const last = input.split("/").pop();
  if (!last) return null;
  return last.replace(/\.html$/i, "");
}

function slugToTitle(slug: string): string {
  return slug
    .split("-")
    .map((s) => (s.toLowerCase() === "and" ? "&" : s))
    .map((s) => (s.length ? s[0].toUpperCase() + s.slice(1) : s))
    .join(" ");
}

function topSlugFromCategoryPath(categorySlug: string): string | null {
  const first = categorySlug.split("/")[0];
  return first || null;
}

type MappingConfidence = "high" | "medium" | "low";
type VnMapping = {
  topRoute: string;
  childRoute: string;
  confidence: MappingConfidence;
  matchedBy: "parent_slug" | "category_slug" | "title" | "fallback";
};

const VN_TAXONOMY: Array<{
  topRoute: string;
  childRoute: string;
  name: string;
  sortOrder: number;
  keywords: string[];
}> = [
  // THUỐC
  {
    topRoute: "/thuoc",
    childRoute: "/thuoc/tieu-hoa-gan-mat",
    name: "Tiêu hóa - Gan mật",
    sortOrder: 10,
    keywords: ["tieu-hoa", "gan-mat", "da-day", "tieu-chay", "tao-bon", "viem-loet"],
  },
  {
    topRoute: "/thuoc",
    childRoute: "/thuoc/tim-mach",
    name: "Tim mạch",
    sortOrder: 20,
    keywords: ["tim-mach", "huyet-ap", "cholesterol", "lipid", "dong-mach", "chong-dong"],
  },
  {
    topRoute: "/thuoc",
    childRoute: "/thuoc/ho-hap",
    name: "Hô hấp",
    sortOrder: 30,
    keywords: ["ho-hap", "tai-mui-hong", "viem-hong", "hen", "xoang", "cam-cum"],
  },
  {
    topRoute: "/thuoc",
    childRoute: "/thuoc/than-kinh",
    name: "Thần kinh",
    sortOrder: 40,
    keywords: ["than-kinh", "tien-dinh", "mat-ngu", "tram-cam", "dong-kinh"],
  },
  {
    topRoute: "/thuoc",
    childRoute: "/thuoc/noi-tiet",
    name: "Nội tiết",
    sortOrder: 50,
    keywords: ["noi-tiet", "tieu-duong", "gout", "tuyen-giap", "hormone"],
  },
  {
    topRoute: "/thuoc",
    childRoute: "/thuoc/da-lieu",
    name: "Da liễu",
    sortOrder: 60,
    keywords: ["da-lieu", "tri-mun", "nam", "viem-da", "di-ung", "ngua"],
  },
  {
    topRoute: "/thuoc",
    childRoute: "/thuoc/khang-sinh",
    name: "Kháng sinh",
    sortOrder: 70,
    keywords: ["khang-sinh", "khang-viem", "amoxic", "azith", "cefix", "cef", "penicillin"],
  },
  {
    topRoute: "/thuoc",
    childRoute: "/thuoc/khac",
    name: "Khác",
    sortOrder: 999,
    keywords: [],
  },

  // THỰC PHẨM CHỨC NĂNG
  {
    topRoute: "/thuc-pham-chuc-nang",
    childRoute: "/thuc-pham-chuc-nang/vitamin-khoang-chat",
    name: "Vitamin - Khoáng chất",
    sortOrder: 10,
    keywords: ["vitamin", "khoang-chat", "canxi", "magie", "zinc", "kem", "omega", "dha", "epa"],
  },
  {
    topRoute: "/thuc-pham-chuc-nang",
    childRoute: "/thuc-pham-chuc-nang/mien-dich",
    name: "Miễn dịch",
    sortOrder: 20,
    keywords: ["mien-dich", "tang-de-khang", "de-khang", "cam-cum"],
  },
  {
    topRoute: "/thuc-pham-chuc-nang",
    childRoute: "/thuc-pham-chuc-nang/tieu-hoa",
    name: "Tiêu hóa",
    sortOrder: 30,
    keywords: ["tieu-hoa", "men-tieu-hoa", "probiotic", "da-day", "dai-trang", "tao-bon"],
  },
  {
    topRoute: "/thuc-pham-chuc-nang",
    childRoute: "/thuc-pham-chuc-nang/sinh-ly",
    name: "Sinh lý",
    sortOrder: 40,
    keywords: ["sinh-ly", "cuong-duong", "tang-cuong-sinh-ly", "noi-tiet-to", "man-kinh"],
  },
  {
    topRoute: "/thuc-pham-chuc-nang",
    childRoute: "/thuc-pham-chuc-nang/xuong-khop",
    name: "Xương khớp",
    sortOrder: 50,
    keywords: ["xuong-khop", "khop", "glucosamine", "collagen", "thoai-hoa", "dau-khop"],
  },
  {
    topRoute: "/thuc-pham-chuc-nang",
    childRoute: "/thuc-pham-chuc-nang/giam-can",
    name: "Giảm cân",
    sortOrder: 60,
    keywords: ["giam-can", "giam-mo", "dot-mo", "kiem-soat-can-nang"],
  },
  {
    topRoute: "/thuc-pham-chuc-nang",
    childRoute: "/thuc-pham-chuc-nang/lam-dep",
    name: "Làm đẹp",
    sortOrder: 70,
    keywords: ["lam-dep", "dep-da", "trang-da", "collagen", "da-dep"],
  },
  {
    topRoute: "/thuc-pham-chuc-nang",
    childRoute: "/thuc-pham-chuc-nang/khac",
    name: "Khác",
    sortOrder: 999,
    keywords: [],
  },

  // DƯỢC MỸ PHẨM
  {
    topRoute: "/duoc-my-pham",
    childRoute: "/duoc-my-pham/cham-soc-da",
    name: "Chăm sóc da",
    sortOrder: 10,
    keywords: ["cham-soc-da", "duong-da", "serum", "sua-rua-mat", "toner", "kem-duong"],
  },
  {
    topRoute: "/duoc-my-pham",
    childRoute: "/duoc-my-pham/chong-nang",
    name: "Chống nắng",
    sortOrder: 20,
    keywords: ["chong-nang", "kem-chong-nang", "spf", "uva", "uvb"],
  },
  {
    topRoute: "/duoc-my-pham",
    childRoute: "/duoc-my-pham/tri-mun",
    name: "Trị mụn",
    sortOrder: 30,
    keywords: ["tri-mun", "mun", "giam-mun", "salicylic", "bha", "aha"],
  },
  {
    topRoute: "/duoc-my-pham",
    childRoute: "/duoc-my-pham/duong-am",
    name: "Dưỡng ẩm",
    sortOrder: 40,
    keywords: ["duong-am", "cap-am", "kem-duong-am", "hyaluronic", "ha"],
  },
  {
    topRoute: "/duoc-my-pham",
    childRoute: "/duoc-my-pham/cham-soc-toc",
    name: "Chăm sóc tóc",
    sortOrder: 50,
    keywords: ["cham-soc-toc", "dau-goi", "dau-xa", "kich-moc-toc", "giam-rung-toc"],
  },
  {
    topRoute: "/duoc-my-pham",
    childRoute: "/duoc-my-pham/khac",
    name: "Khác",
    sortOrder: 999,
    keywords: [],
  },

  // CHĂM SÓC CÁ NHÂN
  {
    topRoute: "/cham-soc-ca-nhan",
    childRoute: "/cham-soc-ca-nhan/rang-mieng",
    name: "Răng miệng",
    sortOrder: 10,
    keywords: ["rang-mieng", "kem-danh-rang", "nuoc-suc-mieng", "chi-nha-khoa"],
  },
  {
    topRoute: "/cham-soc-ca-nhan",
    childRoute: "/cham-soc-ca-nhan/ve-sinh-phu-nu",
    name: "Vệ sinh phụ nữ",
    sortOrder: 20,
    keywords: ["ve-sinh-phu-nu", "dung-dich-ve-sinh", "tampon", "bang-ve-sinh"],
  },
  {
    topRoute: "/cham-soc-ca-nhan",
    childRoute: "/cham-soc-ca-nhan/khu-mui",
    name: "Khử mùi",
    sortOrder: 30,
    keywords: ["khu-mui", "lan-khu-mui", "khu-mui-co-the"],
  },
  {
    topRoute: "/cham-soc-ca-nhan",
    childRoute: "/cham-soc-ca-nhan/tam-goi",
    name: "Tắm gội",
    sortOrder: 40,
    keywords: ["tam-goi", "sua-tam", "dau-goi", "xa", "san-pham-tam-goi"],
  },
  {
    topRoute: "/cham-soc-ca-nhan",
    childRoute: "/cham-soc-ca-nhan/khac",
    name: "Khác",
    sortOrder: 999,
    keywords: [],
  },

  // THIẾT BỊ Y TẾ
  {
    topRoute: "/thiet-bi-y-te",
    childRoute: "/thiet-bi-y-te/khau-trang",
    name: "Khẩu trang",
    sortOrder: 10,
    keywords: ["khau-trang", "mask"],
  },
  {
    topRoute: "/thiet-bi-y-te",
    childRoute: "/thiet-bi-y-te/do-huyet-ap",
    name: "Đo huyết áp",
    sortOrder: 20,
    keywords: ["do-huyet-ap", "huyet-ap", "may-do-huyet-ap"],
  },
  {
    topRoute: "/thiet-bi-y-te",
    childRoute: "/thiet-bi-y-te/do-duong-huyet",
    name: "Đo đường huyết",
    sortOrder: 30,
    keywords: ["do-duong-huyet", "duong-huyet", "may-do-duong-huyet", "que-thu"],
  },
  {
    topRoute: "/thiet-bi-y-te",
    childRoute: "/thiet-bi-y-te/test-nhanh",
    name: "Test nhanh",
    sortOrder: 40,
    keywords: ["test", "test-nhanh", "kit-test", "que-test"],
  },
  {
    topRoute: "/thiet-bi-y-te",
    childRoute: "/thiet-bi-y-te/dung-cu-so-cuu",
    name: "Dụng cụ sơ cứu",
    sortOrder: 50,
    keywords: ["so-cuu", "bang", "gao", "dung-cu-so-cuu", "bong-bang"],
  },
  {
    topRoute: "/thiet-bi-y-te",
    childRoute: "/thiet-bi-y-te/khac",
    name: "Khác",
    sortOrder: 999,
    keywords: [],
  },
];

function normalizeForMatch(s: string): string {
  // Make Vietnamese title searchable: strip diacritics, keep ASCII-ish tokens.
  // Example: "bông băng" -> "bong-bang"
  const noMarks = s.normalize("NFD").replace(/\p{Diacritic}+/gu, "");
  return noMarks.toLowerCase().replace(/[^a-z0-9/_-]+/g, "-");
}

function mapLongChauToVn(json: LongChauProductJson): VnMapping {
  const categorySlug = json.category?.slug ? normalizeForMatch(json.category.slug) : "";
  const parentSlug = json.category?.parent_slug ? normalizeForMatch(json.category.parent_slug) : "";
  const title = json.title ? normalizeForMatch(json.title) : "";

  const topSlug = json.category?.slug ? topSlugFromCategoryPath(json.category.slug) : null;
  // Source data is mostly under `thuoc/*`. Promote some subtrees into other VN top-level pages.
  // Heuristic prefers slug-like fields, but also uses normalized title for device/personal-care splits.
  const haystack = `${parentSlug} ${categorySlug} ${title}`;

  const topRoute =
    // TPCN / supplements-like
    haystack.includes("thuoc/thuoc-bo-and-vitamin") ||
    haystack.includes("thuoc/thuoc-bo-and-vitamin/") ||
    haystack.includes("/thuoc-bo/") ||
    haystack.includes("/siro-bo") ||
    haystack.includes("vitamin") ||
    haystack.includes("khoang-chat") ||
    haystack.includes("omega") ||
    haystack.includes("glucosamine")
      ? "/thuc-pham-chuc-nang"
      : // Medical devices (include first-aid supplies)
        haystack.includes("khau-trang") ||
          haystack.includes("may-do") ||
          haystack.includes("do-huyet-ap") ||
          haystack.includes("do-duong-huyet") ||
          haystack.includes("que-thu") ||
          haystack.includes("test") ||
          haystack.includes("bong-bang") ||
          haystack.includes("bong") ||
          haystack.includes("bang") ||
          haystack.includes("gao") ||
          haystack.includes("so-cuu")
        ? "/thiet-bi-y-te"
        : // Personal care / OTC non-drug items
          haystack.includes("mieng-dan") ||
            haystack.includes("cao-xoa") ||
            haystack.includes("dau-gio") ||
            haystack.includes("nuoc-suc-mieng") ||
            haystack.includes("kem-danh-rang") ||
            haystack.includes("chi-nha-khoa") ||
            haystack.includes("dung-dich-ve-sinh")
          ? "/cham-soc-ca-nhan"
          : // Cosmeceuticals / skincare
            haystack.includes("duoc-my-pham") ||
              haystack.includes("cham-soc-da") ||
              haystack.includes("chong-nang") ||
              haystack.includes("tri-mun") ||
              haystack.includes("duong-am") ||
              haystack.includes("serum") ||
              haystack.includes("sua-rua-mat")
            ? "/duoc-my-pham"
            : topSlug
              ? `/${topSlug}`
              : "/thuoc";

  const buckets = VN_TAXONOMY.filter((b) => b.topRoute === topRoute);

  function matchIn(haystack: string) {
    for (const b of buckets) {
      for (const kw of b.keywords) {
        if (!kw) continue;
        if (haystack.includes(kw)) return b.childRoute;
      }
    }
    return null;
  }

  const byParent = parentSlug ? matchIn(parentSlug) : null;
  if (byParent) return { topRoute, childRoute: byParent, confidence: "high", matchedBy: "parent_slug" };

  const byCat = categorySlug ? matchIn(categorySlug) : null;
  if (byCat) return { topRoute, childRoute: byCat, confidence: "high", matchedBy: "category_slug" };

  const byTitle = title ? matchIn(title) : null;
  if (byTitle) return { topRoute, childRoute: byTitle, confidence: "medium", matchedBy: "title" };

  const fallback = `${topRoute}/khac`;
  return { topRoute, childRoute: fallback, confidence: "low", matchedBy: "fallback" };
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const dryRun = args.has("--dry-run");
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : null;
  const dataDirArg = process.argv.find((a) => a.startsWith("--dir="));
  const dataDir = dataDirArg ? dataDirArg.split("=")[1] : "supabase/longchau/products";

  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing env: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_SUPABASESERVICE_KEY;
  if (!serviceKey) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY (or SERVICE_SUPABASESERVICE_KEY)");

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const filenames = (await readdir(dataDir)).filter((f) => f.endsWith(".json"));
  const selected = limit ? filenames.slice(0, limit) : filenames;

  // Fetch existing top-level nodes (so we can attach children).
  const { data: existingTopNodes, error: topErr } = await supabase
    .from("catalog_nodes")
    .select("id,slug,route_path,parent_id")
    .is("parent_id", null);
  if (topErr) throw topErr;

  const topBySlug = new Map<string, { id: string; slug: string; route_path: string }>();
  for (const n of existingTopNodes ?? []) {
    if (typeof n?.slug !== "string" || typeof n?.id !== "string" || typeof n?.route_path !== "string") continue;
    topBySlug.set(n.slug, { id: n.id, slug: n.slug, route_path: n.route_path });
  }

  const nodesToUpsert = new Map<string, CatalogNodeUpsert>(); // key route_path
  const productsToUpsert = new Map<string, CatalogProductUpsert>(); // key slug
  const productPrimaryNodeRoute = new Map<string, string>(); // productSlug -> node route_path
  const productTopNodeRoute = new Map<string, string>(); // productSlug -> top node route_path
  const tagsToUpsert = new Map<string, TagUpsert>(); // key tag slug
  const productTagSlugs = new Map<string, Set<string>>(); // productSlug -> tagSlugs

  const report = {
    totalFiles: selected.length,
    importedProducts: 0,
    mappingCounts: {} as Record<string, number>,
    lowConfidence: [] as Array<{
      slug: string;
      title: string;
      parent_slug: string | null;
      category_slug: string | null;
      mapped: string;
      confidence: MappingConfidence;
      matchedBy: string;
    }>,
  };

  // Seed taxonomy nodes (top + children) into nodesToUpsert.
  for (const top of ["/thuoc", "/thuc-pham-chuc-nang", "/duoc-my-pham", "/cham-soc-ca-nhan", "/thiet-bi-y-te"]) {
    const slug = top.replace(/^\//, "");
    if (!topBySlug.has(slug)) {
      nodesToUpsert.set(top, {
        node_type: "category_top",
        parent_id: null,
        name: slugToTitle(slug),
        slug,
        full_slug: slug,
        route_path: top,
        description: null,
        nav_description: null,
        sort_order: 0,
        is_active: true,
        is_visible_in_nav: true,
      });
    }
  }
  for (const b of VN_TAXONOMY) {
    const topSlug = b.topRoute.replace(/^\//, "");
    const childSlug = b.childRoute.split("/").pop() ?? "khac";
    nodesToUpsert.set(b.childRoute, {
      node_type: "category_child",
      parent_id: topBySlug.get(topSlug)?.id ?? null, // fixed after top upsert
      name: b.name,
      slug: childSlug,
      full_slug: `${topSlug}/${childSlug}`,
      route_path: b.childRoute,
      description: null,
      nav_description: null,
      sort_order: b.sortOrder,
      is_active: true,
      is_visible_in_nav: true,
    });
  }

  for (const filename of selected) {
    const raw = await readFile(join(dataDir, filename), "utf8");
    const json = JSON.parse(raw) as LongChauProductJson;

    const productSlug = fileSlugToProductSlug(json.slug);
    if (!productSlug) continue;

    // Basic filtering: require title + price or image.
    if (!json.title) continue;

    const mapping = mapLongChauToVn(json);
    const nodeRoute = mapping.childRoute;

    const shortDesc =
      typeof json.short_description === "string" && json.short_description.trim().length
        ? stripHtml(json.short_description)
        : null;
    const longDesc =
      typeof json.usage_html === "string" && json.usage_html.trim().length
        ? stripHtml(json.usage_html)
        : typeof json.description_html === "string" && json.description_html.trim().length
          ? stripHtml(json.description_html)
          : shortDesc;

    const isNewProductSlug = !productsToUpsert.has(productSlug);
    productsToUpsert.set(productSlug, {
      name: json.title,
      slug: productSlug,
      route_path: `/san-pham/${productSlug}`,
      short_description: shortDesc,
      description: longDesc,
      brand_name: json.brand?.name ?? null,
      sku: json.id ?? null,
      thumbnail_url: json.image_url ?? null,
      gallery: Array.isArray(json.images) ? json.images : null,
      price: typeof json.price_amount === "number" ? json.price_amount : null,
      compare_at_price: typeof json.compare_at_amount === "number" && json.compare_at_amount > 0 ? json.compare_at_amount : null,
      is_active: true,
      is_featured: false,
      seo_title: null,
      seo_description: null,
    });

    productPrimaryNodeRoute.set(productSlug, nodeRoute);
    productTopNodeRoute.set(productSlug, mapping.topRoute);

    if (isNewProductSlug) {
      report.importedProducts += 1;
      report.mappingCounts[nodeRoute] = (report.mappingCounts[nodeRoute] ?? 0) + 1;
      if (mapping.confidence !== "high") {
        report.lowConfidence.push({
          slug: productSlug,
          title: json.title,
          parent_slug: json.category?.parent_slug ?? null,
          category_slug: json.category?.slug ?? null,
          mapped: nodeRoute,
          confidence: mapping.confidence,
          matchedBy: mapping.matchedBy,
        });
      }
    }

    // Tags: benefit_tag[] + format_tag
    const tagSet = productTagSlugs.get(productSlug) ?? new Set<string>();
    if (Array.isArray(json.benefit_tag)) {
      for (const t of json.benefit_tag) {
        if (!t || typeof t !== "string") continue;
        const slug = t
          .toLowerCase()
          .trim()
          .replace(/[^\p{L}\p{N}]+/gu, "-")
          .replace(/^-+|-+$/g, "");
        if (!slug) continue;
        tagsToUpsert.set(`benefit:${slug}`, { name: t.trim(), slug, tag_type: "benefit", description: null, is_active: true });
        tagSet.add(`benefit:${slug}`);
      }
    }
    if (json.format_tag && typeof json.format_tag === "string") {
      const rawT = json.format_tag.trim();
      const slug = rawT
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "");
      if (slug) {
        tagsToUpsert.set(`format:${slug}`, { name: rawT, slug, tag_type: "format", description: null, is_active: true });
        tagSet.add(`format:${slug}`);
      }
    }
    if (tagSet.size) productTagSlugs.set(productSlug, tagSet);
  }

  console.log(
    JSON.stringify(
      {
        dryRun,
        files: selected.length,
        products: productsToUpsert.size,
        nodes: nodesToUpsert.size,
        tags: tagsToUpsert.size,
      },
      null,
      2
    )
  );

  if (dryRun) return;

  await mkdir("scripts/out", { recursive: true });

  // 1) Upsert missing top nodes first.
  const topNodes = Array.from(nodesToUpsert.values()).filter((n) => n.node_type === "category_top");
  if (topNodes.length) {
    for (const batch of chunk(topNodes, 200)) {
      const { error } = await supabase.from("catalog_nodes").upsert(batch, { onConflict: "route_path" });
      if (error) throw error;
    }
  }

  // Refresh top node ids.
  const { data: refreshedTopNodes, error: topErr2 } = await supabase
    .from("catalog_nodes")
    .select("id,slug,route_path,parent_id")
    .is("parent_id", null);
  if (topErr2) throw topErr2;
  topBySlug.clear();
  for (const n of refreshedTopNodes ?? []) {
    if (typeof n?.slug !== "string" || typeof n?.id !== "string" || typeof n?.route_path !== "string") continue;
    topBySlug.set(n.slug, { id: n.id, slug: n.slug, route_path: n.route_path });
  }

  // 2) Upsert child nodes with correct parent_id.
  const childNodes = Array.from(nodesToUpsert.values())
    .filter((n) => n.node_type === "category_child")
    .map((n) => {
      const topSlug = n.full_slug.split("/")[0];
      return { ...n, parent_id: topBySlug.get(topSlug)?.id ?? null };
    })
    .filter((n) => n.parent_id);
  if (childNodes.length) {
    for (const batch of chunk(childNodes, 200)) {
      const { error } = await supabase.from("catalog_nodes").upsert(batch, { onConflict: "route_path" });
      if (error) throw error;
    }
  }

  // 3) Upsert products.
  const productRows = Array.from(productsToUpsert.values());
  for (const batch of chunk(productRows, 200)) {
    const { error } = await supabase.from("catalog_products").upsert(batch, { onConflict: "slug" });
    if (error) throw error;
  }

  // Fetch product ids for linking.
  const productSlugs = Array.from(productsToUpsert.keys());
  const slugBatches = chunk(productSlugs, 200);
  const productIdBySlug = new Map<string, string>();
  for (const b of slugBatches) {
    const { data, error } = await supabase.from("catalog_products").select("id,slug").in("slug", b);
    if (error) throw error;
    for (const row of data ?? []) {
      if (typeof row.slug === "string" && typeof row.id === "string") productIdBySlug.set(row.slug, row.id);
    }
  }

  // Fetch node ids for linking (route_path -> id).
  const nodeRoutes = new Set(productPrimaryNodeRoute.values());
  for (const r of productTopNodeRoute.values()) nodeRoutes.add(r);
  const routeBatches = chunk(Array.from(nodeRoutes), 200);
  const nodeIdByRoute = new Map<string, string>();
  for (const b of routeBatches) {
    const { data, error } = await supabase.from("catalog_nodes").select("id,route_path").in("route_path", b);
    if (error) throw error;
    for (const row of data ?? []) {
      if (typeof row.route_path === "string" && typeof row.id === "string") nodeIdByRoute.set(row.route_path, row.id);
    }
  }

  // Ensure reruns don't violate "one primary per product".
  // We clear existing primary links for the imported products, then re-insert the desired primary link.
  const productIds = Array.from(productIdBySlug.values());
  for (const batch of chunk(productIds, 50)) {
    const { error } = await supabase.from("product_node_links").delete().in("product_id", batch).eq("is_primary", true);
    if (error) throw error;
  }

  // 4) Upsert product_node_links (primary).
  const links: Array<{ product_id: string; node_id: string; is_primary: boolean; sort_order: number }> = [];
  for (const [pSlug, route] of productPrimaryNodeRoute.entries()) {
    const pid = productIdBySlug.get(pSlug);
    const nid = nodeIdByRoute.get(route);
    if (!pid || !nid) continue;
    links.push({ product_id: pid, node_id: nid, is_primary: true, sort_order: 0 });
  }

  // Secondary link to top node for aggregated top-level pages.
  for (const [pSlug, topRoute] of productTopNodeRoute.entries()) {
    const pid = productIdBySlug.get(pSlug);
    const nid = nodeIdByRoute.get(topRoute);
    if (!pid || !nid) continue;
    links.push({ product_id: pid, node_id: nid, is_primary: false, sort_order: 0 });
  }
  for (const batch of chunk(links, 500)) {
    const { error } = await supabase.from("product_node_links").upsert(batch, { onConflict: "product_id,node_id" });
    if (error) throw error;
  }

  // 5) Tags + links (optional but enabled).
  const tagRows = Array.from(tagsToUpsert.values());
  if (tagRows.length) {
    for (const batch of chunk(tagRows, 500)) {
      const { error } = await supabase.from("tags").upsert(batch, { onConflict: "slug" });
      if (error) throw error;
    }

    // Fetch tag ids by slug+type (type not in unique currently) -> approximate by slug only.
    const tagSlugSet = new Set(tagRows.map((t) => t.slug));
    const tagSlugBatches = chunk(Array.from(tagSlugSet), 200);
    const tagIdBySlug = new Map<string, string>();
    for (const b of tagSlugBatches) {
      const { data, error } = await supabase.from("tags").select("id,slug").in("slug", b);
      if (error) throw error;
      for (const row of data ?? []) {
        if (typeof row.slug === "string" && typeof row.id === "string") tagIdBySlug.set(row.slug, row.id);
      }
    }

    const ptl: Array<{ product_id: string; tag_id: string }> = [];
    for (const [pSlug, keyedTagSlugs] of productTagSlugs.entries()) {
      const pid = productIdBySlug.get(pSlug);
      if (!pid) continue;
      for (const key of keyedTagSlugs) {
        const bareSlug = key.split(":")[1] ?? "";
        const tid = tagIdBySlug.get(bareSlug);
        if (!tid) continue;
        ptl.push({ product_id: pid, tag_id: tid });
      }
    }
    for (const batch of chunk(ptl, 1000)) {
      const { error } = await supabase.from("product_tag_links").upsert(batch, { onConflict: "product_id,tag_id" });
      if (error) throw error;
    }
  }

  console.log(
    JSON.stringify(
      {
        imported: {
          products: productRows.length,
          nodes: nodesToUpsert.size,
          links: links.length,
          tags: tagRows.length,
        },
      },
      null,
      2
    )
  );

  // Report
  report.lowConfidence = report.lowConfidence.slice(0, 500);
  await writeFile("scripts/out/mapping-report.json", JSON.stringify(report, null, 2), "utf8");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

