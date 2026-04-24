1. ROUTE STRUCTURE
- top-level routes
  - **Dynamic listing (category)**: `src/app/[topLevel]/page.tsx` handles `/${topLevel}`.
    - Builds `routePath` as `/${topLevel}` then calls:
      - `getNodePageByPath(routePath)` for node metadata + children.
      - `getNodeProductsByPath({ routePath, page, pageSize, sort })` for products.
    - Renders “Danh mục” child links from `data.children` as `<a href={c.routePath}>…</a>` (plain anchor).
  - **Home**: `src/app/page.tsx` (not category listing; marketing + featured products).
  - **Product detail**: `src/app/san-pham/[slug]/page.tsx` handles `/san-pham/${slug}`.
  - **Content/service**: `src/app/goc-suc-khoe/page.tsx`, `src/app/goc-suc-khoe/[slug]/page.tsx`, `src/app/tiem-chung/page.tsx`, `src/app/tra-cuu-don/page.tsx`, `src/app/he-thong-nha-thuoc/page.tsx`, `src/app/ho-tro/page.tsx`.

- child routes
  - **Dynamic child listing (category)**: `src/app/[topLevel]/[child]/page.tsx` handles `/${topLevel}/${child}`.
    - Builds `routePath` as `/${topLevel}/${child}` and calls same RPC-backed functions as top-level.
    - Renders breadcrumb UI from `data.breadcrumb` (plain anchor links).
    - Does **not** render the “children chips” block (no `data.children` usage here).

- dynamic route params
  - `[topLevel]` and `[child]` are URL segments. No slug normalization in route layer; segment value becomes string interpolation in `routePath`.
  - Listing pages parse only query params:
    - `page`, `pageSize`, `sort` from `searchParams` in both `src/app/[topLevel]/page.tsx` and `src/app/[topLevel]/[child]/page.tsx`.
  - Product route param: `[slug]` in `src/app/san-pham/[slug]/page.tsx`.

- route patterns for listing pages
  - **Listing**:
    - `/${topLevel}?page=&pageSize=&sort=`
    - `/${topLevel}/${child}?page=&pageSize=&sort=`
  - **No deeper category routing**:
    - No catch-all route present (`[...slug]` / `[[...slug]]` not found under `src/app/`).
    - Implication: even if taxonomy exists deeper in data, UI can only route up to 2 segments via App Router today.


2. TAXONOMY MODEL
- levels of category depth found in code
  - **Frontend routing depth**: effectively **2 levels** (`[topLevel]` + optional `[child]`).
  - **Data model depth** (Supabase): **supports multi-level** via `catalog_nodes.parent_id`:
    - Breadcrumb builder in `supabase/migrations/0009_catalog_rpc.sql` walks parents up to **8** steps (`while ... steps < 8`).
    - Node page returns direct `children[]` only (one level).
    - Product listing scope includes node + its direct children (one descendant level) in `supabase/migrations/0013_node_products_paging.sql`.
  - Net: **DB can be 3+ levels, but Next routes only implement 2-level URLs**.

- naming and path conventions
  - Node resolution is **route-path-first**:
    - `get_node_page_by_path(p_route_path text)` resolves node by exact `catalog_nodes.route_path`.
    - Frontend listing routes construct `routePath` from URL segments and pass to RPC.
  - Node fields exposed to frontend via RPC include `id`, `name`, `slug`, `routePath`, plus hero/SEO fields.

- how categories / nodes / children are represented
  - Frontend data contract (`src/data/catalog.ts`):
    - `CatalogNodePage` shape:
      - `node`: `{ id, name, slug, routePath, description, heroTitle, heroDescription, seoTitle, seoDescription }`
      - `breadcrumb`: array of `{ id, name, routePath }`
      - `children`: array of `{ id, name, slug, routePath }`
      - `featuredLinks`: array of `{ id, type, label, description, href }`
      - `productPreview`: array of product summaries (id/name/slug/routePath/thumbnailUrl/price)
  - Supabase RPC backing:
    - `get_header_navigation()` in `supabase/migrations/0009_catalog_rpc.sql` returns top nodes with:
      - `children` (direct children only)
      - `featuredLinks`
      - `featuredProducts`
    - `get_node_page_by_path()` returns:
      - `breadcrumb` built by walking parent chain
      - `children` direct children of current node
      - `productPreview` and `featuredLinks`

- whether categories are route-first or UI-first
  - **Route-first** in data model:
    - Node identity for page fetch is `route_path`.
    - Frontend pages do not fetch by slug segments; they fetch by constructed `routePath`.
  - **UI navigation currently mixed**:
    - Header can be:
      - **Static UI-first mega menu** via `src/components/navigation/nav.data.ts` (hardcoded categories + mega blocks).
      - Or **Supabase route-first** minimal nav via `src/data/nav.ts` → `get_header_navigation()` mapped to top-level links only (no mega blocks).


3. LISTING ENTRY FLOW
Describe what happens when a user:

- clicks a top-level category
  - Header nav click goes to `item.href`.
  - Two possible nav sources:
    - **Supabase nav** (`src/data/nav.ts`): items are top-level nodes only; click leads to `/${topLevel}` route (`src/app/[topLevel]/page.tsx`) using `routePath` from node.
    - **Static nav** (`src/components/navigation/nav.data.ts`): items include mega blocks with child links (e.g. `/thuoc/khang-sinh`), so click can lead directly to a child listing route (`src/app/[topLevel]/[child]/page.tsx`).

- lands on a top-level listing
  - `src/app/[topLevel]/page.tsx`:
    - Parses query params:
      - `page` default 1, min 1
      - `pageSize` default 24, clamp 1..96
      - `sort` allowlist: `featured | newest | price_asc | price_desc` (else `featured`)
    - Calls:
      - `getNodePageByPath("/" + topLevel)` for page header + children list.
      - `getNodeProductsByPath({ routePath, page, pageSize, sort })` for products.
    - UI:
      - Title/description from `data.node.heroTitle/heroDescription` fallback to `name/description`.
      - If `data.children.length`, shows “Danh mục” chips linking to each child `routePath`.
      - Product grid via `ProductGrid` with pagination links (prev/next) preserving query params.
    - Breadcrumb:
      - No breadcrumb rendered on this page.

- goes into a child listing
  - If user clicks child chip (top-level listing) or uses static mega links:
    - Route resolves to `src/app/[topLevel]/[child]/page.tsx`.
    - Same query parsing + product RPC call, with `routePath = /${topLevel}/${child}`.
    - Calls `getNodePageByPath(routePath)` which returns `breadcrumb[]`.
    - UI:
      - Renders breadcrumb nav at top: iterates `data.breadcrumb` and renders links to each `routePath`.
      - Renders product listing grid + pagination.
      - Does **not** render further child category chips/cards (even if `data.children` exists).

- navigates back up
  - From child listing, breadcrumb links point to parent `routePath` values from RPC.
  - Behavior depends on taxonomy:
    - Breadcrumb data can include multiple ancestors (DB supports), but only routes up to 2 segments exist in Next app.
    - If breadcrumb includes deeper paths beyond 2 segments, those links would not have matching Next routes (would 404) unless they coincidentally map to existing static routes.

- changes sort/filter/page
  - Sorting:
    - Server listing pages support only `sort` query param; no UI control present on these pages (only pagination links).
  - Filtering:
    - No filter query params or filter UI wired on `src/app/[topLevel]/*` routes.
    - Filter UI exists as separate client demo component `src/components/catalog/listing/category-listing.tsx` but not used by routes.
  - Pagination:
    - Previous/Next uses `next/link` `Link` with `page`, `pageSize`, `sort` query params.
    - Page numbers are incremental; no direct “jump to page” or “page size” control in UI.


4. EXISTING CATEGORY NAVIGATION UI
- breadcrumb
  - **Child listing breadcrumb**: inline `<nav>` in `src/app/[topLevel]/[child]/page.tsx`, driven by `data.breadcrumb` from RPC.
    - Uses `<a href>` (not `next/link`), so navigation is full reload style.
  - **Generic breadcrumb component**: `src/components/shared/breadcrumbs.tsx`.
    - Used in `src/components/catalog/listing/category-listing.tsx` (demo) and in product detail (`src/components/catalog/product-detail/product-detail.tsx`).
    - Not used by server listing routes (top-level/child listing use custom breadcrumb/no breadcrumb).

- category chips
  - **Real taxonomy chips**: top-level listing (`src/app/[topLevel]/page.tsx`) renders `data.children` as pill links.
  - **Static chips (mock)**: `src/components/catalog/listing/category-listing.tsx` defines `CATEGORY_CHIPS` array (hardcoded strings) and renders as pills with `href="#"` (non-functional).

- tabs
  - No category tabs tied to taxonomy in listing routes.
  - Product detail uses detail sections/tabs (not category exploration).

- sidebars
  - **Only in demo listing component** (`src/components/catalog/listing/category-listing.tsx`):
    - Desktop sidebar with filter groups + checkbox lists.
    - Mobile filter drawer overlay.
    - Not connected to route query params or RPC.

- subcategory cards
  - No dedicated subcategory card/grid component found for listing routes.
  - Current child discovery relies on:
    - chips on top-level listing page
    - (optional) static mega menu links

- filters/sort bars
  - **Server listing pages**: no sort UI, no filters UI, only pagination.
  - **Demo listing**: `SortPills` (`src/components/catalog/listing/sort-pills.tsx`) + filter sidebar.

- any hidden or unused components
  - `src/components/catalog/listing/category-listing.tsx` appears to be a richer listing UX mock (chips + filters + sort) but is not used by live listing routes under `src/app/[topLevel]/*`.


5. SEARCH VS CATEGORY DISCOVERY
- how important search currently is in the codebase
  - Header has prominent search input + “Tìm kiếm” button UI in `src/components/layout/header.tsx`.
  - No search route/page found under `src/app/` (`*search*` and `*tim-kiem*` not present).
  - No frontend data function calling Supabase search RPC found in `src/` (no `rpc("search_products_and_nodes")` usage).

- whether search is integrated into listing entry flow
  - Not integrated:
    - Listing pages do not accept `q` or search params beyond paging/sort.
    - Header search input has no submit handler / navigation in shown code (input not wired to route or RPC).

- whether architecture supports “search first, category second”
  - Data layer supports it at DB/RPC level:
    - `public.search_products_and_nodes(q text)` exists in `supabase/migrations/0011_catalog_rpc_more.sql` returning matched `products[]`, `nodes[]`, `tags[]`.
  - Frontend does not implement search experience yet:
    - No route, no query param contract, no autocomplete/dropdown, no results page.


6. GAPS FOR A BETTER NAV SYSTEM
- what is already sufficient
  - **Route-path-first taxonomy** with stable contracts:
    - `get_node_page_by_path(routePath)` gives node metadata + breadcrumb + direct children.
    - `get_node_products_by_path(routePath, page, pageSize, sort)` gives paginated products and includes node + its direct children products (scope includes 1-level descendants).
  - **Header nav source switch** already exists:
    - `src/data/nav.ts` prefers Supabase RPC and falls back to `STATIC_HEADER_NAV`.
  - **Mega menu UI framework exists**:
    - `Header` + `NavPanelView` can render multi-block dropdowns (links blocks + best sellers).

- what is weak
  - **Taxonomy depth mismatch**:
    - DB supports multi-level; Next routes support only 2-level category URLs (no catchall).
    - Breadcrumb can theoretically include >2 depth, but route layer cannot render those pages.
  - **Mega menu not driven by real taxonomy when Supabase nav active**:
    - `getHeaderNav()` maps Supabase items to `NavTopItem` without `mega`.
    - `Header` only opens dropdown when `item.mega` exists, so Supabase-driven nav becomes “no mega menu”.
  - **Listing exploration stops at child level**:
    - Top-level listing shows direct children.
    - Child listing shows breadcrumb but no children/subcategory navigation UI even if RPC returns `children`.
  - **Filtering/sorting UX not implemented in real listing routes**:
    - Only `sort` query param supported, but no control UI.
    - No facets/filters contract; filter UI exists but is mock/static and not wired.
  - **Mixed link behavior**:
    - Listing pages use `<a href>` for breadcrumb and child chips (full navigation), while pagination uses `next/link`.

- what is missing for a clean pharmacy-style navigation model
  - **Canonical depth + routing strategy**:
    - If real taxonomy deeper than 2, frontend needs route support beyond `/${topLevel}/${child}` or needs a different mapping strategy.
  - **Real taxonomy → mega menu mapping**:
    - Need a mapping from `get_header_navigation()` output (top node + children + featuredLinks/products) into `NavTopItem.mega` blocks (currently missing).
  - **Consistent category exploration on listing pages**:
    - Child listing should expose `children` as subcategory nav (chips/cards/sidebar) if taxonomy deeper or if there are leaf distinctions.
  - **Search implementation**:
    - Search page/route and wiring to `search_products_and_nodes` RPC.
    - Clear entry points between search and category browsing (not present today).


7. FINAL HANDOFF SUMMARY
Summarise:
- the real taxonomy structure the redesign must respect
  - Source of truth is Supabase `catalog_nodes` resolved by `route_path`:
    - Nav: `get_header_navigation()` returns top-level nodes marked `is_visible_in_nav=true`, with direct children.
    - Listing pages: `get_node_page_by_path(routePath)` returns breadcrumb chain + direct children.
  - Taxonomy depth in DB can be **3+ levels** (breadcrumb walk up to 8), but Next app currently only routes **2 category levels** (`[topLevel]` + `[child]`).

- how listing pages should work as the second layer after navbar
  - Current behavior:
    - Navbar click → `/${topLevel}` listing page.
    - That page already supports “enter top-level listing then pick child” via `children` chips.
    - Child listing (`/${topLevel}/${child}`) is product list + breadcrumb, but lacks further subcategory navigation.
  - Constraint: deeper exploration beyond child level is not routable today unless taxonomy stays 2-level or routing expands.

- what constraints the future mega menu prompt must know
  - Mega menu UI exists, but real taxonomy not currently feeding it when Supabase nav active (no `mega` data attached).
  - Real taxonomy contract already includes fields useful for mega menu:
    - `get_header_navigation()` returns `children`, `featuredLinks`, `featuredProducts`.
  - Listing data contract supports paging + limited sort only (`featured/newest/price_asc/price_desc`), no filter facets.
  - Search RPC exists (`search_products_and_nodes`) but frontend search flow is not implemented; header search input currently only UI.

