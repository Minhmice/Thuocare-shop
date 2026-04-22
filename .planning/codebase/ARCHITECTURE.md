# Architecture

**Analysis Date:** 2026-04-21

## Pattern Overview

**Overall:** Next.js App Router + feature-based domain modules + thin infrastructure utilities.

**Key Characteristics:**
- Server Components for pages and data fetching (async `page.tsx` in `src/app/**`)
- Domain organization under `src/features/*` (schemas/types/services/repositories)
- Shared “infrastructure” utilities for HTTP handlers, validation, and logging in `src/infrastructure/*`

## Layers

**App Router (routing + rendering):**
- Purpose: Page routing, layouts, and API route handlers.
- Location: `src/app/**`
- Contains: `layout.tsx`, `page.tsx`, and route handlers like `route.ts`
- Depends on: `src/components/**`, `src/data/**`, `src/features/**`, `src/infrastructure/**`
- Used by: Next.js runtime (`next dev`, `next build`)

**UI Components:**
- Purpose: Presentational and interaction components (catalog, checkout, layout, navigation, shared UI).
- Location: `src/components/**`
- Contains: shadcn-style components under `src/components/ui/**` and feature-oriented composites under:
  - `src/components/catalog/**`
  - `src/components/checkout/**`
  - `src/components/layout/**`
  - `src/components/navigation/**`
  - `src/components/sections/**`
- Depends on: `src/lib/**`, `src/types/**`, Tailwind globals `src/app/globals.css`
- Used by: pages in `src/app/**`

**Data Access (page-oriented queries with mock fallback):**
- Purpose: Fetch data needed by server components with a “Supabase if configured else mock” strategy.
- Location: `src/data/*.ts`
- Contains:
  - Supabase-backed query functions (e.g. `src/data/products.ts`, `src/data/collections.ts`, `src/data/articles.ts`, `src/data/nav.ts`)
  - Mock data in `src/data/mock.ts` (used when Supabase env is missing)
- Depends on: `src/lib/supabase/server.ts`, `src/lib/supabase/types.ts`
- Used by: App pages (e.g. `src/app/page.tsx` imports `getHomepageCollections` and `getFeaturedArticle`)

**Domain Features (business logic):**
- Purpose: Validated business workflows and persistence orchestration.
- Location: `src/features/**`
- Contains:
  - Services (business workflows), e.g. `src/features/checkout/services/create-checkout-order.ts`
  - Repositories (DB operations), e.g. `src/features/orders/repositories/orders.repository.ts`, `src/features/catalog/repositories/product-pricing.repository.ts`
  - Schemas, e.g. `src/features/checkout/schemas/checkout-order.schema` (referenced by service layer)
  - Types, e.g. `src/features/checkout/types/checkout`
- Depends on: `src/infrastructure/validation/*`, `src/lib/supabase/*`
- Used by: API route handlers in `src/app/api/**/route.ts`

**Infrastructure (cross-cutting utilities):**
- Purpose: Shared patterns for API responses, validation, and logging.
- Location: `src/infrastructure/**`
- Contains:
  - HTTP helpers in `src/infrastructure/http/route-handler.ts` (`ok`, `fail`, `parseJson`, request id)
  - Validation helpers in `src/infrastructure/validation/*` (`ApiError`, Zod helpers)
  - Logger wrapper in `src/infrastructure/logging/logger.ts`
- Depends on: standard runtime + Next (`NextResponse` in `src/infrastructure/http/route-handler.ts`)
- Used by: API routes and services

## Data Flow

**Homepage server render (`/`):**

1. `src/app/page.tsx` (server component) calls `getHomepageCollections()` from `src/data/collections.ts` and `getFeaturedArticle()` from `src/data/articles.ts`.
2. Each `src/data/*` function gates on Supabase configuration via `isSupabaseConfigured()` from `src/lib/supabase/server.ts`.
3. If Supabase is configured, `src/data/*` uses `createSupabaseAnonServerClient()` to query tables and return typed shapes from `src/lib/supabase/types.ts`.
4. If not configured, `src/data/*` returns mock content (e.g. `src/data/mock.ts`) to keep pages functional without backend setup.

**Checkout order creation (API POST):**

1. `src/app/api/orders/route.ts` receives request and uses `parseJson()` from `src/infrastructure/http/route-handler.ts`.
2. It calls `createCheckoutOrder()` in `src/features/checkout/services/create-checkout-order.ts`.
3. Service validates input with Zod schema (via `CreateCheckoutOrderInputSchema`) and throws `ApiError` on validation failures (`src/infrastructure/validation/api-error.ts`).
4. Service reads pricing via repository `src/features/catalog/repositories/product-pricing.repository.ts` (Supabase service role client).
5. Service writes order and order items via repository `src/features/orders/repositories/orders.repository.ts` (Supabase service role client).
6. Route handler returns `ok()` response or `fail()` with structured error mapping and logs unexpected exceptions.

**State Management:**
- Client-side state: LocalStorage-backed cart state in `src/lib/local-db.ts` and hook utilities in `src/hooks/*` (e.g. `src/hooks/use-local-storage.ts`)
- Server-side state: fetched on demand in server components; no global store detected

## Key Abstractions

**Supabase client factories:**
- Purpose: Centralize env parsing and create anon/service-role Supabase clients.
- Examples:
  - `src/lib/supabase/server.ts` (`createSupabaseAnonServerClient`, `createSupabaseServiceRoleServerClient`, `isSupabaseConfigured`)
  - `src/lib/supabase/admin-server.ts` (`createSupabaseServiceRoleServerClient` with `server-only`)
- Pattern: Factory functions + explicit env getters with informative errors

**API route handler helpers:**
- Purpose: Standardize JSON parsing, response shape, request id, and error mapping.
- Examples: `src/infrastructure/http/route-handler.ts`
- Pattern: `ok()` returns `{ ok: true, ... }`, `fail()` returns `{ ok: false, code, message, error, fieldErrors? }`

## Entry Points

**Web App:**
- Location: `src/app/layout.tsx` and `src/app/page.tsx`
- Triggers: Next.js App Router
- Responsibilities:
  - `layout.tsx`: fonts, global CSS import, metadata wrapper
  - `page.tsx`: server-side data fetch and composition of sections/components

**API Routes:**
- Location: `src/app/api/orders/route.ts`
- Triggers: HTTP requests to `/api/orders`
- Responsibilities: request validation/parsing and calling feature services

**Data/DB setup scripts:**
- Location: `scripts/seed-supabase.ts`, `scripts/import-longchau-products.ts`
- Triggers: manual execution via `tsx`/Node
- Responsibilities: seed/import rows into Supabase tables using service role key

## Error Handling

**Strategy:** “Throw `ApiError` for expected failures; map unknowns to standardized API shape.”

**Patterns:**
- Domain/service layer throws `ApiError` from `src/infrastructure/validation/api-error.ts`
- API handlers wrap calls and respond via `fail()` from `src/infrastructure/http/route-handler.ts`
- Unexpected errors are logged with `logger.error()` (`src/infrastructure/logging/logger.ts`)

## Cross-Cutting Concerns

**Logging:** console wrapper in `src/infrastructure/logging/logger.ts`
**Validation:** Zod (`src/infrastructure/validation/zod.ts`) + `ApiError`
**Authentication:** Not detected (no auth middleware or session provider found in scan)

---

*Architecture analysis: 2026-04-21*

