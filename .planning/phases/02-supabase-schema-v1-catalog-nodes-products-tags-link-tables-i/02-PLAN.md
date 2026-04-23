# Phase 2: Supabase schema v1: catalog_nodes/products/tags/link tables + indexes - Plan

**Owner:** Claude
**Status:** Planned

## Goal

Deliver DB schema that cleanly supports VN routes, server-side nav tree, product canonical routing, tags, and featured link blocks.

## Plan

### 1) Create tables
- `catalog_nodes`
  - `node_type`, `parent_id`, `name`, `slug`, `full_slug`, `route_path`
  - content fields: `description`, `nav_description`, `hero_title`, `hero_description`
  - display: `sort_order`, `is_active`, `is_visible_in_nav`, `cover_image_url`, `icon_name`
  - SEO: `seo_title`, `seo_description`
  - timestamps
- `products`
  - `name`, `slug`, `route_path`, descriptions, media, pricing, flags, SEO, timestamps
- `product_node_links` (`product_id`, `node_id`, `is_primary`, `sort_order`)
- `tags` (`name`, `slug`, `tag_type`, `description`, `is_active`)
- `product_tag_links` (`product_id`, `tag_id`)
- `node_featured_links`
  - `node_id`, `link_type`, `label`, `description`, `href`
  - optional refs: `product_id`, `target_node_id`
  - `sort_order`, `is_active`

### 2) Constraints + indexes
- Uniques:
  - `catalog_nodes.route_path`
  - `catalog_nodes.full_slug`
  - `products.slug`
  - `products.route_path`
  - `tags.slug`
- Indexes:
  - `catalog_nodes.parent_id`
  - `product_node_links.product_id`, `product_node_links.node_id`
  - partial unique: one primary node per product (`is_primary=true`)
  - `product_tag_links.product_id`, `product_tag_links.tag_id`
  - `node_featured_links.node_id`

### 3) Foreign keys + delete behavior
- FK with `on delete cascade` for link tables where appropriate.
- For `catalog_nodes.parent_id`, prefer `on delete restrict` (avoid accidental subtree delete).

## Verification

- Migrations apply cleanly.
- Constraints prevent duplicate `route_path` / `full_slug`.
- Link tables enforce integrity and allow multi-category + single primary.

