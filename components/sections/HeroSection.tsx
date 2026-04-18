import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Clock } from "lucide-react";
import { connectDB } from "@/lib/mongodb";
import { Article as ArticleModel } from "@/lib/models/Article";
import InlineAdBanner from "@/components/sections/InlineAdBanner";

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
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  quality={95}
                  className="object-cover group-hover:scale-105 transition-transform duration-700" priority />
              )}
            </div>
            {/* Text below image */}
            <div className="bg-white px-0 lg:px-0 pt-4 pb-2">
              <span className="badge-red text-[10px]">{main.category}</span>
              <h1 className="font-serif text-2xl lg:text-4xl font-bold text-gray-900 leading-tight mt-2 mb-3">{main.title}</h1>
              <p className="text-gray-500 text-sm lg:text-base line-clamp-2 leading-relaxed">
                {main.excerpt} <span className="text-gray-400 text-xs ml-1">{formatDate(main.publishedAt)}</span>
              </p>
            </div>
          </Link>

          {/* Ad banner — managed from admin */}
          <div className="mt-4">
            <InlineAdBanner placement="Homepage Hero" fullSize />
          </div>
        </div>

        {/* Right sidebar — desktop only */}
        {secondary && (
          <div className="hidden lg:flex flex-col gap-0 border border-brand-border bg-white overflow-hidden">
            <Link href={`/articles/${secondary.slug}`} className="group block relative overflow-hidden flex-shrink-0" style={{ aspectRatio: "16/9" }}>
              {secondary.coverImage && (
                <Image src={secondary.coverImage} alt={secondary.title} fill
                  sizes="33vw"
                  quality={90}
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
                        sizes="64px"
                        quality={85}
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
