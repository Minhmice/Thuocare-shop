# Behaviors — `nhathuoclongchau.com.vn` (homepage)

> Note: This file records observed/expected UI behaviors for the clone build.  
> Some fine-grained computed-style diffs are not captured yet; we’ll refine during visual QA.

## Global / page-level
- **Cookie consent banner**: fixed at bottom; actions: “Chấp nhận tất cả”, “Từ chối”, close (X).
- **Floating consult widget**: “Tư vấn” button/avatar at bottom-right; stays visible.

## Header
- **Sticky header**: header appears intended to remain at the top during scroll.
- **Category nav**: items show a dropdown indicator (chevron). Expected behavior is hover/click to reveal mega-menu / dropdown.
- **Search box**:
  - Placeholder text changes (rotating prompts).
  - Has voice search + image search buttons.

## Hero carousel
- **Auto-advance**: hero banner switches without user action (time-driven).
- **Controls**: prev/next arrows + dots (pagination).
- **CTA button**: inside hero banner (e.g. “Xem ngay”, “Mua ngay”).

## Carousels / rails
- Product lists use a **horizontal carousel** pattern (drag / arrows depending on device).
- Cards have **hover affordances** (shadow / lift) on desktop.

## Responsive behavior (expected)
- **Desktop**: full header with search + buttons; multi-row nav links.
- **Mobile**:
  - Header compresses: logo + search; navigation likely collapses.
  - Carousels show fewer items per viewport and bigger touch targets.

