"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Twitter, Linkedin, Facebook, Instagram, Youtube, Globe } from "lucide-react";
import SiteLogo from "@/components/SiteLogo";
import { useFooterLogo } from "@/lib/FooterLogoContext";

const socialIconMap: Record<string, React.ElementType> = {
  Twitter, LinkedIn: Linkedin, Facebook, Instagram, YouTube: Youtube, Website: Globe,
};

const DEFAULTS = {
  newsletter: { label: "Newsletter", heading: "Stay Ahead of the Curve", subtext: "Weekly insights on Bangladesh's top entrepreneurs and startups.", buttonText: "Subscribe" },
  branding: { description: "The definitive voice of Bangladeshi entrepreneurship, innovation, and startup news." },
  groups: [
    { title: "Explore", links: [{ label: "Articles", href: "/articles" }, { label: "Founders", href: "/founders" }, { label: "Startups", href: "/startups" }, { label: "Rankings", href: "/rankings" }, { label: "Best Ideas", href: "/ideas" }] },
    { title: "Company", links: [{ label: "About Us", href: "/about" }, { label: "Advertise", href: "/advertise" }, { label: "Contact", href: "/contact" }] },
    { title: "Legal", links: [{ label: "Privacy Policy", href: "/privacy" }, { label: "Terms of Use", href: "/terms" }, { label: "Cookie Policy", href: "/cookies" }] },
  ],
  socials: [
    { platform: "Twitter", href: "#" }, { platform: "LinkedIn", href: "#" },
    { platform: "Facebook", href: "#" }, { platform: "Instagram", href: "#" }, { platform: "YouTube", href: "#" },
  ],
  bottomBar: { copyright: "© 2026 Start-Up News. All rights reserved.", tagline: "Powered by Alphainno" },
};

export default function Footer() {
  const { footerLogoUrl } = useFooterLogo();
  const [cfg, setCfg] = useState(DEFAULTS);

  useEffect(() => {
    fetch("/api/settings?key=footer_config")
      .then(r => r.json())
      .then(v => {
        if (v && typeof v === "object") {
          setCfg({
            newsletter: { ...DEFAULTS.newsletter, ...v.newsletter },
            branding: { ...DEFAULTS.branding, ...v.branding },
            groups: v.groups?.length ? v.groups : DEFAULTS.groups,
            socials: v.socials?.length ? v.socials : DEFAULTS.socials,
            bottomBar: { ...DEFAULTS.bottomBar, ...v.bottomBar },
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <footer className="bg-brand-dark text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container-wide py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="section-label mb-2">{cfg.newsletter.label}</p>
              <h3 className="font-serif text-2xl font-bold text-white mb-1">{cfg.newsletter.heading}</h3>
              <p className="text-gray-400 text-sm">{cfg.newsletter.subtext}</p>
            </div>
            <form className="flex w-full md:w-auto gap-0">
              <input type="email" placeholder="Enter your email"
                className="bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 text-sm w-full md:w-72 focus:outline-none focus:border-brand-red transition-colors" />
              <button type="submit" className="bg-brand-red text-white px-6 py-3 text-sm font-semibold hover:bg-red-700 transition-colors whitespace-nowrap">
                {cfg.newsletter.buttonText}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container-wide py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-5">
              {footerLogoUrl
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={footerLogoUrl} alt="Site Logo" className="h-10 w-auto object-contain" />
                : <SiteLogo badgeClass="bg-brand-red text-white font-serif font-bold text-lg px-2.5 py-1" nameClass="font-serif font-bold text-base text-white tracking-tight" subtitleClass="text-[8px] tracking-[0.3em] uppercase text-gray-500" />
              }
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">{cfg.branding.description}</p>
            <div className="flex gap-3">
              {cfg.socials.map((s, i) => {
                const Icon = socialIconMap[s.platform] ?? Globe;
                return (
                  <a key={i} href={s.href} aria-label={s.platform}
                    className="w-8 h-8 border border-white/20 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red transition-colors">
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          {cfg.groups.map((group, i) => (
            <div key={i}>
              <h4 className="section-label mb-4">{group.title}</h4>
              <ul className="space-y-2.5">
                {group.links.map((link, j) => (
                  <li key={j}>
                    <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">{link.label}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide py-4 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <span>{cfg.bottomBar.copyright}</span>
          <span>
            {cfg.bottomBar.tagline.toLowerCase().includes("alphainno")
              ? <>Powered by <a href="https://alphainno.com/" target="_blank" rel="noopener noreferrer" className="text-gray-400 font-semibold hover:text-white transition-colors">Alphainno</a></>
              : cfg.bottomBar.tagline
            }
          </span>
        </div>
      </div>
    </footer>
  );
}
