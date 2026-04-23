# Codebase Structure

**Analysis Date:** 2026-04-22

## Directory Layout

```
[project-root]/
├── src/                      # Next.js app code (App Router, features, components)
│   ├── app/                  # Routes, layouts, redirects, API handlers (App Router)
│   ├── components/           # UI building blocks + layout/navigation + page sections
│   ├── data/                 # Server data access (Supabase + mock fallback)
│   ├── features/             # Domain modules (services, repositories, schemas, types)
│   ├── hooks/                # Client hooks (e.g. localStorage)
│   ├── infrastructure/       # Cross-cutting utilities (http, logging, validation)
│   ├── lib/                  # Shared libs (Supabase clients, utils, local-db)
│   └── types/                # Shared TS types
├── supabase/                 # Supabase schema assets + datasets
├── public/                   # Static assets
├── docs/                     # Documentation artifacts (non-runtime)
├── .planning/                # GSD workflow artifacts (includes codebase maps)
├── next.config.ts            # Next.js config (standalone output, image remotePatterns)
├── tsconfig.json             # TS config (path alias `@/*` → `src/*`)
└── package.json              # Scripts + dependencies
```

## Directory Purposes

**`src/app/`:**
- Purpose: App Router entrypoints (routes, layouts, redirects, API endpoints).
- Key files:
  - `src/app/layout.tsx` (root wrapper; imports `src/app/globals.css`)
  - `src/app/page.tsx` (homepage)
  - `src/app/api/orders/route.ts` (`POST /api/orders`)

**`src/components/`:**
- Purpose: UI composition and layout/navigation.
- Key areas:
  - Layout: `src/components/layout/header.tsx`, `src/components/layout/footer.tsx`
  - Navigation: `src/components/navigation/nav.data.ts`, `src/components/navigation/nav-panel.tsx`, `src/components/navigation/nav.types.ts`
  - Sections: `src/components/sections/*` (homepage sections)
  - Catalog & commerce: `src/components/catalog/**`, `src/components/commerce/**`
  - Shared widgets: `src/components/shared/breadcrumbs.tsx`
  - Primitives: `src/components/ui/**`

**`src/data/`:**
- Purpose: Server-side data access called by Server Components in `src/app/**`.
- Examples:
  - Navigation query: `src/data/nav.ts` (Supabase + category fallback) and `src/data/mock.ts` (mock nav/products/collections/article)

**`src/features/`:**
- Purpose: Business logic modules used by API routes.
- Expected structure: `src/features/<domain>/{schemas,types,services,repositories}/`
- Example service: `src/features/checkout/services/create-checkout-order.ts` (used by `src/app/api/orders/route.ts`).

**`src/infrastructure/`:**
- Purpose: cross-cutting utilities for APIs and validation.
- Example: `src/infrastructure/http/route-handler.ts` (API JSON parsing and response envelope).

**`src/lib/`:**
- Purpose: shared helpers and adapters (including Supabase clients).
- Example: `src/lib/supabase/server.ts` and `src/lib/supabase/admin-server.ts`.

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: root HTML/body wrapper and metadata; does not render shared header/footer.
- `src/app/**/page.tsx`: page entrypoints (most pages explicitly render `<Header />` + `<Footer />`).
- `src/app/api/**/route.ts`: API endpoints (example: `src/app/api/orders/route.ts`).

**Navigation + URL sources:**
- `src/components/layout/header.tsx`: top navigation UI (dropdown behavior + hover state).
- `src/components/navigation/nav.data.ts`: static `TOP_NAV` menu model used as `Header` default.
- `src/data/nav.ts`: `getTopNav()` Supabase-backed nav model (not wired into pages by default).
- `src/components/sections/quick-actions.tsx`: homepage “quick access” links and their slugs.

## Routing (URL slugs)

**App Router routes live under `src/app/` and map to URL paths via folders:**

```
src/app/
├── page.tsx                                  # GET /
├── layout.tsx                                # root layout wrapper
├── checkout/page.tsx                         # GET /checkout
├── api/
│   └── orders/route.ts                       # POST /api/orders
├── product/
│   ├── [slug]/page.tsx                       # GET /product/:slug
│   └── sam-nhung-kidney-tonic-nv-hai-linh-30-capsules-321/page.tsx
│                                              # GET /product/sam-nhung-kidney-tonic-nv-hai-linh-30-capsules-321
├── category/[slug]/page.tsx                  # GET /category/:slug
├── list/[...slug]/page.tsx                   # GET /list/* (catch-all)
├── supplements/
│   ├── page.tsx                              # GET /supplements
│   ├── mens-health/page.tsx                  # GET /supplements/mens-health
│   └── hormones/page.tsx                     # GET /supplements/hormones
├── blog/[slug]/page.tsx                      # GET /blog/:slug
├── bai-viet/[slug]/page.tsx                  # GET /bai-viet/:slug → redirects to /blog/:slug
├── p/[slug]/page.tsx                         # GET /p/:slug → redirects to /product/:slug
├── danh-muc/
│   ├── [slug]/page.tsx                       # GET /danh-muc/:slug → redirects to /category/:slug
│   └── [...slug]/page.tsx                    # GET /danh-muc/* → redirects to /list/*
└── thuc-pham-chuc-nang/
    ├── page.tsx                              # GET /thuc-pham-chuc-nang → redirects to /supplements
    ├── sinh-ly-nam/page.tsx                  # GET /thuc-pham-chuc-nang/sinh-ly-nam → /supplements/mens-health
    ├── sinh-ly-noi-tiet-to/page.tsx          # GET /thuc-pham-chuc-nang/sinh-ly-noi-tiet-to → /supplements/hormones
    └── sam-nhung-bo-than-nv-hai-linh-30v-321/page.tsx
                                               # GET /thuc-pham-chuc-nang/sam-nhung-bo-than-nv-hai-linh-30v-321 → /product/...
```

## Naming Conventions

**Routes:**
- App Router: `page.tsx`, `layout.tsx`, `route.ts` under `src/app/**`
- Dynamic segments: `[slug]` (example: `src/app/product/[slug]/page.tsx`)
- Catch-all segments: `[...slug]` (example: `src/app/list/[...slug]/page.tsx`)

**App code:**
- Path alias: import from `@/*` resolves to `src/*` via `tsconfig.json`.

## Where to Add New Code

**New page route:**
- Add a folder under `src/app/<path>/page.tsx`.
- If the page should canonicalize/alias an existing slug, implement a redirect via `redirect()` from `next/navigation` (examples in `src/app/p/[slug]/page.tsx`, `src/app/danh-muc/[...slug]/page.tsx`).

**New API endpoint:**
- Add `src/app/api/<name>/route.ts` and use `src/infrastructure/http/route-handler.ts` helpers (`parseJson`, `ok`, `fail`, `getRequestId`).

**New nav entry (static):**
- Update `TOP_NAV` in `src/components/navigation/nav.data.ts` and ensure `href` values match App Router slugs.

**New nav entry (dynamic/Supabase):**
- Extend `src/data/nav.ts` (tables: `nav_top_items`, `nav_sidebar_items`, `nav_tiles`, `nav_best_sellers`) and pass `nav={await getTopNav()}` into `src/components/layout/header.tsx` from pages that want DB-driven nav.

## Special Directories

**`.next/`:**
- Purpose: Next build output
- Generated: Yes
- Committed: No

**`node_modules/`:**
- Purpose: Dependencies
- Generated: Yes
- Committed: No

---

*Structure analysis: 2026-04-22*

