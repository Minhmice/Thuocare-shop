import { Footer } from "@/components/layout/footer";
import { HeaderServer } from "@/components/layout/header.server";
import { getNodePageByPath, getNodeProductsByPath } from "@/data/catalog";
import { ProductGrid } from "@/components/catalog/listing/product-grid";
import type { ProductCard } from "@/types/commerce";
import { formatVnd } from "@/lib/money";
import Link from "next/link";

function toProductCard(p: { id: string; name: string; price: number | null; thumbnailUrl: string | null }): ProductCard {
  return {
    id: p.id,
    title: p.name,
    imageUrl: p.thumbnailUrl ?? undefined,
    price: { amount: p.price ?? 0, display: formatVnd(p.price ?? 0) },
  };
}

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ topLevel: string }>;
  searchParams: Promise<{ page?: string; pageSize?: string; sort?: string }>;
}) {
  const { topLevel } = await params;
  const { page, pageSize, sort } = await searchParams;
  const routePath = `/${topLevel}`;
  const data = await getNodePageByPath(routePath);
  const pageNum = Math.max(1, Number(page ?? "1") || 1);
  const sizeNum = Math.min(96, Math.max(1, Number(pageSize ?? "24") || 24));
  const sortKey = (sort === "newest" || sort === "price_asc" || sort === "price_desc" || sort === "featured") ? sort : "featured";
  const listing = await getNodeProductsByPath({ routePath, page: pageNum, pageSize: sizeNum, sort: sortKey });

  if (!data) {
    return (
      <main className="min-h-screen bg-[color:var(--lc-surface)]">
        <HeaderServer />
        <div className="mx-auto max-w-[1200px] px-3 py-10 sm:px-4">
          <div className="rounded-2xl border bg-white p-6 text-sm text-slate-700">Category not found.</div>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <HeaderServer />
      <div className="mx-auto max-w-[1200px] px-3 py-8 sm:px-4">
        <h1 className="text-2xl font-extrabold text-slate-900">{data.node.heroTitle ?? data.node.name}</h1>
        {data.node.heroDescription ?? data.node.description ? (
          <p className="mt-2 max-w-[75ch] text-sm text-slate-600">{data.node.heroDescription ?? data.node.description}</p>
        ) : null}

        {data.children.length ? (
          <div className="mt-6 rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
            <div className="text-sm font-semibold text-slate-900">Danh mục</div>
            <div className="mt-3 flex flex-wrap gap-2">
              {data.children.map((c) => (
                <a
                  key={c.id}
                  href={c.routePath}
                  className="rounded-full border bg-white px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-50"
                >
                  {c.name}
                </a>
              ))}
            </div>
          </div>
        ) : null}

        {listing ? (
          <div className="mt-6 rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
            <div className="flex items-end justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-900">Danh sách sản phẩm</div>
                <div className="mt-1 text-xs text-slate-500">
                  {listing.totalCount.toLocaleString("vi-VN")} sản phẩm • Trang {listing.page} /{" "}
                  {Math.max(1, Math.ceil(listing.totalCount / listing.pageSize))}
                </div>
              </div>
            </div>

            <div className="mt-4">
              <ProductGrid
                products={listing.items.map(toProductCard)}
                linksById={Object.fromEntries(listing.items.map((it) => [it.id, it.routePath]))}
              />
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Link
                href={`/${topLevel}?page=${Math.max(1, listing.page - 1)}&pageSize=${listing.pageSize}&sort=${sortKey}`}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${listing.page <= 1 ? "pointer-events-none opacity-50" : "hover:bg-slate-50"}`}
              >
                Trang trước
              </Link>
              <Link
                href={`/${topLevel}?page=${listing.page + 1}&pageSize=${listing.pageSize}&sort=${sortKey}`}
                className={`rounded-full border px-4 py-2 text-sm font-semibold ${
                  listing.page >= Math.ceil(listing.totalCount / listing.pageSize) ? "pointer-events-none opacity-50" : "hover:bg-slate-50"
                }`}
              >
                Trang sau
              </Link>
            </div>
          </div>
        ) : null}
      </div>
      <Footer />
    </main>
  );
}

