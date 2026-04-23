# Phase 5: Postgres RPC: get_header_navigation/get_node_page_by_path/get_product_page_by_slug/search - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (no questions)

<domain>
## Phase Boundary

Implement Postgres functions callable via Supabase `rpc()` that return JSON already-shaped for the frontend, so frontend does not build trees or stitch data manually.

</domain>

<decisions>
## Implementation Decisions

- RPC returns JSON with stable keys:
  - header navigation: `items[]` with `children`, `featuredProducts`, `featuredLinks`
  - node page: node info + breadcrumb + child nodes + product preview + featured links + SEO
  - product page: product + primary node + tags + related products
  - search: matched products + matched nodes + matched tags
- Node resolution by `route_path` (not by slug segments in frontend).

</decisions>

<code_context>
## Existing Code Insights

Frontend pages exist but currently rely on mock/derived data; RPC becomes the single data contract.

</code_context>

<specifics>
## Specific Ideas

- Keep dropdown lists limited: children + featuredProducts (<=4) + featuredLinks.

</specifics>

<deferred>
## Deferred Ideas

- Advanced ranking/recommendation for related/search.

</deferred>
