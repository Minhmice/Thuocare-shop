# Phase 3: Seed VN taxonomy nodes + descriptions + featured links - Plan

**Owner:** Claude
**Status:** Planned

## Goal

Have production-like taxonomy data in Supabase so header nav + category pages render from DB.

## Plan

### 1) Seed top-level nodes
- Insert `catalog_nodes` rows for:
  - `Thực phẩm chức năng` → `/thuc-pham-chuc-nang`
  - `Dược mỹ phẩm` → `/duoc-my-pham`
  - plus any additional top-level you already decided (keep list authoritative in seed file)
- Fields:
  - `node_type='category_top'`
  - `parent_id=null`
  - `slug`, `full_slug` (same as slug), `route_path`
  - `description` (landing copy)
  - `nav_description` (short hover copy)
  - `sort_order`, `is_active=true`, `is_visible_in_nav=true`

### 2) Seed child nodes (max 1 level under top-level)
- Insert child categories:
  - `/${parent_slug}/${child_slug}`
- Fields:
  - `node_type='category_child'`
  - `parent_id` set to top-level node id
  - `full_slug=parent/child`
  - `route_path=/${parent}/${child}`
  - `sort_order`, `is_active=true`, `is_visible_in_nav=true` (only if should appear)

### 3) Seed featured links per top-level
- Insert `node_featured_links`:
  - `link_type='child_node'` for curated child shortcuts (optional)
  - `link_type='custom_link'` for “Bán chạy”, “Mới về”, etc.
- Keep count small (fits dropdown).

## Verification

- `get_header_navigation()` can return non-empty `items` with `children` + `featuredLinks`.
- Category page by `route_path` returns correct breadcrumb + child list.

