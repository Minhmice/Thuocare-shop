# Phase 4: Seed products + node links + tags - Plan

**Owner:** Claude
**Status:** Planned

## Goal

Provide enough real product data to validate RPC output shapes, product detail rendering, and category listing previews.

## Plan

### 1) Seed products
- Insert `products` rows with:
  - `name`, `slug`, `route_path="/san-pham/${slug}"`
  - `short_description`, `description`
  - `thumbnail_url`, `gallery` (optional)
  - `price`, `compare_at_price` (optional)
  - `is_active=true`
  - SEO fields as needed

### 2) Link products to nodes
- Insert `product_node_links`:
  - 1 row per product marked `is_primary=true` (primary category)
  - optional secondary nodes with `is_primary=false`
  - `sort_order` for category listing order

### 3) Seed tags + tag links
- Create `tags` across several `tag_type` values (benefit/ingredient/audience/condition).
- Link tags to products via `product_tag_links`.

## Verification

- Product detail RPC returns:
  - product
  - primary node
  - tags
  - related products (even if naive first version)
- Category page RPC can show product preview list for a node.

