"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, FileText, Users, Rocket, Lightbulb,
  Trophy, Settings, ExternalLink, ChevronRight, PanelTop, PanelBottom,
} from "lucide-react";
import { useSiteLogo } from "@/lib/SiteLogoContext";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Header", href: "/admin/header", icon: PanelTop },
  { label: "Footer", href: "/admin/footer", icon: PanelBottom },
  { label: "Articles", href: "/admin/articles", icon: FileText },
  { label: "Founders", href: "/admin/founders", icon: Users },
  { label: "Startups", href: "/admin/startups", icon: Rocket },
  { label: "Ideas", href: "/admin/ideas", icon: Lightbulb },
  { label: "Rankings", href: "/admin/rankings", icon: Trophy },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logoUrl } = useSiteLogo();

  return (
    <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="Site Logo" className="h-8 w-auto object-contain" />
            <div className="text-[9px] tracking-widest uppercase text-gray-500">Admin Panel</div>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="bg-brand-red text-white font-serif font-bold text-sm px-2 py-1 leading-tight">SUN</div>
            <div>
              <div className="text-white font-bold text-sm tracking-tight">START-UP NEWS</div>
              <div className="text-[9px] tracking-widest uppercase text-gray-500">Admin Panel</div>
            </div>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                active
                  ? "bg-brand-red text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
            >
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="opacity-70" />}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-gray-800">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:text-white hover:bg-gray-800 transition-all"
        >
          <ExternalLink size={15} />
          <span>View Site</span>
        </Link>
      </div>
    </aside>
  );
}
