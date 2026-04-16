import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Article as ArticleModel } from "@/lib/models/Article";
import { Founder as FounderModel } from "@/lib/models/Founder";
import { Startup as StartupModel } from "@/lib/models/Startup";
import { formatDate } from "@/lib/utils";
import { Search, Clock, MapPin, Building2, FileText, Users, Rocket, ArrowRight } from "lucide-react";

export const revalidate = 0;

interface Props { searchParams: { q?: string } }

async function searchAll(query: string) {
  if (!query.trim()) return { articles: [], founders: [], startups: [], total: 0 };
  const q = query.trim();
  const regex = new RegExp(q, "i");
  await connectDB();
  const [articles, founders, startups] = await Promise.all([
    ArticleModel.find({ $or: [{ title: regex }, { excerpt: regex }, { category: regex }, { author: regex }, { tags: regex }] }).limit(6).lean(),
    FounderModel.find({ $or: [{ name: regex }, { company: regex }, { industry: regex }, { bio: regex }, { location: regex }] }).limit(6).lean(),
    StartupModel.find({ $or: [{ name: regex }, { tagline: regex }, { description: regex }, { industry: regex }, { location: regex }] }).limit(6).lean(),
  ]);
  return {
    articles: articles.map((a: any) => ({ ...a, id: a._id.toString() })),
    founders: founders.map((f: any) => ({ ...f, id: f._id.toString() })),
    startups: startups.map((s: any) => ({ ...s, id: s._id.toString() })),
    total: articles.length + founders.length + startups.length,
  };
}

function Highlight({ text, query }: { text: string; query: string }) {
  if (!query.trim() || !text) return <>{text}</>;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return <>{parts.map((p, i) => parts.length > 1 && i % 2 === 1 ? <mark key={i} className="bg-yellow-200 text-brand-dark px-0.5 rounded">{p}</mark> : p)}</>;
}

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || "";
  const { articles, founders, startups, total } = await searchAll(query);

  return (
    <div className="min-h-screen bg-white">
      {/* Search hero */}
      <div className="bg-brand-dark border-b border-white/10">
        <div className="container-wide py-10">
          <form action="/search" method="GET">
            <div className="relative max-w-2xl mx-auto">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              <input type="search" name="q" defaultValue={query} autoFocus
                placeholder="Search founders, startups, articles..."
                className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-500 pl-11 pr-32 py-4 text-base focus:outline-none focus:border-brand-red transition-colors" />
              <button type="submit"
                className="absolute right-0 top-0 bottom-0 bg-brand-red text-white px-6 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center gap-2">
                Search <ArrowRight size={14} />
              </button>
            </div>
          </form>
          {query && (
            <div className="flex items-center gap-3 mt-4 max-w-2xl mx-auto flex-wrap">
              <p className="text-gray-400 text-sm">
                {total > 0 ? <><span className="text-white font-bold">{total} result{total !== 1 ? "s" : ""}</span> for <span className="text-brand-red font-bold">&ldquo;{query}&rdquo;</span></> : <>No results for <span className="text-brand-red font-bold">&ldquo;{query}&rdquo;</span></>}
              </p>
              <div className="flex gap-2 ml-auto">
                {articles.length > 0 && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 font-bold uppercase">{articles.length} Articles</span>}
                {founders.length > 0 && <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 font-bold uppercase">{founders.length} Founders</span>}
                {startups.length > 0 && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 font-bold uppercase">{startups.length} Startups</span>}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="container-wide py-10">
        {/* Empty state */}
        {!query && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-brand-gray border border-brand-border flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-gray-300" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-dark mb-2">Search Start-Up News</h2>
            <p className="text-gray-400 mb-6">Find founders, startups and articles from Bangladesh's startup ecosystem</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Fintech", "Startup", "Founder", "Agritech", "Dhaka", "EdTech"].map(s => (
                <a key={s} href={`/search?q=${s}`} className="text-xs border border-brand-border px-4 py-2 text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors">{s}</a>
              ))}
            </div>
          </div>
        )}

        {/* No results */}
        {query && total === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-brand-gray border border-brand-border flex items-center justify-center mx-auto mb-4">
              <Search size={28} className="text-gray-300" />
            </div>
            <h2 className="font-serif text-2xl font-bold text-brand-dark mb-2">No results found</h2>
            <p className="text-gray-400 mb-6">Nothing matched &ldquo;{query}&rdquo;. Try a different keyword.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["Fintech", "Startup", "Founder", "Agritech", "Dhaka"].map(s => (
                <a key={s} href={`/search?q=${s}`} className="text-xs border border-brand-border px-4 py-2 text-gray-600 hover:border-brand-red hover:text-brand-red transition-colors">{s}</a>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {total > 0 && (
          <div className="space-y-12">

            {/* Articles */}
            {articles.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-border">
                  <FileText size={16} className="text-brand-red" />
                  <h2 className="font-serif text-xl font-bold text-brand-dark">Articles</h2>
                  <span className="ml-auto text-xs text-gray-400">{articles.length} found</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {articles.map((a: any) => (
                    <Link key={a.id} href={`/articles/${a.slug}`} className="group bg-white border border-brand-border hover:border-brand-red transition-colors block overflow-hidden card-hover">
                      {a.coverImage && (
                        <div className="relative aspect-video overflow-hidden bg-gray-100">
                          <Image src={a.coverImage} alt={a.title} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        </div>
                      )}
                      <div className="p-4">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-red">{a.category}</span>
                        <h3 className="font-serif font-bold text-sm text-brand-dark group-hover:text-brand-red transition-colors mt-1 mb-2 leading-snug line-clamp-2">
                          <Highlight text={a.title} query={query} />
                        </h3>
                        <p className="text-gray-500 text-xs line-clamp-2 mb-3"><Highlight text={a.excerpt} query={query} /></p>
                        <div className="flex items-center gap-2 text-[10px] text-gray-400 border-t border-brand-border pt-2">
                          <span>{a.author}</span><span>·</span>
                          <span>{formatDate(a.publishedAt)}</span><span>·</span>
                          <span className="flex items-center gap-1"><Clock size={9} />{a.readTime}m</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Founders */}
            {founders.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-border">
                  <Users size={16} className="text-brand-red" />
                  <h2 className="font-serif text-xl font-bold text-brand-dark">Founders</h2>
                  <span className="ml-auto text-xs text-gray-400">{founders.length} found</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {founders.map((f: any) => (
                    <Link key={f.id} href={`/founders/${f.slug}`} className="group flex gap-4 p-4 bg-white border border-brand-border hover:border-brand-red transition-colors card-hover">
                      <div className="w-14 h-14 flex-shrink-0 overflow-hidden bg-gray-100">
                        {f.avatar ? <Image src={f.avatar} alt={f.name} width={56} height={56} className="w-full h-full object-cover" /> : (
                          <div className="w-full h-full bg-brand-red flex items-center justify-center">
                            <span className="text-white font-bold">{f.name?.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-red">{f.industry}</span>
                        <h3 className="font-serif font-bold text-sm text-brand-dark group-hover:text-brand-red transition-colors"><Highlight text={f.name} query={query} /></h3>
                        <p className="text-gray-500 text-xs">{f.title}</p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                          <span className="flex items-center gap-1"><Building2 size={9} />{f.company}</span>
                          <span className="flex items-center gap-1"><MapPin size={9} />{f.location}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Startups */}
            {startups.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-brand-border">
                  <Rocket size={16} className="text-brand-red" />
                  <h2 className="font-serif text-xl font-bold text-brand-dark">Startups</h2>
                  <span className="ml-auto text-xs text-gray-400">{startups.length} found</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {startups.map((s: any) => (
                    <Link key={s.id} href={`/startups/${s.slug}`} className="group flex gap-4 p-4 bg-white border border-brand-border hover:border-brand-red transition-colors card-hover">
                      <div className="w-14 h-14 flex-shrink-0 overflow-hidden bg-gray-50 border border-brand-border flex items-center justify-center">
                        {s.logo ? <Image src={s.logo} alt={s.name} width={56} height={56} className="w-full h-full object-contain p-1" /> : (
                          <div className="w-full h-full bg-brand-red flex items-center justify-center">
                            <span className="text-white font-bold">{s.name?.charAt(0)}</span>
                          </div>
                        )}
                      </div>
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-brand-red">{s.industry}</span>
                        <h3 className="font-serif font-bold text-sm text-brand-dark group-hover:text-brand-red transition-colors"><Highlight text={s.name} query={query} /></h3>
                        <p className="text-gray-500 text-xs line-clamp-1"><Highlight text={s.tagline} query={query} /></p>
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                          <span>{s.stage}</span>
                          {s.funding && <span className="text-green-600 font-semibold">{s.funding}</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
