import { Footer } from "@/components/layout/footer";
import { HeaderServer } from "@/components/layout/header.server";
import { getArticleBySlug } from "@/data/articles";

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  return (
    <main className="min-h-screen bg-[color:var(--lc-surface)]">
      <HeaderServer />
      <div className="mx-auto max-w-[900px] px-3 py-8 sm:px-4">
        <article className="rounded-3xl border bg-white p-5 shadow-sm sm:p-7">
          <h1 className="text-2xl font-extrabold leading-tight text-slate-900">{article?.title ?? "Góc sức khỏe"}</h1>
          {article?.excerpt ? <p className="mt-3 text-sm text-slate-600">{article.excerpt}</p> : null}
          <div className="mt-6">
            {article?.content_html ? (
              <div className="prose prose-slate max-w-none" dangerouslySetInnerHTML={{ __html: article.content_html }} />
            ) : (
              <div className="text-sm text-slate-600">Article not found.</div>
            )}
          </div>
        </article>
      </div>
      <Footer />
    </main>
  );
}

