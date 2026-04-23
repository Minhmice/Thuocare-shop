# Phase 6: Security model: enable RLS + public read policies + admin write - Plan

**Owner:** Claude
**Status:** Planned

## Goal

Public site can read necessary catalog data safely; DB not left open. Foundation ready for CMS admin later.

## Plan

### 1) Decide client-exposed surface
- Confirm which schemas/tables are accessed from the app runtime (Supabase client/server).

### 2) Enable RLS
- Enable RLS on:
  - `catalog_nodes`
  - `products`
  - `product_node_links`
  - `tags`
  - `product_tag_links`
  - `node_featured_links`

### 3) Public read policies (anon)
- `catalog_nodes`: allow select where `is_active=true` (and `is_visible_in_nav=true` when used for header RPC or use RPC-only access).
- `products`: allow select where `is_active=true`.
- Link tables: allow select only when referenced rows are active (or keep select allowed and rely on joins in RPC).
- `tags`: allow select where `is_active=true`.

### 4) Write policies (admin/service only)
- Default: no insert/update/delete for anon/authenticated.
- Allow write only for privileged role(s) used by future CMS (or service role in controlled environment).

## Verification

- Anonymous select of inactive rows denied.
- RPC endpoints still work for public reads.
- Direct table writes from anon denied.

