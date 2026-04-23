# Phase 4: Seed products + node links + tags - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (no questions)

<domain>
## Phase Boundary

Populate `products`, connect them to taxonomy via `product_node_links` (single primary), create `tags` and `product_tag_links` so listing/detail queries have real data.

</domain>

<decisions>
## Implementation Decisions

- Product canonical: `/san-pham/${slug}` stored in `products.route_path`.
- Product can belong to multiple nodes; exactly one `is_primary=true`.
- Tags independent from taxonomy; used for filtering/search/related items later.

</decisions>

<code_context>
## Existing Code Insights

Existing product pages currently use mock data; seed enables DB-driven product detail and listing.

</code_context>

<specifics>
## Specific Ideas

- Seed small “golden set” of products that hit multiple nodes + tags for testing edge cases.

</specifics>

<deferred>
## Deferred Ideas

- Full scrape/import pipeline (can be separate later).

</deferred>
