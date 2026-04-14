import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";
import { Clock, ArrowLeft, Share2, Bookmark, Twitter, Linkedin } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Article as ArticleModel } from "@/lib/models/Article";

export const revalidate = 60;

async function getArticle(slug: string) {
  try {
    await connectDB();
    const a = await ArticleModel.findOne({ slug }).lean() as any;
    if (!a) return null;
    return { ...a, id: a._id.toString() };
  } catch { return null; }
}

async function getRelated(category: string, id: string) {
  try {
    await connectDB();
    const data = await ArticleModel.find({ category, _id: { $ne: id } }).limit(3).lean() as any[];
    return data.map((a: any) => ({ ...a, id: a._id.toString() }));
  } catch { return []; }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);
  if (!article) notFound();
  const related = await getRelated(article.category, article.id);

  return (
    <article>
      {/* Hero */}
      <div className="relative h-[45vh] lg:h-[55vh] overflow-hidden bg-gray-900">
        {article.coverImage && (
          <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-wide pb-8">
          <Link href="/articles" className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={13} /> Back to Features
          </Link>
          <span className="badge-red mb-3 text-[9px]">{article.category}</span>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white max-w-3xl leading-tight">{article.title}</h1>
        </div>
      </div>

      {/* Author bar */}
      <div className="border-b border-brand-border bg-white sticky top-16 z-10">
        <div className="container-wide py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {article.authorAvatar && (
              <Image src={article.authorAvatar} alt={article.author} width={32} height={32} className="rounded-full" />
            )}
            <div>
              <p className="font-semibold text-sm text-brand-dark">{article.author}</p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{formatDate(article.publishedAt)}</span>
                <span>·</span>
                <span className="flex items-center gap-1"><Clock size={9} />{article.readTime} min read</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 text-gray-400 hover:text-brand-red transition-colors"><Bookmark size={16} /></button>
            <button className="p-2 text-gray-400 hover:text-brand-red transition-colors"><Share2 size={16} /></button>
            <a href="#" className="p-2 text-gray-400 hover:text-blue-500 transition-colors"><Twitter size={16} /></a>
            <a href="#" className="p-2 text-gray-400 hover:text-blue-700 transition-colors"><Linkedin size={16} /></a>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide py-10">
        <div className="max-w-3xl mx-auto">
          {/* Excerpt */}
          <p className="text-xl text-gray-600 leading-relaxed mb-8 font-serif border-l-4 border-brand-red pl-5">{article.excerpt}</p>

          {/* Article body */}
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            {article.content ? (
              article.content.split("\n\n").map((para: string, i: number) => (
                <p key={i} className="mb-5 text-base leading-relaxed">{para}</p>
              ))
            ) : (
              <p className="text-gray-400 italic">Full article content coming soon.</p>
            )}
          </div>

          {/* Mid-article ad */}
          <div className="my-10">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 text-center">Advertisement</p>
            <a href="/advertise" className="group flex items-center justify-between bg-brand-dark border border-white/10 px-6 py-4 hover:border-brand-red transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-9 h-9 bg-brand-red flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-serif font-bold text-sm">SUN</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">Advertise with Start-Up News</p>
                  <p className="text-gray-500 text-xs mt-0.5">Reach 2M+ Bangladeshi entrepreneurs & investors</p>
                </div>
              </div>
              <span className="hidden sm:block bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2 group-hover:bg-red-700 transition-colors whitespace-nowrap">Get Started →</span>
            </a>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-brand-border">
            {article.tags?.map((tag: string) => (
              <span key={tag} className="badge-gray capitalize text-[10px]">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <div className="bg-brand-gray border-t border-brand-border py-8">
          <div className="container-wide">
            <h3 className="font-serif text-2xl font-bold text-brand-dark mb-6">Related Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r: any) => (
                <Link key={r.id} href={`/articles/${r.slug}`} className="group bg-white border border-brand-border block overflow-hidden card-hover">
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    {r.coverImage && <Image src={r.coverImage} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />}
                  </div>
                  <div className="p-4">
                    <span className="section-label text-[9px]">{r.category}</span>
                    <h4 className="font-serif font-bold text-sm text-brand-dark mt-1 group-hover:text-brand-red transition-colors line-clamp-2">{r.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </article>
  );
}
