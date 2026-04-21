import type { ProductCard } from "@/types/commerce";

export type LongChauNavIconKey =
  | "vitamins"
  | "shield"
  | "hormones"
  | "eye"
  | "stomach"
  | "brain"
  | "sparkles"
  | "droplet"
  | "heart"
  | "lungs"
  | "bones"
  | "face"
  | "body"
  | "skin"
  | "hair"
  | "makeup"
  | "eyeCare"
  | "leaf"
  | "pill"
  | "flask"
  | "mortar"
  | "syringe"
  | "bandage"
  | "activity"
  | "family"
  | "shopping"
  | "drops"
  | "stethoscope"
  | "ribbon"
  | "badge"
  | "megaphone"
  | "star";

export type LongChauNavTile = {
  id: string;
  label: string;
  icon: LongChauNavIconKey;
  href?: string;
};

export type LongChauNavSidebarItem = {
  id: string;
  label: string;
  icon: LongChauNavIconKey;
  tiles: LongChauNavTile[];
  bestSellers: ProductCard[];
};

export type LongChauNavPanel = {
  id: string;
  sidebar: LongChauNavSidebarItem[];
};

export type LongChauTopNavItem = {
  id: string;
  label: string;
  href?: string;
  panel?: LongChauNavPanel;
};

function vnd(amount: number): { amount: number; display: string } {
  const display = `${amount.toLocaleString("vi-VN")}đ`;
  return { amount, display };
}

const BEST_SELLERS_MALE: ProductCard[] = [
  {
    id: "male-1",
    title: "Viên uống bổ sung lợi khuẩn, D-mannose, việt quất…",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/placeholder_product_1_eb3c1b4d55.png",
    price: vnd(685000),
    unit: "Hộp",
  },
  {
    id: "male-2",
    title: "Viên uống hỗ trợ bổ thận, tăng cường sinh lực Sâm Nhung…",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/sam_nhung_bo_than_nv_hai_linh_30v_321_0_30b8d2a1e0.png",
    price: vnd(125000),
    unit: "Hộp",
  },
  {
    id: "male-3",
    title: "Viên uống hỗ trợ tăng cường sinh lý và tăng khả năng…",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/placeholder_product_2_45c1b01e65.png",
    price: vnd(1300000),
    unit: "Hộp",
  },
  {
    id: "male-4",
    title: "Viên uống hỗ trợ tăng sinh lý nữ, tăng cường nội tiết tố…",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/placeholder_product_3_5b2f3c6bb0.png",
    price: vnd(660000),
    unit: "Hộp",
  },
  {
    id: "male-5",
    title: "Viên uống giúp bổ thận, tráng dương, tăng cường sinh lực…",
    imageUrl:
      "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/placeholder_product_4_79a1ea8f0c.png",
    price: vnd(660000),
    unit: "Hộp",
  },
];

const BEST_SELLERS_SKIN: ProductCard[] = [
  {
    id: "skin-1",
    title: "Kem chống nắng nâng tông nhẹ Sắc Ngọc Khang SPF…",
    imageUrl: "",
    price: vnd(166000),
    unit: "Hộp",
  },
  {
    id: "skin-2",
    title: "Tinh chất dưỡng ẩm, sáng da Pax Moly Blemish C…",
    imageUrl: "",
    badge: "-20%",
    price: vnd(240000),
    compareAt: vnd(300000),
    unit: "Hộp",
  },
  {
    id: "skin-3",
    title: "Sữa rửa mặt thảo dược sáng da, mờ thâm Sắc Ngọc…",
    imageUrl: "",
    price: vnd(69000),
    unit: "Tuýp",
  },
  {
    id: "skin-4",
    title: "Kem dưỡng trắng da 5 in 1 SPF25/PA++ Sắc Ngọc Khang…",
    imageUrl: "",
    price: vnd(250000),
    unit: "Hộp",
  },
  {
    id: "skin-5",
    title: "Sữa rửa mặt ngừa mụn On: The Body Rice Therapy Ric…",
    imageUrl: "",
    price: vnd(165000),
    unit: "Tuýp",
  },
];

export const LONGCHAU_TOP_NAV: LongChauTopNavItem[] = [
  {
    id: "tpcn",
    label: "Thực phẩm chức năng",
    panel: {
      id: "panel-tpcn",
      sidebar: [
        {
          id: "vitamins",
          label: "Vitamin & Khoáng chất",
          icon: "vitamins",
          tiles: [
            { id: "canxi", label: "Canxi", icon: "star" },
            { id: "omega3", label: "Omega 3", icon: "droplet" },
            { id: "vitaminC", label: "Vitamin C", icon: "sparkles" },
            { id: "multivit", label: "Đa vitamin", icon: "badge" },
            { id: "xem-them", label: "Xem thêm", icon: "shopping" },
          ],
          bestSellers: BEST_SELLERS_MALE,
        },
        {
          id: "immune",
          label: "Miễn dịch - Đề kháng",
          icon: "shield",
          tiles: [
            { id: "tang-de-khang", label: "Tăng đề kháng", icon: "shield" },
            { id: "tre-em", label: "Cho trẻ em", icon: "family" },
            { id: "nguoi-lon", label: "Cho người lớn", icon: "badge" },
            { id: "xem-them", label: "Xem thêm", icon: "shopping" },
          ],
          bestSellers: BEST_SELLERS_MALE,
        },
        {
          id: "hormones",
          label: "Sinh lý - Nội tiết tố",
          icon: "hormones",
          tiles: [
            { id: "sinh-ly-nam", label: "Sinh lý nam", icon: "activity" },
            { id: "can-bang-noi-tiet", label: "Cân bằng nội tiết tố", icon: "flask" },
            { id: "sinh-ly-nu", label: "Sinh lý nữ", icon: "heart" },
            { id: "tien-man-kinh", label: "Tiền mãn kinh - mãn kinh", icon: "ribbon" },
          ],
          bestSellers: BEST_SELLERS_MALE,
        },
        {
          id: "eye",
          label: "Mắt - Thị lực",
          icon: "eye",
          tiles: [
            { id: "bo-sung-mat", label: "Bổ sung cho mắt", icon: "eye" },
            { id: "xem-them", label: "Xem thêm", icon: "shopping" },
          ],
          bestSellers: BEST_SELLERS_MALE,
        },
        {
          id: "digest",
          label: "Tiêu hóa",
          icon: "stomach",
          tiles: [
            { id: "probiotic", label: "Men vi sinh", icon: "flask" },
            { id: "da-day", label: "Dạ dày", icon: "stomach" },
            { id: "xem-them", label: "Xem thêm", icon: "shopping" },
          ],
          bestSellers: BEST_SELLERS_MALE,
        },
      ],
    },
  },
  {
    id: "duoc-my-pham",
    label: "Dược mỹ phẩm",
    panel: {
      id: "panel-duoc-my-pham",
      sidebar: [
        {
          id: "face",
          label: "Chăm sóc da mặt",
          icon: "face",
          tiles: [
            { id: "sua-rua-mat", label: "Sữa rửa mặt (kem, gel, sữa)", icon: "droplet" },
            { id: "kem-chong-nang", label: "Kem chống nắng da mặt", icon: "sparkles" },
            { id: "duong-da", label: "Dưỡng da mặt", icon: "sparkles" },
            { id: "mat-na", label: "Mặt nạ", icon: "leaf" },
            { id: "serum", label: "Serum, Essence hoặc Ampoule", icon: "flask" },
            { id: "xem-them", label: "Xem thêm", icon: "shopping" },
          ],
          bestSellers: BEST_SELLERS_SKIN,
        },
        {
          id: "body",
          label: "Chăm sóc cơ thể",
          icon: "body",
          tiles: [
            { id: "sua-tam", label: "Sữa tắm", icon: "droplet" },
            { id: "duong-the", label: "Dưỡng thể", icon: "sparkles" },
            { id: "xem-them", label: "Xem thêm", icon: "shopping" },
          ],
          bestSellers: BEST_SELLERS_SKIN,
        },
        {
          id: "hair",
          label: "Chăm sóc tóc - da đầu",
          icon: "hair",
          tiles: [
            { id: "dau-goi", label: "Dầu gội", icon: "droplet" },
            { id: "duong-toc", label: "Dưỡng tóc", icon: "sparkles" },
            { id: "xem-them", label: "Xem thêm", icon: "shopping" },
          ],
          bestSellers: BEST_SELLERS_SKIN,
        },
      ],
    },
  },
  {
    id: "thuoc",
    label: "Thuốc",
    panel: {
      id: "panel-thuoc",
      sidebar: [
        {
          id: "tra-cuu-thuoc",
          label: "Tra cứu thuốc",
          icon: "pill",
          tiles: [
            { id: "khang-sinh", label: "Thuốc kháng sinh, kháng nấm", icon: "pill" },
            { id: "ung-thu", label: "Thuốc điều trị ung thư", icon: "ribbon" },
            { id: "tim-mach", label: "Thuốc tim mạch & máu", icon: "heart" },
            { id: "than-kinh", label: "Thuốc thần kinh", icon: "brain" },
            { id: "tieu-hoa", label: "Thuốc tiêu hoá & gan mật", icon: "stomach" },
          ],
          bestSellers: BEST_SELLERS_MALE,
        },
      ],
    },
  },
  {
    id: "cham-soc-ca-nhan",
    label: "Chăm sóc cá nhân",
    panel: {
      id: "panel-cham-soc-ca-nhan",
      sidebar: [
        {
          id: "support-sex",
          label: "Hỗ trợ tình dục",
          icon: "activity",
          tiles: [
            { id: "bao-cao-su", label: "Bao cao su", icon: "activity" },
            { id: "gel-boi-tron", label: "Gel bôi trơn", icon: "droplet" },
          ],
          bestSellers: [
            {
              id: "sex-1",
              title: "Bao cao su Okamoto Crown kích cỡ nhỏ, siêu…",
              imageUrl:
                "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/placeholder_condom_1_53fd2e9f8b.png",
              badge: "-5%",
              price: vnd(53200),
              compareAt: vnd(56000),
              unit: "Hộp",
            },
            {
              id: "sex-2",
              title: "Bao cao su Sagami Classic siêu mỏng, nhiều chất bôi trơn…",
              imageUrl:
                "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/placeholder_condom_2_2f6d8bb6a7.png",
              badge: "-10%",
              price: vnd(133200),
              compareAt: vnd(148000),
              unit: "Hộp",
            },
            {
              id: "sex-3",
              title: "Bao cao su Sagami Love Me Gold siêu mỏng, trơn, không…",
              imageUrl:
                "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/placeholder_condom_3_9b13de3c3b.png",
              badge: "-25%",
              price: vnd(67500),
              compareAt: vnd(90000),
              unit: "Hộp",
            },
            {
              id: "sex-4",
              title: "Bao cao su Safefit Freezer Max S52 chưa nhiều gel lắ…",
              imageUrl:
                "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/placeholder_condom_4_7bf58b6f45.png",
              badge: "-10%",
              price: vnd(44100),
              compareAt: vnd(49000),
              unit: "Hộp",
            },
            {
              id: "sex-5",
              title: "Bao cao su Safefit 003 S52 siêu mỏng, không gây kích ứn…",
              imageUrl:
                "https://cdn.nhathuoclongchau.com.vn/unsafe/256x0/filters:quality(90):format(webp)/placeholder_condom_5_8745ef6a31.png",
              badge: "-10%",
              price: vnd(53100),
              compareAt: vnd(59000),
              unit: "Hộp",
            },
          ],
        },
        {
          id: "family",
          label: "Đồ dùng gia đình",
          icon: "family",
          tiles: [
            { id: "ve-sinh-ca-nhan", label: "Vệ sinh cá nhân", icon: "droplet" },
            { id: "cham-soc-rang", label: "Chăm sóc răng miệng", icon: "sparkles" },
            { id: "hang-tong-hop", label: "Hàng tổng hợp", icon: "shopping" },
          ],
          bestSellers: BEST_SELLERS_MALE,
        },
      ],
    },
  },
  { id: "tiem-chung", label: "Tiêm chủng", href: "#" },
  {
    id: "thiet-bi-y-te",
    label: "Thiết bị y tế",
    panel: {
      id: "panel-thiet-bi-y-te",
      sidebar: [
        {
          id: "dung-cu-y-te",
          label: "Dụng cụ y tế",
          icon: "stethoscope",
          tiles: [
            { id: "ve-sinh-mui", label: "Dụng cụ vệ sinh mũi", icon: "drops" },
            { id: "kim", label: "Kim các loại", icon: "syringe" },
            { id: "massage", label: "Máy massage", icon: "activity" },
            { id: "tui-chuom", label: "Túi chườm", icon: "bandage" },
            { id: "vo-gian", label: "Vớ giãn tĩnh mạch", icon: "activity" },
            { id: "xem-them", label: "Xem thêm", icon: "shopping" },
          ],
          bestSellers: BEST_SELLERS_MALE,
        },
      ],
    },
  },
  {
    id: "benh-goc-suc-khoe",
    label: "Bệnh & Góc sức khỏe",
    panel: {
      id: "panel-benh-goc-suc-khoe",
      sidebar: [
        {
          id: "health-corner",
          label: "Bệnh & Góc sức khỏe",
          icon: "heart",
          tiles: [
            { id: "goc-suc-khoe", label: "Góc sức khỏe", icon: "heart" },
            { id: "chuyen-trang-ung-thu", label: "Chuyên trang ung thư", icon: "ribbon" },
            { id: "benh-thuong-gap", label: "Bệnh thường gặp", icon: "badge" },
            { id: "tin-khuyen-mai", label: "Tin khuyến mại", icon: "megaphone" },
            { id: "truyen-thong", label: "Truyền Thông", icon: "star" },
          ],
          bestSellers: BEST_SELLERS_MALE,
        },
      ],
    },
  },
  { id: "he-thong-nha-thuoc", label: "Hệ thống nhà thuốc", href: "#" },
];

