# External Integrations

**Analysis Date:** 2026-04-21

## APIs & External Services

**Supabase (Database):**
- Supabase - primary persistence layer for catalog/content/orders
  - SDK/Client: `@supabase/supabase-js` (configured in `src/lib/supabase/server.ts` and `src/lib/supabase/admin-server.ts`)
  - Auth: env vars read by server code (names only; no values):
    - `SUPABASE_URL` (fallback: `NEXT_PUBLIC_SUPABASE_URL`) in `src/lib/supabase/server.ts`
    - `SUPABASE_ANON_KEY` (fallback: `NEXT_PUBLIC_SUPABASE_ANON_KEY`) in `src/lib/supabase/server.ts`
    - `SUPABASE_SERVICE_ROLE_KEY` for privileged server operations in `src/lib/supabase/server.ts` and `src/lib/supabase/admin-server.ts`
  - Usage patterns:
    - Anonymous server client (read-only-ish) for page data in `src/data/*.ts` via `createSupabaseAnonServerClient()`
    - Service-role server client for writes/privileged reads in `src/features/**/repositories/*.ts` via `createSupabaseServiceRoleServerClient()`

**Remote Images (CDN allowlist):**
- `cdn.nhathuoclongchau.com.vn` - image host allowlisted by Next Image remote patterns
  - Config: `next.config.ts` (`images.remotePatterns`)
  - Usage: product/hero imagery in components such as `src/components/sections/hero.tsx` and seed/product data in `scripts/seed-supabase.ts`

## Data Storage

**Databases:**
- Postgres (via Supabase)
  - Schema/migrations: `supabase/migrations/*.sql` (e.g. `supabase/migrations/0001_init_catalog.sql`, `0005_init_orders.sql`, `0006_rls_policies.sql`)
  - Seed data: `supabase/seed.sql` and scripted seeds in `scripts/seed-supabase.ts`
  - Typed row shapes: `src/lib/supabase/types.ts`
  - Client:
    - `src/lib/supabase/server.ts` for server-side clients (anon + service role)
    - `src/lib/supabase/admin-server.ts` for server-only service role client (`import "server-only";`)

**File Storage:**
- Local filesystem only (ingest assets/data under `supabase/longchau/**` and `supabase/longchau/products.json`)

**Caching:**
- None detected (no Redis/ioredis; no Next cache wrappers detected in scan)

## Authentication & Identity

**Auth Provider:**
- Not detected (no NextAuth/Lucia/Supabase Auth SSR helper; Supabase is used as a DB client only in current code)

## Monitoring & Observability

**Error Tracking:**
- None detected (no Sentry/PostHog/etc.)

**Logs:**
- Console-based logger wrapper in `src/infrastructure/logging/logger.ts`
  - Used by API error handler in `src/infrastructure/http/route-handler.ts`

## CI/CD & Deployment

**Hosting:**
- Not specified in repo (Next build configured for `output: "standalone"` in `next.config.ts`)

**CI Pipeline:**
- None detected (no GitHub Actions configs surfaced in scan)

## Environment Configuration

**Required env vars:**
- `SUPABASE_URL` (or `NEXT_PUBLIC_SUPABASE_URL`)
- `SUPABASE_ANON_KEY` (or `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
- `SUPABASE_SERVICE_ROLE_KEY` (required for server writes and scripts)

**Secrets location:**
- `.env` present at repo root (contains environment configuration; do not commit secrets)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

---

*Integration audit: 2026-04-21*

