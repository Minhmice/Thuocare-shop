# Thuocare Shop — Project Overview

**Last updated:** 2026-04-21  
**Repo type:** Next.js App Router storefront (Vietnamese) with Supabase Postgres backend.

## 1) What this project is

Thuocare Shop is a pharmacy/e-commerce storefront UI inspired by Long Châu, implemented as a clean, feature-oriented Next.js codebase.

**Core capabilities:**
- Product listing pages (category/list-style routes)
- Product detail pages
- Homepage with commerce/content sections
- Client-side cart persisted in `localStorage`
- Checkout flow that creates `orders` + `order_items` via `POST /api/orders` (server-side Supabase service role)

## 2) Technology stack

**Runtime / tooling**
- Node.js `>=24`
- npm (lockfile: `package-lock.json`)
- TypeScript `^5` (`npm run typecheck`)
- ESLint `^9` (`npm run lint`)

**Framework**
- Next.js `16.2.1` (App Router, `src/app/**`)
- React `19.2.4`

**UI / styling**
- Tailwind CSS v4 (global: `src/app/globals.css`)
- shadcn-style primitives in `src/components/ui/**`
- `@base-ui/react` for headless primitives
- `lucide-react` icons
- `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`

**Backend**
- Supabase Postgres via `@supabase/supabase-js`
- SQL migrations: `supabase/migrations/*.sql`
- Seed: `supabase/seed.sql` and scripts under `scripts/*`

## 3) Architecture (how code is organized)

This repo uses App Router + feature modules + thin shared infrastructure:

### Layers
- **Routes/rendering:** `src/app/**`
  - Server components for pages (`page.tsx`) and route handlers (`route.ts`)
- **UI components:** `src/components/**`
  - `catalog/**` (listing + product detail composites)
  - `checkout/**` (checkout UI)
  - `layout/**` (Header/Footer)
  - `navigation/**` (mega-menu nav data + panel UI)
  - `sections/**` (homepage sections)
  - `shared/**` (cross-page UI like breadcrumbs)
  - `ui/**` (shadcn-style primitives)
- **Data access (page-oriented queries):** `src/data/*.ts`
  - Pattern: **if Supabase configured → query**, else **return mock** from `src/data/mock.ts`
- **Domain features (business logic):** `src/features/**`
  - `services/*` orchestrate workflows
  - `repositories/*` perform DB operations (service role)
  - `schemas/*` validate with Zod
- **Infrastructure:** `src/infrastructure/**`
  - HTTP route helpers, logging, validation
- **Shared libraries:** `src/lib/**`
  - Supabase client factories + env reading, money utils, local cart DB

### Key data flows

**Homepage (`/`)**
1. `src/app/page.tsx` fetches collections + featured article via `src/data/*`.
2. `src/data/*` uses `isSupabaseConfigured()` to decide Supabase vs mock fallback.
3. Page composes UI sections from `src/components/sections/**`.

**Checkout order creation (`POST /api/orders`)**
1. `src/app/api/orders/route.ts` parses request using `src/infrastructure/http/route-handler.ts`.
2. Calls service: `src/features/checkout/services/create-checkout-order.ts`.
3. Service validates input (Zod), calculates totals via catalog repositories, writes `orders` + `order_items` via orders repository.
4. Response standardized via `ok()` / `fail()` helpers.

**Cart**
- Stored in browser `localStorage` via `src/lib/local-db.ts` and `src/hooks/use-local-storage.ts`.
- Cart key: `thuocare:cart:v1` with one-time migration from `longchau:cart:v1`.

## 4) Project structure (tree)

```text
[project-root]/
  src/
    app/                 Next.js routes + API handlers
    components/
      catalog/           Listing + product detail components
      checkout/          Checkout UI
      commerce/          Reusable commerce UI (product card/rail)
      layout/            Header/Footer
      navigation/        Nav data/types + nav panel UI
      sections/          Homepage sections
      shared/            Shared UI primitives (breadcrumbs, etc.)
      ui/                shadcn-style UI primitives
    data/                Supabase queries + mock fallback
    features/            Domain modules: catalog/checkout/orders
    hooks/               Client hooks
    infrastructure/      HTTP helpers, validation, logging
    lib/                 Supabase clients, local-db, utilities
    types/               Shared TS types
  supabase/              Migrations/seed + scraped datasets
  scripts/               Seed/import utilities (tsx/python)
  docs/                  Documentation
  .planning/             Planning artifacts (codebase scans, etc.)
```

## 5) Environment variables

Create `.env.local` (do not commit secrets).

Required:
```bash
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
```

Notes:
- Server code prefers `SUPABASE_*` and falls back to `NEXT_PUBLIC_SUPABASE_*` variants where applicable.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

## 6) Local development

```bash
npm ci
npm run dev
```

Open `http://localhost:3000`.

## 7) Useful commands

```bash
npm run lint
npm run typecheck
npm run build
npm run check
```

## 8) Scripts (data utilities)

- Seed demo data: `scripts/seed-supabase.ts`
- Import scraped products: `scripts/import-longchau-products.ts`
- Scraper: `scripts/longchau_scrape_products.py`

Examples:
```bash
npx tsx scripts/seed-supabase.ts
npx tsx scripts/import-longchau-products.ts
```

## 9) Deployment notes

- `next.config.ts` sets `output: "standalone"`.
- Typical production flow:
```bash
npm run build
npm run start
```
- Provide env vars in hosting runtime config.

