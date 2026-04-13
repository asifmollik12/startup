"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/utils";
import { Clock, Search } from "lucide-react";

export default function ArticlesClient({ articles }: { articles: any[] }) {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const cats = ["All", ...Array.from(new Set(articles.map(a => a.category)))];

  const filtered = articles.filter(a =>
    (active === "All" || a.category === active) &&
    (search === "" || a.title.toLowerCase().includes(search.toLowerCase()) || a.excerpt.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Hero header */}
      <div className="border-b border-brand-border bg-white">
        <div className="container-wide py-4">
          <span className="section-label">Start-Up News</span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-brand-dark mt-2 mb-3">Articles & Stories</h1>
          <p className="text-gray-500 max-w-xl text-sm">In-depth reporting on Bangladesh's most inspiring entrepreneurs, groundbreaking startups, and transformative ideas.</p>
        </div>
      </div>

      {/* Sticky category bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-brand-border shadow-sm">
        <div className="container-wide">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {cats.map(cat => (
              <button key={cat} onClick={() => setActive(cat)}
                className={`flex-shrink-0 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                  active === cat
                    ? "border-brand-red text-brand-red"
                    : "border-transparent text-gray-500 hover:text-brand-dark hover:border-gray-300"
                }`}>
                {cat}
              </button>
            ))}
            {/* Search */}
            <div className="ml-auto flex-shrink-0 px-4 py-2">
              <div className="relative">
                <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                  className="pl-8 pr-4 py-1.5 text-xs border border-brand-border rounded-full focus:outline-none focus:border-brand-red w-36 transition-all focus:w-48" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles grid */}
      <div className="container-wide py-10">
        {/* Active category label */}
        {active !== "All" && (
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-6 bg-brand-red" />
            <h2 className="font-serif text-2xl font-bold text-brand-dark">{active}</h2>
            <span className="text-sm text-gray-400">— {filtered.length} articles</span>
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No articles found.</p>
            <button onClick={() => { setActive("All"); setSearch(""); }} className="mt-4 text-brand-red text-sm hover:underline">Clear filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {filtered.map((article: any) => (
                <Link key={article.id} href={`/articles/${article.slug}`}
                  className="group bg-white border border-brand-border card-hover block overflow-hidden">
                  <div className="relative overflow-hidden aspect-video bg-gray-100">
                    {article.coverImage && (
                      <Image src={article.coverImage} alt={article.title} fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500" unoptimized />
                    )}
                  </div>
                  <div className="p-3">
                    <span className="section-label text-[8px]">{article.category}</span>
                    <h3 className="font-serif font-bold text-sm text-brand-dark mt-1 mb-1 leading-snug group-hover:text-brand-red transition-colors line-clamp-3">{article.title}</h3>
                    <div className="flex items-center gap-1.5 text-[10px] text-gray-400 border-t border-brand-border pt-2 mt-2">
                      <span>{formatDate(article.publishedAt)}</span>
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
