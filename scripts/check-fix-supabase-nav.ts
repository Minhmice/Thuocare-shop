import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

type CatalogNodeUpsert = {
  node_type: string;
  parent_id: string | null;
  name: string;
  slug: string;
  full_slug: string;
  route_path: string;
  description?: string | null;
  nav_description?: string | null;
  sort_order: number;
  is_active: boolean;
  is_visible_in_nav: boolean;
};

async function main() {
  const url = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing env: SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)");
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SERVICE_SUPABASESERVICE_KEY;
  if (!serviceKey) throw new Error("Missing env: SUPABASE_SERVICE_ROLE_KEY (or SERVICE_SUPABASESERVICE_KEY)");
  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { data: before, error: beforeErr } = await supabase.rpc("get_header_navigation");
  if (beforeErr) throw beforeErr;
  console.log("RPC get_header_navigation() before:", JSON.stringify(before, null, 2));

  const topNodes: CatalogNodeUpsert[] = [
    {
      node_type: "category_top",
      parent_id: null,
      name: "Thực phẩm chức năng",
      slug: "thuc-pham-chuc-nang",
      full_slug: "thuc-pham-chuc-nang",
      route_path: "/thuc-pham-chuc-nang",
      description: "Hỗ trợ sức khỏe và bổ sung dinh dưỡng mỗi ngày.",
      nav_description: "Bổ sung dinh dưỡng, nâng cao sức khỏe.",
      sort_order: 1,
      is_active: true,
      is_visible_in_nav: true,
    },
    {
      node_type: "category_top",
      parent_id: null,
      name: "Dược mỹ phẩm",
      slug: "duoc-my-pham",
      full_slug: "duoc-my-pham",
      route_path: "/duoc-my-pham",
      description: "Chăm sóc da, tóc và cơ thể với sản phẩm chọn lọc.",
      nav_description: "Chăm sóc da, làm đẹp an toàn.",
      sort_order: 2,
      is_active: true,
      is_visible_in_nav: true,
    },
    {
      node_type: "category_top",
      parent_id: null,
      name: "Thuốc",
      slug: "thuoc",
      full_slug: "thuoc",
      route_path: "/thuoc",
      description: "Tra cứu và chọn thuốc theo nhóm bệnh/lưu ý sử dụng.",
      nav_description: "Thuốc theo nhóm bệnh và hoạt chất.",
      sort_order: 3,
      is_active: true,
      is_visible_in_nav: true,
    },
    {
      node_type: "category_top",
      parent_id: null,
      name: "Chăm sóc cá nhân",
      slug: "cham-soc-ca-nhan",
      full_slug: "cham-soc-ca-nhan",
      route_path: "/cham-soc-ca-nhan",
      description: "Sản phẩm thiết yếu hằng ngày, tiện lợi và dễ chọn.",
      nav_description: "Vệ sinh, chăm sóc cá nhân.",
      sort_order: 4,
      is_active: true,
      is_visible_in_nav: true,
    },
    {
      node_type: "category_top",
      parent_id: null,
      name: "Thiết bị y tế",
      slug: "thiet-bi-y-te",
      full_slug: "thiet-bi-y-te",
      route_path: "/thiet-bi-y-te",
      description: "Dụng cụ theo dõi sức khỏe và chăm sóc tại nhà.",
      nav_description: "Dụng cụ y tế tại nhà.",
      sort_order: 5,
      is_active: true,
      is_visible_in_nav: true,
    },
  ];

  // Upsert by route_path.
  const { error: upsertErr } = await supabase
    .from("catalog_nodes")
    .upsert(topNodes, { onConflict: "route_path" });
  if (upsertErr) throw upsertErr;

  const { data: after, error: afterErr } = await supabase.rpc("get_header_navigation");
  if (afterErr) throw afterErr;
  console.log("RPC get_header_navigation() after:", JSON.stringify(after, null, 2));
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

