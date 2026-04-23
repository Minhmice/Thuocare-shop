# Phase 8: Cleanup old routes/nav data + CMS admin prep checklist - Plan

**Owner:** Claude
**Status:** Planned

## Goal

Remove legacy route/nav surface and leave system clean for future CMS admin build-out.

## Plan

### 1) Remove legacy routes + unused pages
- Delete old English/alias pages no longer used after VN migration.
- Ensure no internal links point to removed paths.

### 2) Remove hardcoded nav fallbacks
- Delete/retire old nav constants + mock nav builders.
- Remove `"#"` placeholder links; enforce valid `href` from DB.

### 3) Tighten source-of-truth boundaries
- Ensure header/category/product flows exclusively use RPC outputs.
- Remove duplicated taxonomy mapping code.

### 4) Add CMS admin prep checklist (docs)
- CRUD `catalog_nodes`
- ordering (`sort_order`)
- active/inactive (`is_active`, `is_visible_in_nav`)
- featured links (`node_featured_links`)
- node descriptions + hero fields
- tags + product tagging
- moderation workflow (optional)

## Verification

- App still runs with VN routes and Supabase navigation.
- No unused nav modules referenced in build.
- Only one canonical route per page type (category/product/content).

