# Thuocare Category Listing Specification (`/thuc-pham-chuc-nang`)

## Overview
- **Target file**: `src/components/longchau-category-listing.tsx`
- **Route**: `src/app/thuc-pham-chuc-nang/page.tsx`
- **Screenshots**:
  - `docs/design-references/nhathuoclongchau.com.vn/tpcn-list-desktop.png`
  - `docs/design-references/nhathuoclongchau.com.vn/tpcn-list-mobile.png`
- **Interaction model**: click-driven (filters, sort, add-to-cart). No real backend; use localStorage cart.

## DOM Structure
- Breadcrumb row: `Trang chủ / Thực phẩm chức năng`
- Page title: `Thực phẩm chức năng`
- Category rail: `Vitamin & Khoáng chất`, `Miễn dịch - Đề kháng`, `Sinh lý - Nội tiết tố`, ... (chips/links)
- Main layout (desktop): 2 columns
  - Left sidebar: **Bộ lọc nâng cao**
    - Search input “Tìm theo tên” (per filter group)
    - Checkboxes group: Đối tượng sử dụng (Tất cả, Trẻ em, Người lớn, Người trưởng thành, Phụ nữ có thai)
    - Price buttons (Dưới 100.000đ, 100.000đ đến 300.000đ, 300.000đ đến 500.000đ, Trên 500.000đ)
    - Checkbox groups: Mùi vị/Mùi hương, Nước sản xuất, Chỉ định, Thương hiệu, Xuất xứ thương hiệu
  - Right content:
    - Section title: `Danh sách sản phẩm`
    - Sort pills: `Bán chạy`, `Giá thấp`, `Giá cao`
    - Notice line: `Lưu ý: Thuốc kê đơn và một số sản phẩm sẽ cần tư vấn từ dược sĩ`
    - Product grid cards (4 cols desktop)
      - Country label + (flag in original)
      - Image
      - Title
      - Price + unit `/ Hộp`
      - Unit text (e.g. `Hộp 30 Viên`)
      - CTA button `Chọn mua`
    - Pagination/load more: `Xem thêm 573 sản phẩm`

## Behaviors
- **Filters/sort**: UI state only (no real query); selecting shows selected state.
- **Chọn mua**: add 1 line item to localStorage cart (`thuocare:cart:v1`, migrate from `longchau:cart:v1`).

## Responsive
- **Desktop**: sidebar visible; grid 4 columns.
- **Mobile**: sidebar becomes drawer/overlay in original; clone uses collapsible filter panel.

