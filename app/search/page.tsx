import Image from "next/image";
import Link from "next/link";
import { articles, founders, startups } from "@/lib/data";
import { formatDate } from "@/lib/utils";
import { Search, Clock, MapPin, Building2, FileText, Users, Rocket } from "lucide-react";

interface Props {
  searchParams: { q?: string };
}

function searchAll(query: string) {
  const q = query.toLowerCase().trim();
  if (!q) return { articles: [], founders: [], startups: [], total: 0 };

  const matchedArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.excerpt.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      a.author.toLowerCase().includes(q) ||
      a.tags.some((t) => t.toLowerCase().includes(q))
  );

  const matchedFounders = founders.filter(
    (f) =>
      f.name.toLowerCase().includes(q) ||
      f.company.toLowerCase().includes(q) ||
      f.industry.toLowerCase().includes(q) ||
      f.bio.toLowerCase().includes(q) ||
      f.location.toLowerCase().includes(q)
  );

  const matchedStartups = startups.filter(
    (s) =>
      s.name.toLowerCase().includes(q) ||
      s.tagline.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.industry.toLowerCase().includes(q) ||
      s.location.toLowerCase().includes(q) ||
      s.founders.some((f) => f.toLowerCase().includes(q))
  );

  return {
    articles: matchedArticles,
    founders: matchedFounders,
    startups: matchedStartups,
    total: matchedArticles.length + matchedFounders.length + matchedStartups.length,
  };
}

function highlight(text: string, query: string) {
  if (!query.trim()) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 text-brand-dark rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default function SearchPage({ searchParams }: Props) {
  const query = searchParams.q || "";
  const { articles: matchedArticles, founders: matchedFounders, startups: matchedStartups, total } = searchAll(query);

  return (
    <div className="section-pad">
      <div className="container-wide">
        {/* Search header */}
        <div className="mb-10">
          <form action="/search" method="GET">
            <div className="relative max-w-2xl">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder="Search founders, startups, articles..."
                className="w-full bg-brand-surface border-2 border-brand-border focus:border-brand-red text-white placeholder-brand-muted pl-12 pr-4 py-4 text-base focus:outline-none transition-colors"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-0 top-0 bottom-0 bg-brand-red text-white px-6 font-semibold hover:bg-red-800 transition-colors"
              >
                Search
              </button>
            </div>
          </form>

          {query && (
            <div className="mt-4 flex items-center gap-3 flex-wrap">
              <p className="text-brand-muted text-sm">
                {total > 0 ? (
                  <>
                    Found <span className="font-bold text-brand-dark">{total} result{total !== 1 ? "s" : ""}</span> for{" "}
                    <span className="font-bold text-brand-red">&ldquo;{query}&rdquo;</span>
                  </>
                ) : (
                  <>
                    No results for <span className="font-bold text-brand-red">&ldquo;{query}&rdquo;</span>
                  </>
                )}
              </p>
              {total > 0 && (
                <div className="flex gap-2 flex-wrap">
                  {matchedArticles.length > 0 && (
                    <a href="#articles" className="badge bg-blue-100 text-blue-700 text-[10px]">
                      {matchedArticles.length} Article{matchedArticles.length !== 1 ? "s" : ""}
                    </a>
                  )}
                  {matchedFounders.length > 0 && (
                    <a href="#founders" className="badge bg-green-100 text-green-700 text-[10px]">
                      {matchedFounders.length} Founder{matchedFounders.length !== 1 ? "s" : ""}
                    </a>
                  )}
                  {matchedStartups.length > 0 && (
                    <a href="#startups" className="badge bg-purple-100 text-purple-700 text-[10px]">
                      {matchedStartups.length} Startup{matchedStartups.length !== 1 ? "s" : ""}
                    </a>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* No query state */}
        {!query && (
          <div className="text-center py-20">
            <Search size={48} className="text-gray-200 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-gray-300 mb-2">Start searching</h2>
            <p className="text-brand-muted">Type a keyword and press Enter to find articles, founders, and startups.</p>
          </div>
        )}

        {/* No results state */}
        {query && total === 0 && (
          <div className="text-center py-20">
            <Search size={48} className="text-gray-200 mx-auto mb-4" />
            <h2 className="font-serif text-2xl font-bold text-white mb-2">No results found</h2>
            <p className="text-gray-500 mb-6">We couldn&apos;t find anything matching &ldquo;{query}&rdquo;. Try a different keyword.</p>
            <div className="flex flex-wrap gap-2 justify-center">
              {["fintech", "startup", "founder", "agritech", "dhaka"].map((s) => (
                <a key={s} href={`/search?q=${s}`} className="badge-gray capitalize hover:bg-brand-red hover:text-white transition-colors cursor-pointer">
                  {s}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Results */}
        {total > 0 && (
          <div className="space-y-14">

            {/* Articles */}
            {matchedArticles.length > 0 && (
              <section id="articles">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-brand-border pb-3">
                  <FileText size={18} className="text-brand-red" />
                  <h2 className="font-serif text-2xl font-bold text-brand-dark">Articles</h2>
                  <span className="badge bg-blue-100 text-blue-700 text-[10px] ml-auto">{matchedArticles.length} found</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedArticles.map((article) => (
                    <Link key={article.id} href={`/articles/${article.slug}`} className="group block dark-card hover:border-brand-red transition-colors card-hover">
                      <div className="relative aspect-video overflow-hidden">
                        <Image src={article.coverImage} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3">
                          <span className="badge-red text-[10px]">{article.category}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <h3 className="font-serif font-bold text-base text-white group-hover:text-brand-red transition-colors leading-snug mb-2">
                          {highlight(article.title, query)}
                        </h3>
                        <p className="text-brand-muted text-sm line-clamp-2 mb-3">
                          {highlight(article.excerpt, query)}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-brand-muted">
                          <Image src={article.authorAvatar} alt={article.author} width={18} height={18} className="rounded-full" />
                          <span>{article.author}</span>
                          <span>·</span>
                          <span>{formatDate(article.publishedAt)}</span>
                          <span>·</span>
                          <span className="flex items-center gap-1"><Clock size={10} />{article.readTime}m</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Founders */}
            {matchedFounders.length > 0 && (
              <section id="founders">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-brand-border pb-3">
                  <Users size={18} className="text-brand-red" />
                  <h2 className="font-serif text-2xl font-bold text-brand-dark">Founders</h2>
                  <span className="badge bg-green-100 text-green-700 text-[10px] ml-auto">{matchedFounders.length} found</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedFounders.map((founder) => (
                    <Link key={founder.id} href={`/founders/${founder.slug}`} className="group flex gap-4 p-4 dark-card hover:border-brand-red transition-colors card-hover">
                      <Image
                        src={founder.avatar}
                        alt={founder.name}
                        width={64}
                        height={64}
                        className="rounded-full flex-shrink-0 object-cover"
                      />
                      <div className="min-w-0">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red">{founder.industry}</span>
                        <h3 className="font-serif font-bold text-base text-white group-hover:text-brand-red transition-colors">
                          {highlight(founder.name, query)}
                        </h3>
                        <p className="text-brand-muted text-sm">{highlight(founder.title, query)}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-brand-muted">
                          <span className="flex items-center gap-1"><Building2 size={10} />{highlight(founder.company, query)}</span>
                          <span className="flex items-center gap-1"><MapPin size={10} />{founder.location}</span>
                        </div>
                        {founder.netWorth && (
                          <p className="text-xs font-bold text-brand-gold mt-1">{founder.netWorth}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Startups */}
            {matchedStartups.length > 0 && (
              <section id="startups">
                <div className="flex items-center gap-3 mb-6 pb-3 border-b border-brand-border pb-3">
                  <Rocket size={18} className="text-brand-red" />
                  <h2 className="font-serif text-2xl font-bold text-brand-dark">Startups</h2>
                  <span className="badge bg-purple-100 text-purple-700 text-[10px] ml-auto">{matchedStartups.length} found</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {matchedStartups.map((startup) => (
                    <Link key={startup.id} href={`/startups/${startup.slug}`} className="group block dark-card hover:border-brand-red transition-colors card-hover">
                      <div className="relative h-36 overflow-hidden">
                        <Image src={startup.logo} alt={startup.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                        <div className="absolute bottom-3 left-3">
                          <span className="badge bg-white/20 text-white border border-white/30 text-[10px]">{startup.stage}</span>
                        </div>
                      </div>
                      <div className="p-4">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-brand-red">{startup.industry}</span>
                        <h3 className="font-serif font-bold text-base text-white group-hover:text-brand-red transition-colors mt-0.5">
                          {highlight(startup.name, query)}
                        </h3>
                        <p className="text-brand-muted text-sm mt-1 line-clamp-2">
                          {highlight(startup.tagline, query)}
                        </p>
                        <div className="flex items-center gap-3 mt-2 text-xs text-brand-muted">
                          <span className="flex items-center gap-1"><MapPin size={10} />{startup.location}</span>
                          {startup.funding && <span className="text-green-600 font-semibold">{startup.funding}</span>}
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
