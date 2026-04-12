"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search } from "lucide-react";
import { articles, founders, startups } from "@/lib/data";
import SiteLogo from "@/components/SiteLogo";

const navLinks = [
  { label: "Articles", href: "/articles" },
  { label: "Founders", href: "/founders" },
  { label: "Startups", href: "/startups" },
  { label: "Rankings", href: "/rankings" },
  { label: "Best Ideas", href: "/ideas" },
];

type Result = {
  type: "article" | "founder" | "startup";
  title: string;
  subtitle: string;
  href: string;
};

function getResults(query: string): Result[] {
  if (!query.trim()) return [];
  const q = query.toLowerCase();
  const articleResults: Result[] = articles
    .filter((a) => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q))
    .slice(0, 3)
    .map((a) => ({ type: "article", title: a.title, subtitle: a.category, href: `/articles/${a.slug}` }));
  const founderResults: Result[] = founders
    .filter((f) => f.name.toLowerCase().includes(q) || f.company.toLowerCase().includes(q) || f.industry.toLowerCase().includes(q))
    .slice(0, 3)
    .map((f) => ({ type: "founder", title: f.name, subtitle: f.company, href: `/founders/${f.slug}` }));
  const startupResults: Result[] = startups
    .filter((s) => s.name.toLowerCase().includes(q) || s.industry.toLowerCase().includes(q) || s.tagline.toLowerCase().includes(q))
    .slice(0, 3)
    .map((s) => ({ type: "startup", title: s.name, subtitle: s.industry, href: `/startups/${s.slug}` }));
  return [...articleResults, ...founderResults, ...startupResults];
}

const typeBadge: Record<string, string> = {
  article: "bg-blue-100 text-blue-700",
  founder: "bg-green-100 text-green-700",
  startup: "bg-purple-100 text-purple-700",
};
const typeLabel: Record<string, string> = { article: "Article", founder: "Founder", startup: "Startup" };

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => { setResults(getResults(query)); }, [query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false); setQuery("");
      }
    }
    if (searchOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [searchOpen]);

  const handleOpen = () => { setSearchOpen(true); setTimeout(() => inputRef.current?.focus(), 50); };
  const handleClose = () => { setSearchOpen(false); setQuery(""); };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && query.trim()) { router.push(`/search?q=${encodeURIComponent(query.trim())}`); handleClose(); }
    if (e.key === "Escape") handleClose();
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-brand-border shadow-sm">
      {/* Top bar */}
      <div className="bg-brand-dark text-white border-b border-white/10">
        <div className="container-wide py-1.5 flex justify-between items-center">
          <span className="text-[10px] tracking-[0.2em] uppercase text-gray-400 font-medium">
            Bangladesh&apos;s Premier Startup & Business News
          </span>
          <div className="hidden sm:flex gap-5 text-[10px] tracking-widest uppercase text-gray-500">
            <Link href="/subscribe" className="hover:text-white transition-colors">Subscribe</Link>
            <span className="text-gray-700">|</span>
            <Link href="/newsletter" className="hover:text-white transition-colors">Newsletter</Link>
          </div>
        </div>
      </div>

      {/* Main nav */}
      <div className="container-wide">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <SiteLogo />
          </Link>

          <nav className="hidden lg:flex items-center gap-7">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                className="text-xs font-semibold uppercase tracking-[0.15em] text-gray-600 hover:text-brand-red transition-colors relative group">
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-red group-hover:w-full transition-all duration-300" />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={handleOpen} className="p-2 text-gray-500 hover:text-brand-red transition-colors" aria-label="Search">
              <Search size={17} />
            </button>
            <Link href="/subscribe" className="hidden sm:block btn-primary text-xs py-2 px-4">
              Subscribe
            </Link>
            <button className="lg:hidden p-2 text-gray-600" onClick={() => setOpen(!open)} aria-label="Toggle menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        {searchOpen && (
          <div ref={searchRef} className="pb-4 border-t border-brand-border pt-3 relative">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search founders, startups, articles..."
                className="w-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-brand-red transition-colors"
              />
              <button onClick={handleClose} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700">
                <X size={15} />
              </button>
            </div>

            {query.trim() && (
              <div className="absolute left-0 right-0 bg-white border border-gray-200 shadow-xl mt-1 z-50 max-h-80 overflow-y-auto">
                {results.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-400 text-sm">No results for &ldquo;{query}&rdquo;</div>
                ) : (
                  <>
                    {results.map((r, i) => (
                      <Link key={i} href={r.href} onClick={handleClose}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-brand-gray border-b border-gray-100 last:border-0 transition-colors">
                        <span className={`badge text-[9px] flex-shrink-0 ${typeBadge[r.type]}`}>{typeLabel[r.type]}</span>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">{r.title}</p>
                          <p className="text-xs text-gray-400">{r.subtitle}</p>
                        </div>
                      </Link>
                    ))}
                    <div className="px-4 py-2.5 bg-gray-50 border-t border-gray-100 text-center">
                      <button onClick={() => { router.push(`/search?q=${encodeURIComponent(query.trim())}`); handleClose(); }}
                        className="text-xs text-brand-red font-semibold hover:underline">
                        Press Enter — see all {results.length} results →
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden bg-white border-t border-brand-border">
          <nav className="container-wide py-4 flex flex-col">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                className="py-3 px-2 text-xs font-semibold uppercase tracking-widest text-gray-600 hover:text-brand-red border-b border-brand-border transition-colors">
                {link.label}
              </Link>
            ))}
            <Link href="/subscribe" className="mt-4 btn-primary text-center justify-center text-xs">Subscribe Now</Link>
          </nav>
        </div>
      )}
    </header>
  );
}
