"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, X, Search, User, LogOut, ChevronDown, Lightbulb, BookOpen } from "lucide-react";
import { articles, founders, startups } from "@/lib/data";
import SiteLogo from "@/components/SiteLogo";
import VoiceAI from "@/components/VoiceAI";

function UserMenu() {
  const [user, setUser] = useState<{ id: string; name: string; email: string; avatar?: string } | null>(null);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) setUser(JSON.parse(stored));
    // Listen for storage changes (login/logout in other tabs)
    const handler = () => {
      const s = localStorage.getItem("user");
      setUser(s ? JSON.parse(s) : null);
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  if (!user) return (
    <div className="hidden sm:flex items-center gap-2">
      <Link href="/login" className="text-xs font-semibold text-gray-600 hover:text-brand-red transition-colors uppercase tracking-wider">Sign In</Link>
      <Link href="/signup" className="btn-primary text-xs py-2 px-4">Join Free</Link>
    </div>
  );

  return (
    <div className="relative hidden sm:block" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-2 py-1 border border-brand-border hover:border-brand-red transition-colors">
        <div className="w-5 h-5 bg-brand-red flex items-center justify-center overflow-hidden flex-shrink-0">
          {user.avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <span className="text-white text-[9px] font-bold">{user.name.charAt(0).toUpperCase()}</span>
          )}
        </div>
        <span className="text-xs font-semibold text-gray-700 max-w-[80px] truncate">{user.name}</span>
        <ChevronDown size={11} className="text-gray-400" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-brand-border shadow-xl z-50">
          {/* User info */}
          <div className="px-4 py-3 border-b border-brand-border bg-brand-gray">
            <p className="text-sm font-bold text-brand-dark truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
          {/* Menu items */}
          <div className="py-1">
            <Link href="/profile" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-brand-red hover:bg-brand-gray transition-colors">
              <User size={13} className="flex-shrink-0" /> My Profile
            </Link>
            <Link href="/profile?tab=ideas" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-brand-red hover:bg-brand-gray transition-colors">
              <Lightbulb size={13} className="flex-shrink-0" /> My Ideas
            </Link>
            <Link href="/profile?tab=reading" onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:text-brand-red hover:bg-brand-gray transition-colors">
              <BookOpen size={13} className="flex-shrink-0" /> Reading List
            </Link>
          </div>
          <div className="border-t border-brand-border py-1">
            <button onClick={logout}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 transition-colors">
              <LogOut size={13} className="flex-shrink-0" /> Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const navLinks = [
  { label: "Features", href: "/articles" },
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
  image?: string;
};

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
  const [searching, setSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}`);
        const data = await res.json();
        setResults(data);
      } catch { setResults([]); }
      setSearching(false);
    }, 250);
  }, [query]);

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
  const handleClose = () => { setSearchOpen(false); setQuery(""); setResults([]); };
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
            <Link href="/subscribe" className="hover:text-white transition-colors">Materials</Link>
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
            <VoiceAI />
            <UserMenu />
            <button className="lg:hidden p-2 text-gray-600" onClick={() => setOpen(!open)} aria-label="Toggle menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div ref={searchRef} className={`border-t border-brand-border overflow-hidden transition-all duration-300 ease-out ${searchOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="py-3 relative">
            <div className="relative flex items-center">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              {searching && <div className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />}
              <input
                ref={inputRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search founders, startups, articles..."
                className="w-full bg-white border border-brand-border text-gray-900 placeholder-gray-400 pl-9 pr-10 py-2.5 text-sm focus:outline-none focus:border-brand-red transition-colors"
              />
              <button onClick={handleClose} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                <X size={15} />
              </button>
            </div>

            {query.trim() && (
              <div className="absolute left-0 right-0 bg-white border border-gray-200 shadow-2xl mt-1 z-50 max-h-96 overflow-y-auto">
                {!searching && results.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-400 text-sm">No results for &ldquo;{query}&rdquo;</div>
                ) : (
                  <>
                    {results.map((r, i) => (
                      <Link key={i} href={r.href} onClick={handleClose}
                        className="flex items-center gap-3 px-4 py-3 hover:bg-brand-gray border-b border-gray-100 last:border-0 transition-colors group">
                        {/* Image */}
                        <div className="w-10 h-10 flex-shrink-0 overflow-hidden bg-gray-100">
                          {r.image ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={r.image} alt={r.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-brand-red flex items-center justify-center">
                              <span className="text-white text-xs font-bold">{r.title.charAt(0)}</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-gray-900 truncate group-hover:text-brand-red transition-colors">{r.title}</p>
                          <p className="text-xs text-gray-400">{r.subtitle}</p>
                        </div>
                        <span className={`badge text-[9px] flex-shrink-0 ${typeBadge[r.type]}`}>{typeLabel[r.type]}</span>
                      </Link>
                    ))}
                    {results.length > 0 && (
                      <button onClick={() => { router.push(`/search?q=${encodeURIComponent(query.trim())}`); handleClose(); }}
                        className="w-full px-4 py-3 bg-brand-gray border-t border-gray-100 text-xs text-brand-red font-semibold hover:bg-brand-red hover:text-white transition-colors text-center">
                        See all results for &ldquo;{query}&rdquo; →
                      </button>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu — full screen overlay with smooth animation */}
      <div className={`lg:hidden fixed inset-0 z-[60] transition-all duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}>
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
        {/* Drawer */}
        <div className={`absolute top-0 right-0 h-full w-[80vw] max-w-sm bg-brand-dark shadow-2xl flex flex-col transition-transform duration-300 ease-out ${open ? "translate-x-0" : "translate-x-full"}`}>
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-[#1a1a1a]">
            <MobileSidebarLogo />
            <button onClick={() => setOpen(false)} className="p-2 text-gray-400 hover:text-white transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Nav links */}
          <nav className="flex-1 overflow-y-auto py-2">
            {navLinks.map((link, i) => (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}
                style={{ transitionDelay: open ? `${i * 40}ms` : "0ms" }}
                className={`flex items-center justify-between px-6 py-4 text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 border-b border-white/10 transition-all duration-200 ${open ? "translate-x-0 opacity-100" : "translate-x-4 opacity-0"}`}>
                {link.label}
                <span className="text-gray-600 text-lg">›</span>
              </Link>
            ))}
            <Link href="/subscribe" onClick={() => setOpen(false)}
              className="flex items-center justify-between px-6 py-4 text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 border-b border-white/10 transition-colors">
              Materials
              <span className="text-gray-600 text-lg">›</span>
            </Link>
          </nav>

          {/* Auth + Subscribe */}
          <div className="px-5 py-5 border-t border-white/10 space-y-3">
            <MobileUserSection onClose={() => setOpen(false)} />
            <Link href="/subscribe" onClick={() => setOpen(false)}
              className="block w-full bg-brand-red text-white text-center py-3 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors">
              Subscribe Now
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}

function MobileSidebarLogo() {
  const [logo, setLogo] = useState<string | null>(null);
  useEffect(() => {
    fetch("/api/settings?key=mobileSidebarLogo").then(r => r.json()).then(url => { if (url) setLogo(url); }).catch(() => {});
  }, []);
  if (logo) return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={logo} alt="Logo" className="h-8 w-auto object-contain" />
  );
  return <SiteLogo />;
}

function MobileUserSection({ onClose }: { onClose: () => void }) {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const s = localStorage.getItem("user");
    if (s) setUser(JSON.parse(s));
  }, []);

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    onClose();
    router.push("/");
    router.refresh();
  };

  if (user) return (
    <div className="space-y-2">
      <Link href="/profile" onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 border border-white/20 text-sm font-semibold text-white hover:border-brand-red transition-colors">
        <div className="w-7 h-7 bg-brand-red flex items-center justify-center">
          <span className="text-white text-xs font-bold">{user.name.charAt(0).toUpperCase()}</span>
        </div>
        {user.name}
      </Link>
      <button onClick={logout} className="w-full text-left px-4 py-2 text-xs text-gray-500 hover:text-red-400 transition-colors">Sign Out</button>
    </div>
  );

  return (
    <div className="grid grid-cols-2 gap-2">
      <Link href="/login" onClick={onClose}
        className="text-center py-2.5 border border-white/20 text-sm font-semibold text-gray-300 hover:border-brand-red hover:text-white transition-colors">
        Sign In
      </Link>
      <Link href="/signup" onClick={onClose}
        className="text-center py-2.5 bg-white text-brand-dark text-sm font-semibold hover:bg-gray-100 transition-colors">
        Join Free
      </Link>
    </div>
  );
}
