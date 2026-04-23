# Phase 7: Frontend refactor: VN routes + data fetching via RPC - Plan

**Owner:** Claude
**Status:** Planned

## Goal

Frontend runs fully on Supabase-powered VN routes, with navigation and pages driven by RPC responses.

## Plan

### 1) Add new VN routes (App Router)
- Implement:
  - `src/app/[topLevel]/page.tsx`
  - `src/app/[topLevel]/[child]/page.tsx`
  - `src/app/san-pham/[slug]/page.tsx`
  - `src/app/goc-suc-khoe/[slug]/page.tsx`
- Keep old routes temporarily if needed for migration, but stop linking to them.

### 2) Supabase client + RPC wrappers
- Create typed wrappers for `rpc()` calls and response parsing.
- Ensure server-side fetching for header/page rendering.

### 3) Refactor header/nav
- Replace `nav.data.ts`/mock-driven tree with `get_header_navigation()`.
- Render 3 lists: children, featuredProducts (limit), featuredLinks.

### 4) Refactor category pages
- Resolve node via `route_path` built from params.
- Use `get_node_page_by_path()` for breadcrumb + children + product preview.

### 5) Refactor product page
- Use `get_product_page_by_slug()`.
- Show primary node + tags + related.

### 6) Content pages
- Keep content minimal placeholder until CMS; route canonical maintained.

## Verification

- Header renders from DB in dev.
- Visiting `/${topLevel}` and `/${topLevel}/${child}` renders correct node + breadcrumb.
- Product canonical `/san-pham/:slug` works.
- No runtime dependency on hardcoded nav constants for main flows.

