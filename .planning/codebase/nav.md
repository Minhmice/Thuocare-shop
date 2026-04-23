# Navigation / Routes Map

Updated: 2026-04-22

## 1) UI navigation sources

### Header top nav (`TOP_NAV`)

Source: `src/components/navigation/nav.data.ts`  
Rendered by: `src/components/layout/header.tsx` (default `nav = TOP_NAV`)

**Top-level items (8):**
- `tpcn` — Thực phẩm chức năng (dropdown panel)
- `duoc-my-pham` — Dược mỹ phẩm (dropdown panel)
- `thuoc` — Thuốc (dropdown panel)
- `cham-soc-ca-nhan` — Chăm sóc cá nhân (dropdown panel)
- `tiem-chung` — Tiêm chủng (`href: "#"` placeholder)
- `thiet-bi-y-te` — Thiết bị y tế (dropdown panel)
- `benh-goc-suc-khoe` — Bệnh & Góc sức khỏe (dropdown panel)
- `he-thong-nha-thuoc` — Hệ thống nhà thuốc (`href: "#"` placeholder)

**Dropdown structure model:**
- Top item → `panel`
- `panel.sidebar[]` (left rail categories)
- Each sidebar item → `tiles[]` + `bestSellers[]`

**Important note (current state):**
- Most `TopNavItem` and `NavTile` entries **do not set `href`**.
- `NavPanelView` renders links with fallback `"#"` when `href` missing.
- Meaning: `TOP_NAV` currently defines **taxonomy + UI labels**, not real URL destinations.

### Homepage quick access links

Source: `src/components/sections/quick-actions.tsx`

Hardcoded links:
- `/supplements`
- `/thuc-pham-chuc-nang`
- `/thuc-pham-chuc-nang/sinh-ly-noi-tiet-to`
- `/thuc-pham-chuc-nang/sam-nhung-bo-than-nv-hai-linh-30v-321`
- `/checkout`

Also “Xem tất cả” links to: `/supplements`

### (Optional) Supabase-driven nav

Source: `src/data/nav.ts` exports `getTopNav()`  
Status: Implemented, but app does not consistently pass `nav={await getTopNav()}` into `<Header />` (defaults to `TOP_NAV`).

## 2) URL slugs (Next.js App Router)

Routes live under `src/app/**` (App Router). Below list derived from route files.

### Canonical pages

- `/` → `src/app/page.tsx`
- `/checkout` → `src/app/checkout/page.tsx`
- `/supplements` → `src/app/supplements/page.tsx`
- `/supplements/mens-health` → `src/app/supplements/mens-health/page.tsx`
- `/supplements/hormones` → `src/app/supplements/hormones/page.tsx`
- `/category/:slug` → `src/app/category/[slug]/page.tsx`
- `/list/*` → `src/app/list/[...slug]/page.tsx`
- `/product/:slug` → `src/app/product/[slug]/page.tsx`
- `/blog/:slug` → `src/app/blog/[slug]/page.tsx`

### Explicit “demo” product page (static route)

- `/product/sam-nhung-kidney-tonic-nv-hai-linh-30-capsules-321` → `src/app/product/sam-nhung-kidney-tonic-nv-hai-linh-30-capsules-321/page.tsx`

### Alias/redirect routes (legacy slugs)

These exist as real pages but redirect to canonical paths:

- `/p/:slug` → `src/app/p/[slug]/page.tsx` → redirects to `/product/:slug`
- `/bai-viet/:slug` → `src/app/bai-viet/[slug]/page.tsx` → redirects to `/blog/:slug`
- `/danh-muc/:slug` → `src/app/danh-muc/[slug]/page.tsx` → redirects to `/category/:slug`
- `/danh-muc/*` → `src/app/danh-muc/[...slug]/page.tsx` → redirects to `/list/*`
- `/thuc-pham-chuc-nang` → `src/app/thuc-pham-chuc-nang/page.tsx` → redirects to `/supplements`
- `/thuc-pham-chuc-nang/sinh-ly-nam` → `src/app/thuc-pham-chuc-nang/sinh-ly-nam/page.tsx` → redirects to `/supplements/mens-health`
- `/thuc-pham-chuc-nang/sinh-ly-noi-tiet-to` → `src/app/thuc-pham-chuc-nang/sinh-ly-noi-tiet-to/page.tsx` → redirects to `/supplements/hormones`
- `/thuc-pham-chuc-nang/sam-nhung-bo-than-nv-hai-linh-30v-321` → `src/app/thuc-pham-chuc-nang/sam-nhung-bo-than-nv-hai-linh-30v-321/page.tsx` → redirects to `/product/...`

### API routes

- `POST /api/orders` → `src/app/api/orders/route.ts`

## 3) Slug count summary

**Total route entries in repo (from `src/app/**`): 19**
- **Pages (`page.tsx`)**: 18
- **API handlers (`route.ts`)**: 1

**Canonical user-facing pages (non-alias): 10**
- 9 canonical pages + 1 static demo product page

**Alias/redirect pages: 8**

