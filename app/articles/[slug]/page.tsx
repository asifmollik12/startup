import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { articles } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Clock, ArrowLeft, Share2, Bookmark, Twitter, Linkedin } from "lucide-react";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) notFound();
  const related = articles.filter((a) => a.id !== article.id && a.category === article.category).slice(0, 3);

  return (
    <article>
      <div className="relative h-[50vh] lg:h-[60vh] overflow-hidden">
        <Image src={article.coverImage} alt={article.title} fill className="object-cover" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 container-wide pb-10">
          <Link href="/articles" className="inline-flex items-center gap-2 text-gray-300 hover:text-white text-sm mb-4 transition-colors">
            <ArrowLeft size={13} /> Back to Articles
          </Link>
          <span className="badge-red mb-3 text-[9px]">{article.category}</span>
          <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white max-w-3xl leading-tight">{article.title}</h1>
        </div>
      </div>

      <div className="border-b border-brand-border bg-white sticky top-16 z-10">
        <div className="container-wide py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src={article.authorAvatar} alt={article.author} width={32} height={32} className="rounded-full" />
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
            <button className="p-2 text-gray-400 hover:text-brand-red transition-colors" aria-label="Bookmark"><Bookmark size={16} /></button>
            <button className="p-2 text-gray-400 hover:text-brand-red transition-colors" aria-label="Share"><Share2 size={16} /></button>
            <a href="#" className="p-2 text-gray-400 hover:text-blue-500 transition-colors" aria-label="Twitter"><Twitter size={16} /></a>
            <a href="#" className="p-2 text-gray-400 hover:text-blue-700 transition-colors" aria-label="LinkedIn"><Linkedin size={16} /></a>
          </div>
        </div>
      </div>

      <div className="container-wide py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-xl text-gray-600 leading-relaxed mb-8 font-serif border-l-4 border-brand-red pl-5">{article.excerpt}</p>
          <div className="space-y-5 text-gray-700 leading-relaxed text-base">
            <p>Bangladesh&apos;s entrepreneurial ecosystem has undergone a remarkable transformation over the past decade. What was once a landscape dominated by traditional industries has evolved into a vibrant hub of innovation, attracting global attention and investment.</p>
            <p>The story of this transformation is best told through the founders who dared to dream differently — who saw not just the challenges of a developing nation, but the immense opportunities that lay within them.</p>
            <p>From mobile financial services to agritech, from e-commerce to edtech, Bangladeshi entrepreneurs are solving real problems at scale.</p>

            {/* Mid-article ad */}
            <div className="my-8">
              <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 text-center">Advertisement</p>
              <a href="/advertise"
                className="group relative flex items-center justify-between overflow-hidden bg-brand-dark border border-white/10 px-6 py-4 hover:border-brand-red transition-colors cursor-pointer">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(200,16,46,0.12)_0%,_transparent_60%)] pointer-events-none" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                <div className="relative flex items-center gap-4">
                  <div className="w-9 h-9 bg-brand-red flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-serif font-bold text-sm">SUN</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">Advertise with Start-Up News</p>
                    <p className="text-gray-500 text-xs mt-0.5">Reach 2M+ Bangladeshi entrepreneurs & investors</p>
                  </div>
                </div>
                <span className="relative hidden sm:block bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2 group-hover:bg-red-700 transition-colors whitespace-nowrap">
                  Get Started →
                </span>
              </a>
            </div>

            <blockquote className="border-l-4 border-brand-red pl-6 py-4 my-8 bg-brand-gray">
              <p className="font-serif text-xl text-brand-dark italic leading-relaxed">
                &ldquo;The best entrepreneurs don&apos;t just build companies — they build ecosystems that lift entire communities.&rdquo;
              </p>
            </blockquote>
            <p>As we look ahead, the next wave of Bangladeshi innovation is already taking shape. Young founders, many of them under 30, are tackling climate change, healthcare access, and financial inclusion with tools that simply didn&apos;t exist five years ago.</p>
            <p>The question is no longer whether Bangladesh can produce world-class entrepreneurs. It already has. The question now is how the ecosystem can accelerate what is already an extraordinary momentum.</p>
          </div>

          {/* Post-article ad */}
          <div className="mt-10">
            <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 text-center">Sponsored</p>
            <a href="/advertise"
              className="group relative flex flex-col sm:flex-row items-center gap-5 overflow-hidden bg-brand-gray border border-brand-border px-6 py-5 hover:border-brand-red transition-colors cursor-pointer">
              <div className="w-12 h-12 bg-brand-dark flex items-center justify-center flex-shrink-0">
                <span className="text-white font-serif font-bold">SUN</span>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-semibold text-brand-dark text-sm">Grow your brand with Start-Up News</p>
                <p className="text-gray-500 text-xs mt-0.5">Premium placements across Bangladesh&apos;s #1 startup media platform</p>
              </div>
              <span className="sm:ml-auto border border-brand-dark text-brand-dark text-xs font-bold uppercase tracking-wider px-5 py-2 group-hover:bg-brand-dark group-hover:text-white transition-colors whitespace-nowrap">
                Learn More →
              </span>
            </a>
          </div>
          <div className="flex flex-wrap gap-2 mt-10 pt-8 border-t border-brand-border">
            {article.tags.map((tag) => (
              <span key={tag} className="badge-gray capitalize text-[10px]">{tag}</span>
            ))}
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="bg-brand-gray border-t border-brand-border section-pad">
          <div className="container-wide">
            <h3 className="font-serif text-2xl font-bold text-brand-dark mb-8">Related Stories</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {related.map((r) => (
                <Link key={r.id} href={`/articles/${r.slug}`} className="group bg-white border border-brand-border block overflow-hidden card-hover">
                  <div className="relative aspect-video overflow-hidden">
                    <Image src={r.coverImage} alt={r.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
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
