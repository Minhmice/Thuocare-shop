```markdown
# External Integrations

**Analysis Date:** 2026-04-21

## APIs & External Services

**Supabase (Database + PostgREST + RLS):**
- Used for catalog + content reads and server-only checkout writes
  - App data reads: `src/data/products.ts`, `src/data/articles.ts`, `src/data/collections.ts`, `src/data/categories.ts`
  - Server-only order creation: `src/data/orders.ts` invoked by `src/app/api/orders/route.ts`
  - Client factory + env validation: `src/lib/supabase/server.ts`
- Scripts that write to Supabase:
  - Seed demo content: `scripts/seed-supabase.ts`
  - Bulk import scraped products: `scripts/import-longchau-products.ts`
- Schema/migrations:
  - `supabase/migrations/0001_init_catalog.sql` (brands/categories/products/product_images)
  - `supabase/migrations/0005_init_orders.sql` (orders/order_items)
  - `supabase/migrations/0006_rls_policies.sql` (public read policies + restrict orders writes)
  - Dev seed: `supabase/seed.sql`

**Remote media source:**
- `cdn.nhathuoclongchau.com.vn` is allowlisted for `next/image` (`next.config.ts`)

## Data Storage

**Databases:**
- Supabase Postgres (tables in `supabase/migrations/*.sql`)
  - Client: `@supabase/supabase-js`
  - No ORM detected (direct `supabase.from(...).select/insert` calls)

**Local storage (browser):**
- Shopping cart persisted in `window.localStorage` (`src/lib/local-db.ts`, used by `src/components/checkout-form.tsx`)

**File storage:**
- Repo contains large scraped datasets:
  - `supabase/longchau/products.json` and `supabase/longchau/products/*.json`
  - Import script reads `src/data/longchau/products.json` (`scripts/import-longchau-products.ts`) (ensure file exists before running)

**Caching:**
- None detected (no Redis/ioredis usage found)

## Authentication & Identity

**Auth Provider:**
- None implemented for end users.
- Supabase service role key used server-side for privileged writes:
  - `createSupabaseServiceRoleServerClient()` (`src/lib/supabase/server.ts`)
  - Order creation uses service role (`src/data/orders.ts`)

## Monitoring & Observability

**Error Tracking:** None detected (no Sentry/Datadog/PostHog SDKs found)
**Logs:** `console.log/error` in scripts (`scripts/*.ts`)

## CI/CD & Deployment

**Hosting:** Not detected (no `vercel.json`, no GitHub Actions in `.github/workflows/**`)
**Build artifact:** Next standalone output (`next.config.ts` -> `output: "standalone"`)

## Environment Configuration

**Required env vars (names only):**
- Supabase URL:
  - `SUPABASE_URL` (preferred server-side)
  - `NEXT_PUBLIC_SUPABASE_URL` (fallback / browser-safe)
- Supabase anon key (public):
  - `SUPABASE_ANON_KEY` (preferred server-side)
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (fallback / browser-safe)
- Supabase service role key (server-only; never expose to browser):
  - `SUPABASE_SERVICE_ROLE_KEY`
  - Import script fallbacks (avoid if possible): `SUPABASE_SERVICE_KEY`, `SERVICE_SUPABASESERVICE_KEY` (`scripts/import-longchau-products.ts`)

**Secrets location:**
- `.env` at repo root is present for local dev (do not commit; provide values via hosting platform in prod).

## Webhooks & Callbacks

**Incoming:** None detected
**Outgoing:** None detected

---

*Integration audit: 2026-04-21*
```
