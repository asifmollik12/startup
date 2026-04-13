import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";
import { Article } from "@/lib/types";
import { connectDB } from "@/lib/mongodb";
import { Article as ArticleModel } from "@/lib/models/Article";

async function getArticles(): Promise<Article[]> {
  try {
    await connectDB();
    const data = await ArticleModel.find().sort({ publishedAt: -1 }).lean();
    return data.map((a: any) => ({ ...a, id: a._id.toString() }));
  } catch {
    return [];
  }
}

export const revalidate = 60;

export default async function ArticlesPage() {
  const articles = await getArticles();
  const cats = ["All", ...Array.from(new Set(articles.map(a => a.category)))];

  return (
    <div className="section-pad">
      <div className="container-wide">
        <div className="border-b border-brand-border pb-8 mb-10">
          <span className="section-label">Start-Up News</span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-brand-dark mt-2 mb-4">Articles & Stories</h1>
          <p className="text-gray-500 max-w-xl">In-depth reporting on Bangladesh&apos;s most inspiring entrepreneurs, groundbreaking startups, and transformative ideas.</p>
        </div>
        <div className="flex gap-2 flex-wrap mb-10">
          {cats.map((cat) => (
            <span key={cat} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border ${
              cat === "All" ? "bg-brand-red text-white border-brand-red" : "border-brand-border text-gray-600"
            }`}>{cat}</span>
          ))}
        </div>
        {articles.length === 0 ? (
          <div className="text-center py-20 text-gray-400">No articles yet.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article) => (
              <Link key={article.id} href={`/articles/${article.slug}`}
                className="group bg-white border border-brand-border card-hover block overflow-hidden">
                <div className="relative overflow-hidden aspect-video bg-gray-100">
                  {article.coverImage && (
                    <Image src={article.coverImage} alt={article.title} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                  )}
                  {article.featured && <div className="absolute top-3 left-3"><span className="badge-red text-[9px]">Featured</span></div>}
                </div>
                <div className="p-5">
                  <span className="section-label text-[9px]">{article.category}</span>
                  <h2 className="font-serif font-bold text-lg text-brand-dark mt-1 mb-2 leading-snug group-hover:text-brand-red transition-colors">{article.title}</h2>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{article.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-brand-border pt-3">
                    {article.authorAvatar && (
                      <Image src={article.authorAvatar} alt={article.author} width={18} height={18} className="rounded-full" unoptimized />
                    )}
                    <span className="text-gray-600">{article.author}</span>
                    <span>·</span><span>{formatDate(article.publishedAt)}</span>
                    <span>·</span><span className="flex items-center gap-1"><Clock size={9} />{article.readTime}m</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
