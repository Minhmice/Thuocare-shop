# Thuocare Male Listing Specification (`/thuc-pham-chuc-nang/sinh-ly-nam`)

## Overview
- **Target file**: `src/components/longchau-male-listing.tsx`
- **Route**: `src/app/thuc-pham-chuc-nang/sinh-ly-nam/page.tsx`
- **Screenshots**:
  - `docs/design-references/nhathuoclongchau.com.vn/sinh-ly-nam-desktop.png`
  - `docs/design-references/nhathuoclongchau.com.vn/sinh-ly-nam-mobile.png`
- **Interaction model**: click-driven (filters/sort/add-to-cart). localStorage only.

## Page header
- Breadcrumb: `Trang chủ / Thực phẩm chức năng / Sinh lý - Nội tiết tố / Sinh lý nam`
- H1: `Sinh lý nam`

## Filters differences (vs sinh-ly-noi-tiet-to)
- **Đối tượng sử dụng**: Tất cả, Người trưởng thành, Nam giới trưởng thành
- **Chỉ định**: Yếu sinh lý, Mỏi gối, Đau lưng, Mãn dục nam
- **Thương hiệu**: Ecogreen, Tw3, Blackmores, CEVRAI

## Product list highlights
- Sâm Nhung Bổ Thận NV (30 viên) — `125.000đ / Hộp` — link to detail page
- Best King Jpanwell (60 viên) — `1.300.000đ / Hộp`
- Maca M Male Power (60 viên) — `660.000đ / Hộp`
- TW3 Platinum (60 viên) — `688.000đ / Hộp`
- Blackmores Multivitamin For Men (50 viên) — has discount `-10%` + compare price

## Behaviors
- **Chọn mua**: add 1 to cart (`thuocare:cart:v1`, migrate from `longchau:cart:v1`)
- **Card click**: Sâm Nhung routes to `/thuc-pham-chuc-nang/sam-nhung-bo-than-nv-hai-linh-30v-321`

