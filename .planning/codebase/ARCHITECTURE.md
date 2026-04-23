# Architecture

**Analysis Date:** 2026-04-22

## Pattern Overview

**Overall:** Next.js App Router (under `src/app/`) with page-level composition, feature-based domain modules, and shared infrastructure utilities.

**Key Characteristics:**
- Routes are defined via the App Router in `src/app/**` with Server Components (`page.tsx`) and route handlers (`route.ts`).
- Pages compose UI explicitly: most `page.tsx` files render `<Header />` and `<Footer />` directly instead of a shared app shell in `src/app/layout.tsx`.
- Data access for pages lives in `src/data/**` with “Supabase if configured else mock” behavior (example: `src/data/nav.ts` falls back to `src/data/mock.ts`).
- Backend-style business logic is organized under `src/features/**` (services/repositories/schemas/types) and used by API routes under `src/app/api/**`.

## Layers

**App Router (routing + rendering):**
- Purpose: URL routing, server rendering, redirects, and API handlers.
- Location: `src/app/**`
- Contains: `layout.tsx`, route segments, `page.tsx` Server Components, `route.ts` API handlers.
- Depends on: `src/components/**`, `src/data/**`, `src/features/**`, `src/infrastructure/**`, `src/lib/**`
- Used by: Next.js runtime (`next dev`, `next build`).

**UI Components (layout/navigation/catalog/checkout):**
- Purpose: Presentational components and client interactions.
- Location: `src/components/**`
- Key areas:
  - Layout: `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`
  - Navigation UI: `src/components/navigation/nav-panel.tsx`, `src/components/navigation/nav.types.ts`
  - Page sections: `src/components/sections/*` (homepage composition in `src/app/page.tsx`)
  - Catalog/listing/detail: `src/components/catalog/**`, commerce card/rail: `src/components/commerce/**`
  - Shared UI primitives: `src/components/ui/**`
- Depends on: utilities in `src/lib/**`, types in `src/types/**`.

**Data access for pages (Supabase-backed with mock fallback):**
- Purpose: Provide server-side query functions used by `src/app/**` pages.
- Location: `src/data/**`
- Examples:
  - Homepage: `src/data/collections.ts`, `src/data/articles.ts` (used by `src/app/page.tsx`)
  - Navigation: `src/data/nav.ts` → falls back to `src/data/mock.ts` when Supabase is not configured
- Depends on: Supabase clients/types in `src/lib/supabase/*`.

**Domain features (business workflows + persistence orchestration):**
- Purpose: Validated workflows and DB operations for API routes.
- Location: `src/features/**`
- Used by: App Router API handlers like `src/app/api/orders/route.ts`.

**Infrastructure (cross-cutting helpers):**
- Purpose: Common response shape, request parsing, error mapping, logging, validation.
- Location: `src/infrastructure/**`
- Example: `src/infrastructure/http/route-handler.ts` provides `parseJson()`, `ok()`, `fail()`, `getRequestId()`.

## Routing & Navigation

**Routing implementation:** Next.js App Router rooted at `src/app/` (not a `pages/` router).

**Route tree (current):**
- `/` → `src/app/page.tsx`
- `/checkout` → `src/app/checkout/page.tsx`
- `/api/orders` (POST) → `src/app/api/orders/route.ts`
- `/product/[slug]` → `src/app/product/[slug]/page.tsx`
- `/product/sam-nhung-kidney-tonic-nv-hai-linh-30-capsules-321` → `src/app/product/sam-nhung-kidney-tonic-nv-hai-linh-30-capsules-321/page.tsx` (explicit “demo” route)
- `/category/[slug]` → `src/app/category/[slug]/page.tsx`
- `/list/[...slug]` (catch-all) → `src/app/list/[...slug]/page.tsx`
- `/supplements` → `src/app/supplements/page.tsx`
- `/supplements/mens-health` → `src/app/supplements/mens-health/page.tsx`
- `/supplements/hormones` → `src/app/supplements/hormones/page.tsx`
- `/blog/[slug]` → `src/app/blog/[slug]/page.tsx`
- `/bai-viet/[slug]` → `src/app/bai-viet/[slug]/page.tsx` (redirects to `/blog/[slug]`)
- `/p/[slug]` → `src/app/p/[slug]/page.tsx` (redirects to `/product/[slug]`)
- `/danh-muc/[slug]` → `src/app/danh-muc/[slug]/page.tsx` (redirects to `/category/[slug]`)
- `/danh-muc/[...slug]` → `src/app/danh-muc/[...slug]/page.tsx` (redirects to `/list/[...slug]`)
- `/thuc-pham-chuc-nang` → `src/app/thuc-pham-chuc-nang/page.tsx` (redirects to `/supplements`)
- `/thuc-pham-chuc-nang/sinh-ly-nam` → `src/app/thuc-pham-chuc-nang/sinh-ly-nam/page.tsx` (redirects to `/supplements/mens-health`)
- `/thuc-pham-chuc-nang/sinh-ly-noi-tiet-to` → `src/app/thuc-pham-chuc-nang/sinh-ly-noi-tiet-to/page.tsx` (redirects to `/supplements/hormones`)
- `/thuc-pham-chuc-nang/sam-nhung-bo-than-nv-hai-linh-30v-321` → `src/app/thuc-pham-chuc-nang/sam-nhung-bo-than-nv-hai-linh-30v-321/page.tsx` (redirects to `/product/...`)

**Navigation sources (menus + hrefs):**
- Header renders the top nav bar in `src/components/layout/header.tsx` and defaults to `TOP_NAV` from `src/components/navigation/nav.data.ts`.
- Supabase-backed nav is implemented in `src/data/nav.ts` (`getTopNav()` reads `nav_top_items`, `nav_sidebar_items`, `nav_tiles`, `nav_best_sellers` and falls back to `src/data/mock.ts` / category-derived nav). No app-level wiring is present that passes `getTopNav()` into `<Header nav={...} />`.
- “Quick access” links on the homepage are hardcoded in `src/components/sections/quick-actions.tsx` and point at slugs like `/supplements`, `/thuc-pham-chuc-nang/...`, and `/checkout`.
- Breadcrumb links are composed per-view in client components (example: `src/components/catalog/listing/category-listing.tsx` uses `src/components/shared/breadcrumbs.tsx` with `href: "/"` and `href: "/supplements"`).

## Data Flow

**Homepage server render (`/`):**
1. `src/app/page.tsx` loads collections/articles via `src/data/collections.ts` and `src/data/articles.ts`.
2. Homepage composes UI sections + layout components (`src/components/layout/header.tsx`, `src/components/layout/footer.tsx`, `src/components/sections/*`).

**Checkout order creation (`POST /api/orders`):**
1. `src/app/api/orders/route.ts` parses JSON via `parseJson()` from `src/infrastructure/http/route-handler.ts`.
2. It calls `createCheckoutOrder()` in `src/features/checkout/services/create-checkout-order.ts`.
3. Handler responds with `ok()` or `fail()` (standard API envelope) from `src/infrastructure/http/route-handler.ts`.

**State Management:**
- Client-side state: LocalStorage-backed “local DB” in `src/lib/local-db.ts` and hooks like `src/hooks/use-local-storage.ts`.
- Server-side state: loaded per-request in Server Components and `src/data/**`; no global server state container is present.

## Key Abstractions

**Redirect routes for legacy slugs:**
- Purpose: Preserve alternate/legacy Vietnamese paths and short URLs while routing to canonical pages.
- Examples:
  - `src/app/p/[slug]/page.tsx` → `/product/[slug]`
  - `src/app/bai-viet/[slug]/page.tsx` → `/blog/[slug]`
  - `src/app/danh-muc/[slug]/page.tsx` → `/category/[slug]`
  - `src/app/danh-muc/[...slug]/page.tsx` → `/list/[...slug]`
  - `src/app/thuc-pham-chuc-nang/*` → `/supplements/*` or `/product/*`

**API route handler helpers:**
- Purpose: Standardize JSON parsing, request id, and response envelope.
- Location: `src/infrastructure/http/route-handler.ts`
- Pattern: `ok()` returns `{ ok: true, ... }`; `fail()` returns `{ ok: false, code, message, error, fieldErrors? }`.

## Entry Points

**Web app root:**
- Location: `src/app/layout.tsx`
- Responsibilities: global CSS import (`src/app/globals.css`), font setup, metadata wrapper.

**Pages:**
- Location: `src/app/**/page.tsx`
- Responsibilities: Fetch server data (if needed) and compose layout/sections; most pages render `<Header />` and `<Footer />` directly.

**API endpoints:**
- Location: `src/app/api/**/route.ts`
- Example: `src/app/api/orders/route.ts` handles `POST /api/orders`.

## Error Handling

**Strategy:** Throw/return typed errors for expected failures; map unknown errors to a standard API response envelope.

**Patterns:**
- API handlers use `fail()` from `src/infrastructure/http/route-handler.ts` to map errors into `{ ok: false, ... }` responses.

## Cross-Cutting Concerns

**Logging:** `src/infrastructure/logging/logger.ts` (used in `src/infrastructure/http/route-handler.ts` for unexpected API errors)  
**Validation:** `src/infrastructure/validation/api-error.ts` + Zod helpers in `src/infrastructure/validation/zod.ts`  
**Authentication:** Not detected at the routing layer (no auth middleware/providers in `src/app/layout.tsx` / route-level wrappers)

---

*Architecture analysis: 2026-04-22*

