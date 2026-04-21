# Thuocare Subcategory Listing Specification (`/thuc-pham-chuc-nang/sinh-ly-noi-tiet-to`)

## Overview
- **Target file**: `src/components/longchau-subcategory-listing.tsx`
- **Route**: `src/app/thuc-pham-chuc-nang/sinh-ly-noi-tiet-to/page.tsx`
- **Screenshots**:
  - `docs/design-references/nhathuoclongchau.com.vn/sinh-ly-noi-tiet-to-desktop.png`
  - `docs/design-references/nhathuoclongchau.com.vn/sinh-ly-noi-tiet-to-mobile.png`
- **Interaction model**: click-driven (subcategory tiles, filters/sort, add-to-cart). localStorage only.

## Page header
- Breadcrumb: `Trang chủ / Thực phẩm chức năng / Sinh lý - Nội tiết tố`
- H1: `Sinh lý - Nội tiết tố`
- Subcategory tiles (row, has small icon + name + count):
  - `Sinh lý nam` — `20 sản phẩm`
  - `Cân bằng nội tiết tố` — `11 sản phẩm`
  - `Sinh lý nữ` — `6 sản phẩm`
  - `Tiền mãn kinh - mãn kinh` — `8 sản phẩm`

## Layout
- Desktop: left filter sidebar + right product grid (same structure as `/thuc-pham-chuc-nang` listing)
- Filter groups differ:
  - **Đối tượng sử dụng**: Tất cả, Người trưởng thành, Người lớn, Nữ giới trưởng thành, Phụ nữ tuổi tiền mãn kinh và mãn kinh
  - **Chỉ định**: Hội chứng tiền mãn kinh, Yếu sinh lý, Mãn kinh nữ, Đau lưng
  - **Thương hiệu**: Ecogreen, Á Âu, Blackmores, CEVRAI
- Sort pills same: Bán chạy / Giá thấp / Giá cao

## Product cards (sample from snapshot)
- Lactobact Intima (Đức) — `685.000đ / Hộp` — `Hộp 30 Viên`
- Sâm Nhung Bổ Thận NV (Việt Nam) — `125.000đ / Hộp` — link to product detail page
- Best King Jpanwell (Nhật Bản) — `1.300.000đ / Hộp`
- Maca F Female Empower (Hoa Kỳ) — `660.000đ / Hộp`
- Vitatree Oyster Extract (Úc) — `660.000đ / Hộp`

## Behaviors
- **Chọn mua**: add 1 to cart (`thuocare:cart:v1`, migrate from `longchau:cart:v1`)
- **Sâm Nhung** card click routes to `/thuc-pham-chuc-nang/sam-nhung-bo-than-nv-hai-linh-30v-321`

