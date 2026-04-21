```markdown
# Architecture

**Analysis Date:** 2026-04-21

## Pattern Overview

**Overall:** Next.js App Router monolith with a thin “data access” layer and Supabase as the backend.

**Key Characteristics:**
- Server Components for pages by default (`src/app/**/page.tsx`) with targeted client components (`"use client"`) for interactivity
- Data access functions live in `src/data/*.ts` and call Supabase directly via `src/lib/supabase/server.ts`
- Privileged server writes happen via Next API routes (`src/app/api/**/route.ts`) and Supabase service role key

## Layers

**Routing & Rendering (Next.js App Router):**
- Purpose: Define URLs, layouts, and server-rendered pages
- Location: `src/app/**`
- Contains: `layout.tsx`, `page.tsx`, route handlers `api/**/route.ts`
- Depends on: `src/components/**`, `src/data/**`

**UI Components:**
- Purpose: Presentational components + interactive client components
- Location: `src/components/**`
- Contains: “LongChau*” components and `src/components/ui/**` primitives
- Depends on: `src/lib/**`, `src/hooks/**`, `src/types/**`

**Data Access / Domain Functions:**
- Purpose: Fetch/transform domain data for pages; encapsulate checkout write logic
- Location: `src/data/**`
- Depends on: Supabase client factories `src/lib/supabase/server.ts`, Supabase table types `src/lib/supabase/types.ts`
- Examples:
  - Product reads: `src/data/products.ts`
  - Articles: `src/data/articles.ts`
  - Orders (server write): `src/data/orders.ts`

**Infrastructure Adapters:**
- Purpose: Provide shared utilities, DB/env configuration, local storage
- Location: `src/lib/**`
- Key files:
  - Supabase env + clients: `src/lib/supabase/server.ts`
  - Supabase table types: `src/lib/supabase/types.ts`
  - Local cart persistence: `src/lib/local-db.ts`
  - CSS class helper: `src/lib/utils.ts`

**Database Schema (Supabase):**
- Purpose: Define Postgres tables, indexes, RLS policies
- Location: `supabase/migrations/*.sql`
- Seed data: `supabase/seed.sql` and `scripts/seed-supabase.ts`

## Data Flow

**Product detail page (`/product/[slug]`):**
1. Route: `src/app/product/[slug]/page.tsx`
2. Fetch: `getProductBySlug(slug)` in `src/data/products.ts`
3. Client creation: `createSupabaseAnonServerClient()` in `src/lib/supabase/server.ts`
4. Queries: `products`, `product_images`, then related products
5. Render: `LongChauProductDetailView` (`src/components/longchau-product-detail.tsx`)

**Checkout (local cart + server order creation):**
1. Client cart stored in localStorage (`src/lib/local-db.ts`)
2. UI submits: `src/components/checkout-form.tsx` -> `fetch("/api/orders")`
3. API route: `src/app/api/orders/route.ts`
4. Server write: `createOrderFromLocalCart()` in `src/data/orders.ts` using service role client (`src/lib/supabase/server.ts`)
5. DB tables: `orders`, `order_items` (`supabase/migrations/0005_init_orders.sql`)

**State Management:**
- Client-only state via React state/hooks; persistent cart in localStorage (`src/hooks/use-local-storage.ts`, `src/lib/local-db.ts`)
- No global state library detected

## Entry Points

**Web app:**
- Layout: `src/app/layout.tsx`
- Home page: `src/app/page.tsx`

**API:**
- Orders endpoint: `src/app/api/orders/route.ts` (POST)

**Data import/seed:**
- Seed: `scripts/seed-supabase.ts`
- Import scraped products: `scripts/import-longchau-products.ts`
- Scrape upstream site: `scripts/longchau_scrape_products.py`

## Error Handling

**Strategy:** Throw on data-layer errors; API routes convert to JSON errors.

**Patterns:**
- Supabase errors are thrown directly (`src/data/products.ts`, `src/data/articles.ts`, `src/data/orders.ts`)
- API route catches and returns `{ ok: false, error }` with `400` (`src/app/api/orders/route.ts`)

## Cross-Cutting Concerns

**Logging:** Minimal (`console.*` in scripts)
**Validation:** Lightweight runtime checks in data functions (e.g., phone normalization/length in `src/data/orders.ts`)
**Authentication:** None for users; server privilege via `SUPABASE_SERVICE_ROLE_KEY` only (`src/lib/supabase/server.ts`)

---

*Architecture analysis: 2026-04-21*
```
