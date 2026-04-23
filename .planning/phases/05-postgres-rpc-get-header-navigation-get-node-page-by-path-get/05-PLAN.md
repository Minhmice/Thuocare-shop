# Phase 5: Postgres RPC: get_header_navigation/get_node_page_by_path/get_product_page_by_slug/search - Plan

**Owner:** Claude
**Status:** Planned

## Goal

Expose stable RPC contracts for header/category/product/search, returning ready-to-render JSON.

## Plan

### 1) `get_header_navigation()`
- Query visible top-level nodes (`is_active` + `is_visible_in_nav`).
- For each:
  - attach direct children (sorted)
  - attach featured products (via `node_featured_links` + product join)
  - attach featured links (custom + target nodes)
- Return `{ items: [...] }`.

### 2) `get_node_page_by_path(p_route_path text)`
- Resolve node by `route_path`.
- Build breadcrumb chain (parent pointers).
- Return:
  - `node`
  - `breadcrumb[]`
  - `children[]`
  - `featuredLinks[]`
  - `productPreview[]` (small page-friendly slice)
  - `seo` fields

### 3) `get_product_page_by_slug(p_slug text)`
- Resolve product by slug (active only).
- Find primary node via `product_node_links.is_primary`.
- Fetch product tags.
- Fetch related products (same primary node or shared tags; limit small).

### 4) `search_products_and_nodes(q text)`
- Basic ILIKE search over:
  - `products.name`
  - `catalog_nodes.name`
  - `tags.name`
- Return grouped arrays with minimal fields needed for search dropdown.

## Verification

- All functions callable via Supabase `rpc()`.
- JSON keys match frontend expectations (no client-side tree build).
- Functions enforce `is_active=true` for public reads (security phase later tightens with RLS).

