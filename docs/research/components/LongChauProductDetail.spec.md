# Thuocare Product Detail Specification (sam-nhung-bo-than-nv-hai-linh-30v-321)

## Overview
- **Target file**: `src/components/longchau-product-detail.tsx`
- **Route**: `src/app/thuc-pham-chuc-nang/sam-nhung-bo-than-nv-hai-linh-30v-321/page.tsx`
- **Screenshots**:
  - `docs/design-references/nhathuoclongchau.com.vn/product-sam-nhung-bo-than-desktop.png`
  - `docs/design-references/nhathuoclongchau.com.vn/product-sam-nhung-bo-than-mobile.png`
- **Interaction model**: click-driven (thumbnails, qty +/-), scroll-driven (page), mobile sticky bottom bar

## DOM Structure (page body)
- Breadcrumb row (Trang chủ / Thực phẩm chức năng / Sinh lý - Nội tiết tố / Sinh lý nam)
- Product card wrapper (white, rounded)
  - Left: image gallery
    - Main image (large)
    - Thumbnail rail (5 images)
  - Right: product info
    - Country pill (Việt Nam) + brand (Dolexphar)
    - Title (multi-line)
    - Rating row: product code + rating + counts (đánh giá / bình luận)
    - Price row: `125.000đ` + unit `/ Hộp`
    - Unit selector (Hộp)
    - Quantity selector (- 1 +)
    - CTA row: primary “Chọn mua” + secondary “Tìm nhà thuốc”
    - Short description paragraph
    - Registration number (5209/2019/ÐKSP) + link “Xem giấy công bố sản phẩm”
    - Ingredients preview line + “Xem tất cả thông tin”
- Tabs section
  - Tabs: Mô tả sản phẩm / Công dụng / Cách dùng / Tác dụng phụ / Lưu ý / Bảo quản
  - Content: rich text (from HTML dump)
- Related products rail
- FAQ accordion

## Content (verbatim key fields)
- **Title**: Viên uống hỗ trợ bổ thận, tăng cường sinh lực Sâm Nhung Bổ Thận NV (30 viên)
- **Price**: 125.000đ / Hộp
- **Country**: Việt Nam
- **Brand**: Dolexphar
- **Số đăng ký**: 5209/2019/ÐKSP
- **Short desc**: Sâm Nhung Bổ Thận NV giúp bổ thận, tráng dương, mạnh gân cốt, ăn ngủ tốt, tăng cường sinh lực, giúp giảm tình trạng mãn dục nam, yếu sinh lý, đau lưng, mỏi gối.
- **Ingredients (preview)**:
  - 1 viên chứa: Nhung hươu (2.4mg), Cao ban long (7.2mg), Dâm dương hoắc (200mg), Viễn chí (16mg), Đỗ trọng (24mg), Đảng Sâm (24mg), Xuyên khung (28mg), Trạch tả (30mg), Cẩu tích (30mg), Thỏ ty tử (40mg), Nhân Sâm (80mg), Đương quy (40mg), Bạch linh (40mg), Tục đoạn (58mg), Hà thủ ô đỏ (58mg), Bách hợp (60mg), Ba kích (200mg), Hoài Sơn (76mg), Liên Nhục (88mg), Thục địa (258mg), Cam thảo (5mg), Bạch truật (36mg)
- **Dạng bào chế**: Viên nang

## Behaviors
- **Thumbnails**: click → change main image.
- **Qty**: plus/minus buttons.
- **Chọn mua**: add qty to localStorage cart (`thuocare:cart:v1`, migrate from `longchau:cart:v1`).
- **Mobile**: sticky bottom purchase bar (title + price + unit + qty + CTA) visible while viewing page (see mobile screenshot).

## Responsive behavior
- **Desktop (1440px)**: 2-column (gallery left, info right) inside centered container.
- **Mobile (390px)**: single column; sticky bottom bar appears.

