import type { ProductCard } from "@/types/commerce";
import type { HeaderNavModel, NavTopItem } from "@/components/navigation/nav.types";

function vnd(amount: number): { amount: number; display: string } {
  const display = `${amount.toLocaleString("vi-VN")}đ`;
  return { amount, display };
}

const BEST_SELLERS_MALE: ProductCard[] = [
  { id: "male-1", title: "Viên uống bổ sung lợi khuẩn, D-mannose, việt quất…", imageUrl: undefined, price: vnd(685000), unit: "Hộp" },
  { id: "male-2", title: "Viên uống hỗ trợ bổ thận, tăng cường sinh lực Sâm Nhung…", imageUrl: undefined, price: vnd(125000), unit: "Hộp" },
  { id: "male-3", title: "Viên uống hỗ trợ tăng cường sinh lý và tăng khả năng…", imageUrl: undefined, price: vnd(1300000), unit: "Hộp" },
  { id: "male-4", title: "Viên uống hỗ trợ tăng sinh lý nữ, tăng cường nội tiết tố…", imageUrl: undefined, price: vnd(660000), unit: "Hộp" },
  { id: "male-5", title: "Viên uống giúp bổ thận, tráng dương, tăng cường sinh lực…", imageUrl: undefined, price: vnd(660000), unit: "Hộp" },
];

const BEST_SELLERS_SKIN: ProductCard[] = [
  { id: "skin-1", title: "Kem chống nắng nâng tông nhẹ Sắc Ngọc Khang SPF…", imageUrl: "", price: vnd(166000), unit: "Hộp" },
  { id: "skin-2", title: "Tinh chất dưỡng ẩm, sáng da Pax Moly Blemish C…", imageUrl: "", badge: "-20%", price: vnd(240000), compareAt: vnd(300000), unit: "Hộp" },
  { id: "skin-3", title: "Sữa rửa mặt thảo dược sáng da, mờ thâm Sắc Ngọc…", imageUrl: "", price: vnd(69000), unit: "Tuýp" },
  { id: "skin-4", title: "Kem dưỡng trắng da 5 in 1 SPF25/PA++ Sắc Ngọc Khang…", imageUrl: "", price: vnd(250000), unit: "Hộp" },
  { id: "skin-5", title: "Sữa rửa mặt ngừa mụn On: The Body Rice Therapy Ric…", imageUrl: "", price: vnd(165000), unit: "Tuýp" },
];

const UTILITY_NAV: NavTopItem[] = [
  { id: "tiem-chung", label: "Tiêm chủng", href: "/tiem-chung", kind: "service" },
  { id: "he-thong-nha-thuoc", label: "Hệ thống nhà thuốc", href: "/he-thong-nha-thuoc", kind: "service" },
  { id: "goc-suc-khoe", label: "Góc sức khỏe", href: "/goc-suc-khoe", kind: "content" },
  { id: "ho-tro", label: "Hỗ trợ", href: "/ho-tro", kind: "service" },
  { id: "tra-cuu-don", label: "Tra cứu đơn", href: "/tra-cuu-don", kind: "service" },
];

const MAIN_NAV: NavTopItem[] = [
  {
    id: "thuoc",
    label: "Thuốc",
    href: "/thuoc",
    kind: "category",
    mega: {
      id: "mega-thuoc",
      blocks: [
        {
          kind: "links",
          id: "thuoc-main",
          title: "Danh mục chính",
          viewAll: { id: "all-thuoc", label: "Xem tất cả", href: "/thuoc" },
          links: [
            { id: "khang-sinh", label: "Kháng sinh", href: "/thuoc/khang-sinh" },
            { id: "tim-mach", label: "Tim mạch & máu", href: "/thuoc/tim-mach" },
            { id: "tieu-hoa", label: "Tiêu hoá & gan mật", href: "/thuoc/tieu-hoa" },
            { id: "than-kinh", label: "Thần kinh", href: "/thuoc/than-kinh" },
            { id: "ung-thu", label: "Điều trị ung thư", href: "/thuoc/ung-thu" },
            { id: "giam-dau", label: "Giảm đau - hạ sốt", href: "/thuoc/giam-dau" },
          ],
        },
        {
          kind: "links",
          id: "thuoc-needs",
          title: "Theo nhu cầu",
          links: [
            { id: "cam-cum", label: "Cảm cúm", href: "/nhu-cau/cam-cum" },
            { id: "di-ung", label: "Dị ứng", href: "/nhu-cau/di-ung" },
            { id: "dau-da-day", label: "Đau dạ dày", href: "/nhu-cau/dau-da-day" },
            { id: "ho-hap", label: "Hô hấp", href: "/nhu-cau/ho-hap" },
          ],
        },
        {
          kind: "bestSellers",
          id: "thuoc-featured",
          title: "Gợi ý nhanh",
          href: "/thuoc",
          products: BEST_SELLERS_MALE.slice(0, 4),
        },
      ],
    },
  },
  {
    id: "tpcn",
    label: "Thực phẩm chức năng",
    href: "/thuc-pham-chuc-nang",
    kind: "category",
    mega: {
      id: "mega-tpcn",
      blocks: [
        {
          kind: "links",
          id: "tpcn-main",
          title: "Danh mục chính",
          viewAll: { id: "all-tpcn", label: "Xem tất cả", href: "/thuc-pham-chuc-nang" },
          links: [
            { id: "vitamin-khoang-chat", label: "Vitamin & khoáng chất", href: "/thuc-pham-chuc-nang/vitamin-khoang-chat" },
            { id: "mien-dich", label: "Miễn dịch - đề kháng", href: "/thuc-pham-chuc-nang/mien-dich" },
            { id: "tieu-hoa", label: "Tiêu hoá", href: "/thuc-pham-chuc-nang/tieu-hoa" },
            { id: "noi-tiet", label: "Nội tiết tố", href: "/thuc-pham-chuc-nang/sinh-ly-noi-tiet-to" },
            { id: "sinh-ly", label: "Sinh lý nam", href: "/thuc-pham-chuc-nang/sinh-ly-nam" },
          ],
        },
        {
          kind: "links",
          id: "tpcn-needs",
          title: "Theo nhu cầu",
          links: [
            { id: "tang-de-khang", label: "Tăng đề kháng", href: "/nhu-cau/tang-de-khang" },
            { id: "xuong-khop", label: "Xương khớp", href: "/nhu-cau/xuong-khop" },
            { id: "giam-can", label: "Giảm cân", href: "/nhu-cau/giam-can" },
            { id: "ngu-ngon", label: "Ngủ ngon", href: "/nhu-cau/ngu-ngon" },
          ],
        },
        {
          kind: "bestSellers",
          id: "tpcn-featured",
          title: "Bán chạy",
          href: "/thuc-pham-chuc-nang",
          products: BEST_SELLERS_MALE.slice(0, 4),
        },
      ],
    },
  },
  {
    id: "duoc-my-pham",
    label: "Dược mỹ phẩm",
    href: "/duoc-my-pham",
    kind: "category",
    mega: {
      id: "mega-duoc-my-pham",
      blocks: [
        {
          kind: "links",
          id: "dmp-main",
          title: "Danh mục chính",
          viewAll: { id: "all-dmp", label: "Xem tất cả", href: "/duoc-my-pham" },
          links: [
            { id: "cham-soc-da-mat", label: "Chăm sóc da mặt", href: "/duoc-my-pham/cham-soc-da-mat" },
            { id: "chong-nang", label: "Chống nắng", href: "/duoc-my-pham/chong-nang" },
            { id: "serum", label: "Serum / Essence", href: "/duoc-my-pham/serum" },
            { id: "mat-na", label: "Mặt nạ", href: "/duoc-my-pham/mat-na" },
          ],
        },
        {
          kind: "links",
          id: "dmp-needs",
          title: "Theo nhu cầu",
          links: [
            { id: "da-mun", label: "Da mụn", href: "/nhu-cau/da-mun" },
            { id: "da-nhay-cam", label: "Da nhạy cảm", href: "/nhu-cau/da-nhay-cam" },
            { id: "tri-nam", label: "Trị nám", href: "/nhu-cau/tri-nam" },
            { id: "duong-am", label: "Dưỡng ẩm", href: "/nhu-cau/duong-am" },
          ],
        },
        {
          kind: "bestSellers",
          id: "dmp-featured",
          title: "Gợi ý",
          href: "/duoc-my-pham",
          products: BEST_SELLERS_SKIN.slice(0, 4),
        },
      ],
    },
  },
  {
    id: "cham-soc-ca-nhan",
    label: "Chăm sóc cá nhân",
    href: "/cham-soc-ca-nhan",
    kind: "category",
    mega: {
      id: "mega-cham-soc-ca-nhan",
      blocks: [
        {
          kind: "links",
          id: "cscn-main",
          title: "Danh mục chính",
          viewAll: { id: "all-cscn", label: "Xem tất cả", href: "/cham-soc-ca-nhan" },
          links: [
            { id: "bao-cao-su", label: "Bao cao su", href: "/cham-soc-ca-nhan/bao-cao-su" },
            { id: "gel-boi-tron", label: "Gel bôi trơn", href: "/cham-soc-ca-nhan/gel-boi-tron" },
            { id: "ve-sinh", label: "Vệ sinh cá nhân", href: "/cham-soc-ca-nhan/ve-sinh" },
            { id: "rang-mieng", label: "Răng miệng", href: "/cham-soc-ca-nhan/rang-mieng" },
          ],
        },
        {
          kind: "links",
          id: "cscn-needs",
          title: "Theo nhu cầu",
          links: [
            { id: "cho-gia-dinh", label: "Cho gia đình", href: "/nhu-cau/cho-gia-dinh" },
            { id: "du-lich", label: "Du lịch", href: "/nhu-cau/du-lich" },
            { id: "me-va-be", label: "Mẹ & bé", href: "/nhu-cau/me-va-be" },
            { id: "nguoi-cao-tuoi", label: "Người cao tuổi", href: "/nhu-cau/nguoi-cao-tuoi" },
          ],
        },
        {
          kind: "bestSellers",
          id: "cscn-featured",
          title: "Bán chạy",
          href: "/cham-soc-ca-nhan",
          products: BEST_SELLERS_MALE.slice(0, 4),
        },
      ],
    },
  },
  {
    id: "thiet-bi-y-te",
    label: "Thiết bị y tế",
    href: "/thiet-bi-y-te",
    kind: "category",
    mega: {
      id: "mega-thiet-bi-y-te",
      blocks: [
        {
          kind: "links",
          id: "tbyt-main",
          title: "Danh mục chính",
          viewAll: { id: "all-tbyt", label: "Xem tất cả", href: "/thiet-bi-y-te" },
          links: [
            { id: "dung-cu", label: "Dụng cụ y tế", href: "/thiet-bi-y-te/dung-cu" },
            { id: "huyet-ap", label: "Đo huyết áp", href: "/thiet-bi-y-te/huyet-ap" },
            { id: "massage", label: "Máy massage", href: "/thiet-bi-y-te/massage" },
            { id: "kim", label: "Kim các loại", href: "/thiet-bi-y-te/kim" },
          ],
        },
        {
          kind: "links",
          id: "tbyt-needs",
          title: "Theo nhu cầu",
          links: [
            { id: "cham-soc-tai-nha", label: "Chăm sóc tại nhà", href: "/nhu-cau/cham-soc-tai-nha" },
            { id: "theo-doi", label: "Theo dõi sức khỏe", href: "/nhu-cau/theo-doi-suc-khoe" },
            { id: "phuc-hoi", label: "Phục hồi chức năng", href: "/nhu-cau/phuc-hoi" },
            { id: "cho-nguoi-benh", label: "Cho người bệnh", href: "/nhu-cau/cho-nguoi-benh" },
          ],
        },
        {
          kind: "bestSellers",
          id: "tbyt-featured",
          title: "Gợi ý",
          href: "/thiet-bi-y-te",
          products: BEST_SELLERS_MALE.slice(0, 4),
        },
      ],
    },
  },
];

export const STATIC_HEADER_NAV: HeaderNavModel = {
  utility: UTILITY_NAV,
  main: MAIN_NAV,
  source: "static",
};

