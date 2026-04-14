import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Article as ArticleModel } from "@/lib/models/Article";

async function getArticles() {
  try {
    await connectDB();
    const data = await ArticleModel.find().sort({ publishedAt: -1 }).limit(8).lean();
    return data.map((a: any) => ({ ...a, id: a._id.toString() }));
  } catch { return []; }
}

export default async function HeroSection() {
  const articles = await getArticles();
  if (articles.length === 0) return null;

  const featured = articles.filter((a: any) => a.featured);
  const main = featured[0] ?? articles[0];
  const secondary = featured[1] ?? articles[1];
  const rest = articles.slice(2, 6);

  return (
    <section className="container-wide py-4 lg:py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:gap-6">

        {/* Main featured article */}
        <div className="lg:col-span-2">
          <Link href={`/articles/${main.slug}`} className="group block">
            {/* Image */}
            <div className="relative w-full aspect-[16/9] overflow-hidden bg-gray-100">
              {main.coverImage && (
                <Image src={main.coverImage} alt={main.title} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700" priority />
              )}
            </div>
            {/* Text below image */}
            <div className="bg-white px-0 lg:px-0 pt-4 pb-2">
              <span className="badge-red text-[10px]">{main.category}</span>
              <h1 className="font-serif text-2xl lg:text-4xl font-bold text-gray-900 leading-tight mt-2 mb-3">{main.title}</h1>
              <p className="text-gray-500 text-sm lg:text-base line-clamp-2 mb-3 leading-relaxed">{main.excerpt}</p>
              <div className="flex items-center gap-3 text-gray-400 text-xs border-t border-brand-border pt-3">
                <span className="text-gray-700 font-semibold">{main.author}</span>
                <span>·</span><span>{formatDate(main.publishedAt)}</span>
                <span>·</span><span className="flex items-center gap-1"><Clock size={10} />{main.readTime} min</span>
              </div>
            </div>
          </Link>

          {/* Ad banner */}
          <div className="mt-4">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-1.5 text-center">Advertisement</p>
            <a href="/advertise" className="group relative flex items-center justify-between overflow-hidden bg-brand-dark border border-white/10 px-6 py-4 hover:border-brand-red transition-colors cursor-pointer">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(200,16,46,0.12)_0%,_transparent_60%)] pointer-events-none" />
              <div className="relative flex items-center gap-4">
                <div className="w-9 h-9 bg-brand-red flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-serif font-bold text-sm">SUN</span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm leading-tight">Advertise with Start-Up News</p>
                  <p className="text-gray-500 text-xs mt-0.5">Reach 2M+ Bangladeshi entrepreneurs & investors</p>
                </div>
              </div>
              <div className="relative hidden sm:flex items-center gap-5">
                <div className="text-center"><p className="text-white font-bold text-sm">2M+</p><p className="text-gray-600 text-[10px] uppercase tracking-wider">Readers</p></div>
                <div className="w-px h-7 bg-white/10" />
                <div className="text-center"><p className="text-white font-bold text-sm">500+</p><p className="text-gray-600 text-[10px] uppercase tracking-wider">Founders</p></div>
                <div className="w-px h-7 bg-white/10" />
                <span className="bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-4 py-2 group-hover:bg-red-700 transition-colors whitespace-nowrap">Get Started →</span>
              </div>
            </a>
          </div>
        </div>

        {/* Right sidebar — desktop only */}
        {secondary && (
          <div className="hidden lg:flex flex-col gap-0 border border-brand-border bg-white overflow-hidden">
            <Link href={`/articles/${secondary.slug}`} className="group block relative overflow-hidden flex-shrink-0" style={{ aspectRatio: "16/9" }}>
              {secondary.coverImage && (
                <Image src={secondary.coverImage} alt={secondary.title} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="badge-red mb-2 text-[9px]">{secondary.category}</span>
                <h2 className="font-serif text-sm font-bold text-white leading-snug">{secondary.title}</h2>
              </div>
            </Link>
            <div className="flex flex-col divide-y divide-brand-border flex-1">
              {rest.map((article: any) => (
                <Link key={article.id} href={`/articles/${article.slug}`}
                  className="group flex gap-3 p-3 hover:bg-brand-gray transition-colors flex-1 items-center">
                  <div className="relative w-16 h-14 flex-shrink-0 overflow-hidden bg-gray-100">
                    {article.coverImage && (
                      <Image src={article.coverImage} alt={article.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-brand-red">{article.category}</span>
                    <h3 className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2 group-hover:text-brand-red transition-colors">{article.title}</h3>
                    <span className="text-[10px] text-gray-400">{formatDate(article.publishedAt)}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
