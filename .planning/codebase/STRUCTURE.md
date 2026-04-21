```markdown
# Codebase Structure

**Analysis Date:** 2026-04-21

## Directory Layout

```
[project-root]/
├── src/
│   ├── app/                 # Next.js App Router routes (pages, layouts, API routes)
│   ├── components/          # App components + `components/ui` primitives
│   ├── data/                # Data access functions (Supabase reads/writes) + mock data
│   ├── hooks/               # React hooks (e.g. localStorage state)
│   ├── lib/                 # Shared utilities + Supabase client/env + local “db”
│   └── types/               # Shared TS types (domain/UI)
├── public/                  # Static assets
├── scripts/                 # Node/Python scripts for scraping/import/seed
├── supabase/                # Supabase SQL migrations + seed + scraped datasets
├── docs/                    # Research/spec notes for cloned UX
├── next.config.ts           # Next config (standalone output; image remote patterns)
├── tsconfig.json            # TS config + `@/*` alias
├── eslint.config.mjs         # ESLint config (Next core web vitals + TS)
├── postcss.config.mjs        # Tailwind v4 PostCSS plugin
├── components.json           # shadcn generator config + aliases
└── .env                      # Local env (present; do not commit values)
```

## Directory Purposes

**`src/app/`:**
- Purpose: Routing + SSR/Server Components + route handlers
- Key files:
  - `src/app/layout.tsx` (global layout + fonts + metadata)
  - `src/app/page.tsx` (home)
  - `src/app/api/orders/route.ts` (POST checkout order creation)
  - Dynamic routes: `src/app/product/[slug]/page.tsx`, `src/app/category/[slug]/page.tsx`, `src/app/blog/[slug]/page.tsx`

**`src/data/`:**
- Purpose: “Data access layer” (Supabase queries + mapping to UI types)
- Key files:
  - `src/data/products.ts` (product detail + category listing)
  - `src/data/articles.ts` (featured + by slug)
  - `src/data/orders.ts` (server-side checkout write)
  - `src/data/mock.ts` (fallback data when Supabase isn’t configured)

**`src/lib/supabase/`:**
- Purpose: Centralize env + client creation; define table row types
- Key files:
  - `src/lib/supabase/server.ts` (env reads + anon/service role clients)
  - `src/lib/supabase/types.ts` (Db* types matching migrations)

**`scripts/`:**
- Purpose: One-off/batch operations (scrape/import/seed)
- Key files:
  - `scripts/longchau_scrape_products.py` (scrape upstream website sitemap + __NEXT_DATA__)
  - `scripts/import-longchau-products.ts` (read `src/data/longchau/products.json` and upsert into Supabase)
  - `scripts/seed-supabase.ts` (seed small demo dataset)

**`supabase/`:**
- Purpose: Database schema + RLS + datasets
- Key files:
  - `supabase/migrations/*.sql` (schema + RLS)
  - `supabase/seed.sql` (dev seed)
  - `supabase/longchau/products.json` + `supabase/longchau/products/*.json` (scraped product payloads)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: global HTML shell + metadata
- `src/app/page.tsx`: home composition

**Configuration:**
- `next.config.ts`: image allowlist + standalone output
- `tsconfig.json`: strict TS + `@/*` alias
- `components.json`: shadcn + aliases to match TS paths

**Core Logic:**
- `src/data/*.ts`: Supabase query + mapping logic

**Testing:**
- Not detected (no `*.test.*` / `*.spec.*` in `src/` and no Jest/Vitest/Playwright configs found)

## Naming Conventions

**Routes:**
- App Router segments in `src/app/**/page.tsx`
- API route handlers in `src/app/api/**/route.ts`

**Components:**
- Feature components use `longchau-*` file names in `src/components/` (e.g. `src/components/longchau-header.tsx`)
- UI primitives in `src/components/ui/*` (shadcn-style)

**Aliases:**
- Use `@/` for imports from `src/` (configured in `tsconfig.json` and `components.json`)

## Where to Add New Code

**New page/route:**
- Add `src/app/<segment>/page.tsx` (or `src/app/<segment>/[param]/page.tsx`)

**New API endpoint:**
- Add `src/app/api/<name>/route.ts` (export `GET/POST/etc`)

**New Supabase query / domain operation:**
- Add or extend `src/data/<domain>.ts`
- Use `createSupabaseAnonServerClient()` for public reads and `createSupabaseServiceRoleServerClient()` for privileged server writes (`src/lib/supabase/server.ts`)

**New database table:**
- Add a new migration in `supabase/migrations/` and extend `src/lib/supabase/types.ts` with matching `Db*` types

**New scraping/import logic:**
- Put it in `scripts/` and keep env access centralized (mirror pattern in `scripts/seed-supabase.ts` / `scripts/import-longchau-products.ts`)

## Special Directories

**`.next/`:**
- Generated: Yes (Next build output)
- Committed: Appears present locally; should generally be ignored in git (verify `.gitignore`)

**`node_modules/`:**
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-04-21*
```
