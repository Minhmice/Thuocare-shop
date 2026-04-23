# Phase 7: Frontend refactor: VN routes + data fetching via RPC - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Mode:** Auto-generated (no questions)

<domain>
## Phase Boundary

Migrate Next.js App Router routes to VN canonical paths and switch data fetching to Supabase RPC contracts for header/nav, category pages, product detail, and content pages.

</domain>

<decisions>
## Implementation Decisions

- VN category routes:
  - `/${topLevel}`
  - `/${topLevel}/${child}`
- Product route: `/san-pham/${slug}`
- Content route: `/goc-suc-khoe/${slug}`
- Header/category pages consume RPC; remove hardcoded nav data.

</decisions>

<code_context>
## Existing Code Insights

Repo already contains multiple App Router pages and navigation components to refactor (header/nav panel, category/list/product/blog pages).

</code_context>

<specifics>
## Specific Ideas

- Avoid breaking canonical product route while category routes migrate.

</specifics>

<deferred>
## Deferred Ideas

- Complex faceted filters UI (can be later).

</deferred>
