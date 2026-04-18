"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, FileText, Users, Rocket, Lightbulb,
  Trophy, Settings, ExternalLink, ChevronRight, PanelTop, PanelBottom,
  Megaphone, ClipboardList, Building2, Scale, Info, Briefcase, Phone, Lock, Cookie, ChevronDown, Inbox, Mail,
} from "lucide-react";
import { useSiteLogo } from "@/lib/SiteLogoContext";

const navItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Header", href: "/admin/header", icon: PanelTop },
  { label: "Footer", href: "/admin/footer", icon: PanelBottom },
  { label: "Features", href: "/admin/articles", icon: FileText },
  { label: "Founders", href: "/admin/founders", icon: Users },
  { label: "Startups", href: "/admin/startups", icon: Rocket },
  { label: "Applications", href: "/admin/applications", icon: ClipboardList },
  { label: "Ideas", href: "/admin/ideas", icon: Lightbulb },
  { label: "Rankings", href: "/admin/rankings", icon: Trophy },
  { label: "Advertising", href: "/admin/advertising", icon: Megaphone },
  { label: "Messages", href: "/admin/messages", icon: Inbox },
  { label: "Subscribers", href: "/admin/subscribers", icon: Mail },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

const companyPages = [
  { label: "About Us", href: "/admin/pages/about", icon: Info },
  { label: "Advertise", href: "/admin/pages/advertise", icon: Briefcase },
  { label: "Contact", href: "/admin/pages/contact", icon: Phone },
];

const legalPages = [
  { label: "Privacy Policy", href: "/admin/pages/privacy", icon: Lock },
  { label: "Terms of Use", href: "/admin/pages/terms", icon: Scale },
  { label: "Cookie Policy", href: "/admin/pages/cookies", icon: Cookie },
];

function NavGroup({ icon: Icon, label, items, pathname }: {
  icon: React.ElementType; label: string;
  items: { label: string; href: string; icon: React.ElementType }[];
  pathname: string;
}) {
  const isAnyActive = items.some(i => pathname === i.href);
  const [open, setOpen] = useState(isAnyActive);

  return (
    <div>
      <button onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
          isAnyActive ? "text-white bg-gray-800" : "text-gray-400 hover:text-white hover:bg-gray-800"
        }`}>
        <Icon size={16} className="flex-shrink-0" />
        <span className="flex-1 text-left">{label}</span>
        <ChevronDown size={13} className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="mt-0.5 ml-3 pl-3 border-l border-gray-700 space-y-0.5">
          {items.map(({ label, href, icon: ItemIcon }) => {
            const active = pathname === href;
            return (
              <Link key={href} href={href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  active ? "bg-brand-red text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}>
                <ItemIcon size={14} className="flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {active && <ChevronRight size={12} className="opacity-70" />}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const { logoUrl } = useSiteLogo();

  return (
    <aside className="w-60 bg-gray-900 border-r border-gray-800 flex flex-col flex-shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-gray-800">
        <a href="/admin" onClick={() => window.location.href = "/admin"} className="cursor-pointer">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <div className="flex items-center gap-3">
              <img src={logoUrl} alt="Site Logo" className="h-8 w-auto object-contain" />
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="bg-brand-red text-white font-serif font-bold text-sm px-2 py-1 leading-tight">SUN</div>
              <div className="text-white font-bold text-sm tracking-tight">START-UP NEWS</div>
            </div>
          )}
        </a>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== "/admin" && pathname.startsWith(href));
          return (
            <Link key={href} href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group ${
                active ? "bg-brand-red text-white" : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}>
              <Icon size={16} className="flex-shrink-0" />
              <span className="flex-1">{label}</span>
              {active && <ChevronRight size={13} className="opacity-70" />}
            </Link>
          );
        })}

        <div className="pt-3">
          <NavGroup icon={Building2} label="Company Pages" items={companyPages} pathname={pathname} />
        </div>
        <div className="pt-1">
          <NavGroup icon={Scale} label="Legal" items={legalPages} pathname={pathname} />
        </div>
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
