# Phase 1: Supabase schema+RPC for catalog_nodes nav tree; VN routes; frontend refactor - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (no questions)

<domain>
## Phase Boundary

Lock architecture for VN routes + Supabase relational core, with server-returned tree via Postgres RPC (no client-side tree building), and frontend refactor to consume RPC for header/category/product/content pages.

</domain>

<decisions>
## Implementation Decisions

### URL + Canonical
- Top-level category: `/${slug}` (Vietnamese, no diacritics)
- Subcategory: `/${parent_slug}/${slug}` (max 2 levels total)
- Product canonical: `/san-pham/${slug}`
- Content/article canonical: `/goc-suc-khoe/${slug}`

### Data Flow
- Database stores flat relational tables.
- Frontend does **not** build nav tree client-side.
- Supabase/Postgres returns tree JSON via `rpc()`.
- Header renders from Supabase RPC.
- Category pages resolve by `route_path`.

### Content Model
- Core tree: `catalog_nodes`
- Products independent from category path; categories linked via join table.
- Tags separate from tree.
- Featured links/cards driven by DB (`node_featured_links`), not hardcoded.

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- Existing Next.js App Router pages + header/nav components already present (to be refactored).

### Established Patterns
- Project already has route pages for category/list/product/blog; these will be migrated to VN canonical routes.

### Integration Points
- Header/nav components
- Category pages
- Product detail page
- Search bar (future RPC)

</code_context>

<specifics>
## Specific Ideas

- Dropdown desktop should expose 3 lists per node: `children`, `featured_products` (3–4), `featured_links`.
- Slug rules: lowercase, no diacritics, `-` only, no `_`.

</specifics>

<deferred>
## Deferred Ideas

- CMS admin UI (future) — only ensure schema/RLS/RPC keep clean extension points.

</deferred>
