# Page Topology — `nhathuoclongchau.com.vn` (homepage)

Source refs:
- Desktop screenshot: `docs/design-references/nhathuoclongchau.com.vn/home-desktop.png`
- Mobile screenshot: `docs/design-references/nhathuoclongchau.com.vn/home-mobile.png`
- Live URL: `https://nhathuoclongchau.com.vn/`

## Global layout
- **Page type**: ecommerce + health content portal (mixed merchandising + editorial blocks).
- **Primary container**: full-width page, content centered in a max-width container for most sections; hero is full-bleed.
- **Persistent overlays**:
  - **Floating “Tư vấn” chat button** at bottom-right.
  - **Cookie consent** bottom bar (dismissible).

## Sections (top → bottom)
1. **Top utility bar**
   - Links/CTAs: “Trung tâm tiêm chủng…”, “Tải ứng dụng”, hotline “1800 6928”.
2. **Main header**
   - Left: logo “THUOCARE”
   - Center: search box (placeholder varies), voice search + image search icons
   - Right: “Đăng nhập”, “Giỏ hàng”
   - Below: quick keyword links (Canxi, Omega 3, …) + main category nav (Thực phẩm chức năng, Dược mỹ phẩm, Thuốc, …)
3. **Hero merchandising block**
   - Large carousel banner with previous/next arrows + pagination dots
   - CTA button in banner (e.g., “Xem ngay”, “Mua ngay”)
   - Under-hero: smaller promo tiles / carousels (left) + informational tile(s) (right)
4. **Quick actions strip** (“Cần mua thuốc”, “Tư vấn với Dược Sỹ”, “Đơn của tôi”, …)
5. **Product carousels**
   - “Sản phẩm trong phiên live”
   - “Sản phẩm bán chạy”
   - Card pattern: image + country badge/discount + title + price + unit + CTA “Chọn mua”
6. **Danh mục nổi bật** (category cards grid)
7. **Thương hiệu yêu thích** (brand logo rail / grid)
8. **Kiểm tra sức khỏe** (quiz tiles grid)
9. **Bệnh theo mùa** (seasonal disease chips/tabs)
10. **Video ngắn nổi bật** (video cards grid/rail)
11. **Góc sức khỏe** (editorial list)
12. **Bệnh** (disease category blocks + link lists)
13. **Footer**
   - App download block, support hotlines, payment support, social links, company info, legal links.

## Interaction model per section (high-level)
- **Header**: hover-driven dropdowns for category nav; click-driven for login/cart/search; likely sticky.
- **Hero**: time-driven carousel (auto-advance) + click-driven arrows/dots.
- **Product rails**: click/drag-driven horizontal carousel.
- **Editorial/video**: mostly click-through links; hover states on cards/links.

