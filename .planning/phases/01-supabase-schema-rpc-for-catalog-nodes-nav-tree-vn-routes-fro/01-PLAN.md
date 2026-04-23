# Phase 1: Supabase schema+RPC for catalog_nodes nav tree; VN routes; frontend refactor - Plan

**Owner:** Claude
**Status:** Planned

## Goal

Turn the locked architecture into an executable sequence: schema → seed taxonomy → RPC → frontend route migration, with VN canonical URLs and Supabase-driven navigation.

## Non-Goals

- Cart/checkout/order domain.
- Full CMS admin panel.

## Plan

### 1) Lock route registry + slug rules in repo
- Add docs artifact: route conventions + slug rules.
- Define master mapping fields: `name`, `slug`, `full_slug`, `route_path`, `node_type`.

### 2) Implement Supabase schema v1 (relational, flat)
- Create tables:
  - `catalog_nodes`
  - `products`
  - `product_node_links`
  - `tags`
  - `product_tag_links`
  - `node_featured_links`
- Add constraints + indexes (unique on `route_path`, `full_slug`, `products.slug`, `products.route_path`).

### 3) Seed minimal taxonomy for UI
- Seed top-level + child nodes (max 2 levels).
- Fill `description` for top-level; `nav_description` for menu.
- Seed a few `node_featured_links` per top-level.

### 4) Add Postgres RPC endpoints (JSON shapes fixed)
- `get_header_navigation()`
- `get_node_page_by_path(p_route_path text)`
- `get_product_page_by_slug(p_slug text)`
- `search_products_and_nodes(q text)`

### 5) Frontend refactor to VN routes + RPC data fetching
- Create App Router pages:
  - `/(topLevel)/page.tsx`
  - `/(topLevel)/(child)/page.tsx`
  - `/san-pham/[slug]/page.tsx`
  - `/goc-suc-khoe/[slug]/page.tsx`
- Header calls `get_header_navigation()`.
- Category pages call `get_node_page_by_path()` using `route_path`.
- Product page calls `get_product_page_by_slug()`.
- Remove old hardcoded nav data usage.

## Verification

- VN category routes render and resolve correct node by `route_path`.
- Header dropdown renders children + featured links (and placeholder featured products list).
- Product page canonical `/san-pham/:slug` works and shows primary node breadcrumb.
- No client-side tree build logic remains for header/category nav.

