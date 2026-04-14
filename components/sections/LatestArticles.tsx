import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Clock, ArrowRight } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Article as ArticleModel } from "@/lib/models/Article";

async function getArticles() {
  try {
    await connectDB();
    const data = await ArticleModel.find().sort({ publishedAt: -1 }).limit(6).lean();
    return data.map((a: any) => ({ ...a, id: a._id.toString() }));
  } catch { return []; }
}

export default async function LatestArticles() {
  const articles = await getArticles();

  return (
    <section className="section-pad bg-brand-gray border-t border-brand-border">
      <div className="container-wide">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="section-label">Latest</span>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-brand-dark mt-1">Recent Stories</h2>
            <div className="divider-red mt-3" />
          </div>
          <Link href="/articles" className="hidden sm:flex items-center gap-2 text-xs text-gray-500 hover:text-brand-red transition-colors uppercase tracking-wider">
            All Features <ArrowRight size={13} />
          </Link>
        </div>
        {articles.length === 0 ? (
          <p className="text-gray-400 text-center py-10">No articles yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article: any) => (
              <Link key={article.id} href={`/articles/${article.slug}`}
                className="group bg-white border border-brand-border card-hover block overflow-hidden">
                <div className="relative overflow-hidden aspect-video bg-gray-100">
                  {article.coverImage && (
                    <Image src={article.coverImage} alt={article.title} fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                </div>
                <div className="p-5">
                  <span className="section-label text-[9px]">{article.category}</span>
                  <h3 className="font-serif font-bold text-base text-brand-dark mt-1 mb-2 leading-snug group-hover:text-brand-red transition-colors line-clamp-2">{article.title}</h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-4">{article.excerpt}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-400 border-t border-brand-border pt-3">
                    {article.authorAvatar && <Image src={article.authorAvatar} alt={article.author} width={18} height={18} className="rounded-full" />}
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
    </section>
  );
}
