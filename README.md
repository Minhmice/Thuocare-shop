# Thuocare Shop

Next.js App Router storefront (Vietnamese) + Supabase backend. UI + flow inspired by Long Châu.

## Features

- Product listing + product detail pages
- Category pages + collection sections on homepage
- Cart stored in `localStorage`
- Checkout creates `orders` + `order_items` via `POST /api/orders` (server-only Supabase service role)

## Tech stack

- Next.js 16 (App Router) + React 19 + TypeScript
- Tailwind CSS v4 + shadcn/ui-style primitives
- Supabase Postgres (migrations in `supabase/migrations/`)

## Getting started

### 0) Requirements

- Node.js `>=24`

### 1) Install

```bash
npm ci
```

### 2) Configure environment variables

Create `.env.local` (do **not** commit). Required variables:

```bash
# Supabase (server preferred; public fallbacks supported)
SUPABASE_URL=
SUPABASE_ANON_KEY=

# Server-only (required for checkout order creation)
SUPABASE_SERVICE_ROLE_KEY=
```

Notes:
- App reads `SUPABASE_URL`/`SUPABASE_ANON_KEY` first, then falls back to `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` for browser-safe usage.
- Never expose `SUPABASE_SERVICE_ROLE_KEY` to the browser.

### 3) Run dev server

```bash
npm run dev
```

Open `http://localhost:3000`.

## Supabase schema

- **Migrations**: `supabase/migrations/*.sql`
- **Seed (SQL)**: `supabase/seed.sql`

This repo does not require Supabase CLI to run the app, but you must have a Supabase project with migrations applied.

## Scripts

- **Seed demo data**: `scripts/seed-supabase.ts`
- **Import scraped Long Châu products**: `scripts/import-longchau-products.ts`
- **Scrape upstream site**: `scripts/longchau_scrape_products.py`

Run examples:

```bash
# seed
npx tsx scripts/seed-supabase.ts

# import (requires scraped json exists)
npx tsx scripts/import-longchau-products.ts
```

## Useful commands

```bash
npm run lint
npm run typecheck
npm run build
npm run check
```

## Project structure (high level)

```text
src/app/          Next.js routes (pages, layouts, API routes)
src/components/   UI + feature components
src/data/         Supabase queries + domain functions
src/lib/          Utilities + Supabase client/env + local cart persistence
supabase/         SQL migrations + seed + scraped datasets
scripts/          Scrape/import/seed utilities
```

## Deployment

`next.config.ts` sets `output: "standalone"`. Typical flow:

```bash
npm run build
npm run start
```

Provide env vars in hosting platform runtime config.

## License

See `package.json` (MIT in template metadata). Replace if you need different license.

