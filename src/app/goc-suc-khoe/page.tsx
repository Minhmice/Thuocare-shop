import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { HeaderServer } from "@/components/layout/header.server";
import { getFeaturedArticle } from "@/data/articles";

export default async function Page() {
  const featured = await getFeaturedArticle();
  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <HeaderServer />
      <div className="mx-auto max-w-[900px] px-3 py-8 sm:px-4">
        <div className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-2xl font-extrabold text-slate-900">Góc sức khỏe</h1>
          <p className="mt-2 text-sm text-slate-600">Bài viết, kiến thức, tư vấn dược sĩ.</p>

          {featured ? (
            <div className="mt-6 rounded-2xl border bg-(--lc-surface) p-4">
              <div className="text-xs font-semibold text-slate-600">Bài viết nổi bật</div>
              <div className="mt-2 text-lg font-extrabold text-slate-900">{featured.title}</div>
              {featured.excerpt ? <div className="mt-2 text-sm text-slate-600">{featured.excerpt}</div> : null}
              <div className="mt-4">
                <Link className="text-sm font-semibold text-(--lc-blue-700) hover:underline" href={`/goc-suc-khoe/${featured.slug}`}>
                  Đọc tiếp →
                </Link>
              </div>
            </div>
          ) : (
            <div className="mt-6 text-sm text-slate-600">Chưa có bài viết.</div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

