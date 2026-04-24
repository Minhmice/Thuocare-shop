# Category taxonomy + listing + navigation scan (code-grounded)

Updated: 2026-04-24

Scope: how category taxonomy, listing pages, navigation depth currently work in Next App Router under `src/app`, with Supabase RPC contracts in `src/data/*`, and header/mega menu code in `src/components/*`.

## Canonical category listing routes (current)

App Router uses **2-level** dynamic routes for category exploration:

- `src/app/[topLevel]/page.tsx` → `/${topLevel}`
  - Loads node page + children list via `getNodePageByPath(routePath)`
  - Loads products via `getNodeProductsByPath({ routePath, page, pageSize, sort })`
  - Renders children as chips linking to `child.routePath` (plain `<a href>`)
  - Pagination uses query params `page`, `pageSize`, `sort` with `next/link`

- `src/app/[topLevel]/[child]/page.tsx` → `/${topLevel}/${child}`
  - Same query params (`page`, `pageSize`, `sort`) and same RPC fetches
  - Renders breadcrumb from `data.breadcrumb` (plain `<a href>`)
  - Does **not** render child chips in UI (no “go deeper” UI from this page)

No catch-all routes (no `[...slug]`) under `src/app` at time of scan; so UI cannot navigate to `/${topLevel}/${child}/${grandchild}` even if taxonomy supports it.

## Taxonomy source of truth (current)

Frontend treats taxonomy as **routePath-first** and **DB-driven**:

- `src/data/catalog.ts`
  - `getNodePageByPath(routePath)` calls Supabase RPC `"get_node_page_by_path"` and expects JSON shaped as:
    - `node` (includes `routePath`, `slug`, `name`, hero/seo fields)
    - `breadcrumb[]` items with `routePath`
    - `children[]` items with `routePath`
  - `getNodeProductsByPath({ routePath, page, pageSize, sort })` calls `"get_node_products_by_path"`

Taxonomy depth not defined in frontend code. Depth likely comes from DB graph, but router currently only supports 1 or 2 URL segments.

## Breadcrumb behavior (current)

Two breadcrumb implementations exist:

- Listing child route (`src/app/[topLevel]/[child]/page.tsx`) renders breadcrumb directly from RPC `data.breadcrumb`, as plain anchors.
- Shared component `src/components/shared/breadcrumbs.tsx` used by other pages/components (e.g. `src/components/catalog/product-detail/product-detail.tsx`, `src/components/catalog/listing/category-listing.tsx`). It expects caller-provided `items`.

No single global breadcrumb component wired to category routes; category listing breadcrumb depends on which route page you are on.

## Nav / mega menu (current)

Header uses RPC nav when available, otherwise static mega config.

- `src/components/layout/header.server.tsx` calls `getHeaderNav()` from `src/data/nav.ts`
- `src/data/nav.ts`
  - Attempts Supabase RPC `"get_header_navigation"` returning `{ items: [{ id, name, routePath }] }`
  - Maps items to `NavTopItem` with `href=routePath` and **no mega blocks** (so RPC nav yields top-level pills only)
  - Falls back to `STATIC_HEADER_NAV` from `src/components/navigation/nav.data.ts`

Static mega menu:

- `src/components/navigation/nav.data.ts` defines `STATIC_HEADER_NAV`
  - `main[]` items with `kind:"category"` and `mega.blocks[]` of `links` + `bestSellers`
  - Link URLs include examples like `/thuoc/khang-sinh`, `/thuc-pham-chuc-nang/vitamin-khoang-chat`, plus “needs” links like `/nhu-cau/cam-cum`
- `src/components/navigation/nav-panel.tsx` renders mega blocks.

Important mismatch: current App Router category listings are `/${topLevel}` and `/${topLevel}/${child}`. Static mega menu includes routes that may or may not exist in taxonomy DB, but router will still try to resolve them via `getNodePageByPath("/thuoc/khang-sinh")` etc.

## Listing UI richness vs current routes

Two listing paradigms exist:

1) **Server route listings** (real category routes)
   - `src/app/[topLevel]/page.tsx` and `src/app/[topLevel]/[child]/page.tsx`
   - Support: breadcrumb (child only), child chips (top-level only), pagination, sort allowlist
   - Missing: sidebar filters UI, category subnav beyond 2 levels, sort UI control (only query param)

2) **Client demo listing component** (not wired to router)
   - `src/components/catalog/listing/category-listing.tsx`
   - Has category chips, sidebar filter groups, mobile filter drawer, `SortPills`
   - Uses local React state only; no URL sync; data static (`DEFAULT_PRODUCTS`, `CATEGORY_CHIPS`)

## Search entry points (current)

Header has search input + “Tìm kiếm” button UI in `src/components/layout/header.tsx` but no submit handler and no search route found under `src/app` at scan time. Search appears UI-only placeholder unless other code (not found) wires it.

