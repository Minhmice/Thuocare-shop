# Phase 2: Supabase schema v1: catalog_nodes/products/tags/link tables + indexes - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (no questions)

<domain>
## Phase Boundary

Create Supabase/Postgres relational schema (flat) matching locked architecture: `catalog_nodes` as single core tree table, plus products/tags/link tables, with correct constraints and indexes for `route_path`-based routing and RPC-friendly querying.

</domain>

<decisions>
## Implementation Decisions

### Core tree
- Single table `catalog_nodes` owns nav/category/content-hub nodes.
- `route_path` unique and canonical; `full_slug` stored (not computed in frontend).
- `parent_id` supports max 2 levels via data discipline (schema supports deeper but seed/tooling enforces).

### Products + taxonomy
- Products canonical route independent (`/san-pham/:slug`).
- Category assignment through `product_node_links` with single `is_primary=true`.

### Tags
- Tags separate (`tags` + `product_tag_links`).

### Featured
- `node_featured_links` supports `child_node` / `featured_product` / `featured_article` / `custom_link`.

</decisions>

<code_context>
## Existing Code Insights

No schema currently present in repo planning; will introduce via migrations (Supabase).

</code_context>

<specifics>
## Specific Ideas

- Index foreign keys for joins (node/product/tag link tables).
- `is_active` gates public read.

</specifics>

<deferred>
## Deferred Ideas

- Admin roles/users table (CMS later).

</deferred>
