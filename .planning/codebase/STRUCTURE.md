# Codebase Structure

**Analysis Date:** 2026-04-21

## Directory Layout

```
[project-root]/
├── src/                      # Next.js app code (App Router, features, components)
│   ├── app/                  # Routes, layouts, API handlers (App Router)
│   ├── components/           # UI building blocks + page sections
│   ├── data/                 # Page-oriented data queries (Supabase + mock fallback)
│   ├── features/             # Feature/domain modules (services, repositories, schemas, types)
│   ├── hooks/                # Client hooks (e.g. localStorage)
│   ├── infrastructure/       # Cross-cutting utilities (http, logging, validation)
│   ├── lib/                  # Shared libraries (Supabase clients, utils, local-db)
│   └── types/                # Shared TS types
├── supabase/                 # Supabase project assets: migrations, seed, scraped datasets
│   ├── migrations/           # SQL migrations for schema + policies
│   ├── seed.sql              # SQL seed (idempotent upserts)
│   └── longchau/             # Large scraped product datasets (JSON)
├── scripts/                  # Node/TSX scripts for seeding/importing Supabase
├── public/                   # Static assets
├── docs/                     # Project documentation (non-code)
├── .planning/                # GSD planning artifacts
├── next.config.ts            # Next.js config (standalone output, remote images)
├── tsconfig.json             # TS config (alias @/* → src/*)
├── eslint.config.mjs         # ESLint config (Next presets)
├── postcss.config.mjs        # Tailwind v4 PostCSS plugin
├── components.json           # shadcn/ui config
└── package.json              # Scripts + dependencies
```

## Directory Purposes

**`src/app/`:**
- Purpose: Routing + page composition (Next.js App Router).
- Contains: `layout.tsx`, `page.tsx`, route segments, and API routes.
- Key files:
  - `src/app/layout.tsx`
  - `src/app/page.tsx`
  - `src/app/api/orders/route.ts`

**`src/components/`:**
- Purpose: UI components and sections used by pages.
- Contains:
  - shadcn-like primitives under `src/components/ui/**`
  - feature composites under `src/components/catalog/**`, `src/components/checkout/**`, `src/components/layout/**`, `src/components/navigation/**`, `src/components/sections/**`

**`src/data/`:**
- Purpose: Server-side data fetching functions used by pages.
- Contains:
  - Supabase-backed queries that return mock data if not configured:
    - `src/data/products.ts`, `src/data/categories.ts`, `src/data/collections.ts`, `src/data/articles.ts`, `src/data/nav.ts`
  - Mock data: `src/data/mock.ts`

**`src/features/`:**
- Purpose: Feature/domain modules (business logic + persistence orchestration).
- Contains (current feature dirs):
  - `src/features/catalog/**`
  - `src/features/checkout/**`
  - `src/features/orders/**`
- Typical contents:
  - `services/*` for orchestration (e.g. `src/features/checkout/services/create-checkout-order.ts`)
  - `repositories/*` for DB access (e.g. `src/features/orders/repositories/orders.repository.ts`)
  - `schemas/*` for Zod validation
  - `types/*` for feature types

**`src/infrastructure/`:**
- Purpose: Cross-cutting app utilities.
- Contains:
  - `src/infrastructure/http/route-handler.ts`
  - `src/infrastructure/validation/api-error.ts` and `src/infrastructure/validation/zod.ts`
  - `src/infrastructure/logging/logger.ts`

**`src/lib/`:**
- Purpose: Shared libraries and adapters.
- Key files:
  - `src/lib/supabase/server.ts` (env parsing + client factories)
  - `src/lib/supabase/admin-server.ts` (server-only service role client)
  - `src/lib/supabase/types.ts` (typed DB row shapes)
  - `src/lib/local-db.ts` (localStorage-backed cart “local DB”)
  - `src/lib/utils.ts` (shared UI/util helpers)

**`supabase/`:**
- Purpose: Supabase project assets and database schema.
- Key files:
  - `supabase/migrations/0001_init_catalog.sql` (catalog tables)
  - `supabase/migrations/0005_init_orders.sql` (order tables)
  - `supabase/migrations/0006_rls_policies.sql` (RLS policies)
  - `supabase/seed.sql` (SQL seed)
- Data dumps: `supabase/longchau/**` (large JSON; treat as dataset)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: root layout + fonts + global CSS import
- `src/app/page.tsx`: homepage server component
- `src/app/api/orders/route.ts`: API endpoint for order creation

**Configuration:**
- `next.config.ts`: Next standalone output + remote images allowlist
- `tsconfig.json`: strict TS + alias `@/*`
- `eslint.config.mjs`: ESLint presets from Next
- `postcss.config.mjs`: Tailwind v4 PostCSS plugin
- `components.json`: shadcn/ui settings and aliases

**Core Logic:**
- Feature services: `src/features/**/services/*`
- Feature repositories: `src/features/**/repositories/*`
- Supabase client factories: `src/lib/supabase/*`
- API response helpers: `src/infrastructure/http/route-handler.ts`

**Testing:**
- Not detected (no dedicated test directory/config found)

## Naming Conventions

**Files:**
- App Router: `page.tsx`, `layout.tsx`, `route.ts` under `src/app/**`
- Feature modules: kebab-case in filenames (e.g. `create-checkout-order.ts`, `product-pricing.repository.ts`)
- UI components: kebab-case folders/files under `src/components/**` (e.g. `product-detail.tsx`, `mobile-sticky-buy-bar.tsx`)

**Directories:**
- Route segments in `src/app/**` follow URL structure, including dynamic segments:
  - `src/app/product/[slug]/page.tsx`
  - `src/app/category/[slug]/page.tsx`
  - `src/app/list/[...slug]/page.tsx`
- Features are grouped by domain: `src/features/{catalog,checkout,orders}/`

## Where to Add New Code

**New Route/Page:**
- Add `page.tsx` under `src/app/<route>/page.tsx`
- If you need an API endpoint, add `route.ts` under `src/app/api/<name>/route.ts` and use helpers from `src/infrastructure/http/route-handler.ts`

**New Feature:**
- Primary code: create a new folder under `src/features/<feature>/` with:
  - `schemas/*` (Zod)
  - `types/*`
  - `services/*` (business workflows)
  - `repositories/*` (Supabase writes/privileged reads)
- Shared UI: add reusable components under `src/components/<area>/`

**New Data Query used by pages:**
- Put server-side query functions in `src/data/<topic>.ts`
- Use `isSupabaseConfigured()` + `createSupabaseAnonServerClient()` from `src/lib/supabase/server.ts` and provide a mock fallback in `src/data/mock.ts` if needed

**Utilities:**
- General helpers: `src/lib/*`
- Cross-cutting infrastructure: `src/infrastructure/*`

## Special Directories

**`.next/`:**
- Purpose: Next build output
- Generated: Yes
- Committed: No (build artifact)

**`node_modules/`:**
- Purpose: dependencies
- Generated: Yes
- Committed: No

**`.planning/`:**
- Purpose: GSD planning artifacts
- Generated: Yes (workflow artifacts)
- Committed: depends on workflow; treat as planning docs

---

*Structure analysis: 2026-04-21*

