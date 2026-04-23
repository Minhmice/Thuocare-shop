# Next.js Listing Pages (Top-level category routes)

**Analysis Date:** 2026-04-23

This doc maps the current top-level category listing routes under `src/app/[topLevel]/*`, the Supabase RPC data flow in `src/data/catalog.ts`, the listing UI components in `src/components/catalog/listing/*`, pagination query params, and product image loading behavior.

## Routes

### `src/app/[topLevel]/page.tsx`

- **Route path**: `/${topLevel}`
- **Inputs** (via `searchParams`): `page`, `pageSize`, `sort`
- **Pagination parsing**:
  - `page`: coerced to integer, min \(1\) (`Math.max(1, Number(page ?? "1") || 1)`)
  - `pageSize`: coerced to integer, clamped to \([1, 96]\), default \(24\)
- **Sort allowlist**: `"newest" | "price_asc" | "price_desc" | "featured"`; defaults to `"featured"`
- **Data fetch**:
  - `getNodePageByPath(routePath)` for node metadata + children chips
  - `getNodeProductsByPath({ routePath, page, pageSize, sort })` for paged products
- **Render**:
  - Renders child categories as `<a href={c.routePath}>…</a>` (plain anchor)
  - Renders products via `ProductGrid` with `linksById` built from RPC `routePath`
- **Pagination links**:
  - Previous/Next are `next/link` `Link` with query params `page`, `pageSize`, `sort`
  - Disables via `pointer-events-none opacity-50` when at ends

Key code: `src/app/[topLevel]/page.tsx` (page/query parsing + fetch + pager links).

### `src/app/[topLevel]/[child]/page.tsx`

- **Route path**: `/${topLevel}/${child}`
- **Inputs** (via `searchParams`): `page`, `pageSize`, `sort` (same parsing/allowlist as above)
- **Data fetch**: same pair of RPC calls as top-level route, but with child routePath.
- **Render differences**:
  - Includes breadcrumb nav from `data.breadcrumb`, rendered as `<a href={b.routePath}>…</a>` (plain anchor)
  - Does **not** render a “children categories” chip section (only listing block)
- **Pagination links**: `Link` points to `/${topLevel}/${child}?page=…&pageSize=…&sort=…`

Key code: `src/app/[topLevel]/[child]/page.tsx`.

## Data flow (Supabase RPC)

### `src/data/catalog.ts`

- **Client**: `createSupabaseAnonServerClient()` from `@/lib/supabase/server` (server-side usage).
- **RPC used by listing pages**:
  - `getNodePageByPath(routePath)`
    - Calls `supabase.rpc("get_node_page_by_path", { p_route_path: routePath })`
    - Returns `CatalogNodePage | null`
  - `getNodeProductsByPath({ routePath, page, pageSize, sort })`
    - Calls `supabase.rpc("get_node_products_by_path", { p_route_path, p_page, p_page_size, p_sort })`
    - Defaults inside function: `page=1`, `pageSize=24`, `sort="featured"`
    - Runtime validation via `isCatalogNodeProductsPage(data)` (guards shape/types for `node`, paging fields, and `items[]`)

**Listing item model** returned from RPC (`CatalogNodeProductsPage.items`) is:

- `id`, `name`, `slug`, `routePath`
- `thumbnailUrl: string | null`
- `price: number | null`

The route layer maps each item to UI `ProductCard` model via `toProductCard()` in:
- `src/app/[topLevel]/page.tsx`
- `src/app/[topLevel]/[child]/page.tsx`

Mapping detail:
- `title` ← `name`
- `imageUrl` ← `thumbnailUrl ?? undefined`
- `price.amount` ← `price ?? 0` (null prices become 0)

## Listing UI components

### `src/components/catalog/listing/product-grid.tsx`

- `ProductGrid` is a **client component** (`"use client"`).
- Props:
  - `products: ProductCardModel[]`
  - `linksById?: Record<string, string>`
- Rendering:
  - Grid layout: `grid gap-3 sm:grid-cols-2 lg:grid-cols-4`
  - For each product:
    - `href` resolved from `linksById?.[p.id]`
    - Wraps the `ProductCard` in `next/link` `Link` when `href` exists; otherwise a `<div>`
    - Passes `imagePriority={idx < 4}` so the first 4 cards request high-priority images

### `src/components/commerce/product-card/product-card.tsx`

- `ProductCard` is a **client component** and uses `next/image`.
- Image behavior (when `product.imageUrl` is present):
  - `priority={imagePriority}`
  - `fetchPriority={imagePriority ? "high" : "auto"}`
  - `loading={imagePriority ? "eager" : "lazy"}`
  - `sizes={variant === "compact" ? "220px" : "240px"}`
  - `width={320}` / `height={320}`; class `object-contain p-2`
  - **Optimization escape hatch**:
    - `unoptimized={product.imageUrl.includes("cdn.nhathuoclongchau.com.vn/unsafe/")}`
    - This bypasses Next.js image optimization for LongChau “unsafe” CDN URLs.

Related subcomponents used inside `ProductCard`:
- `src/components/commerce/product-card/meta-row.tsx`
- `src/components/commerce/product-card/price-stack.tsx`
- `src/components/commerce/product-card/trust-micro.tsx`

### Other listing components present (not used by `[topLevel]/*` routes)

Files exist in `src/components/catalog/listing/*` that define a richer, interactive listing experience (filters/sort UI), but the current `[topLevel]/*` server routes render directly with `ProductGrid` and do not import these components:

- `src/components/catalog/listing/category-listing.tsx` (client; sample/static listing UI with filters + `SortPills`)
- `src/components/catalog/listing/sort-pills.tsx`
- `src/components/catalog/listing/filters/filter-group.tsx`
- `src/components/catalog/listing/filters/filter-checkbox-list.tsx`

## Pagination params (current contract)

Listing pages accept these query params:
- **`page`**: 1-indexed integer, minimum 1
- **`pageSize`**: integer, clamped to 1..96 (default 24)
- **`sort`**: one of `featured | newest | price_asc | price_desc` (default featured)

The pager UI is link-based (full page navigation) and always preserves `pageSize` and `sort` in the query string.

