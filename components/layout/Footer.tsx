import Link from "next/link";
import { Twitter, Linkedin, Facebook, Instagram, Youtube } from "lucide-react";

const footerLinks = {
  Explore: [
    { label: "Articles", href: "/articles" },
    { label: "Founders", href: "/founders" },
    { label: "Startups", href: "/startups" },
    { label: "Rankings", href: "/rankings" },
    { label: "Best Ideas", href: "/ideas" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Advertise", href: "/advertise" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Cookie Policy", href: "/cookies" },
  ],
};

const socials = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Facebook, href: "#", label: "Facebook" },
  { icon: Instagram, href: "#", label: "Instagram" },
  { icon: Youtube, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="container-wide py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="section-label mb-2">Newsletter</p>
              <h3 className="font-serif text-2xl font-bold text-white mb-1">Stay Ahead of the Curve</h3>
              <p className="text-gray-400 text-sm">Weekly insights on Bangladesh&apos;s top entrepreneurs and startups.</p>
            </div>
            <form className="flex w-full md:w-auto gap-0">
              <input type="email" placeholder="Enter your email"
                className="bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 text-sm w-full md:w-72 focus:outline-none focus:border-brand-red transition-colors" />
              <button type="submit" className="bg-brand-red text-white px-6 py-3 text-sm font-semibold hover:bg-red-700 transition-colors whitespace-nowrap">
                Subscribe
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
              <div className="bg-brand-red text-white font-serif font-bold text-lg px-2.5 py-1">SUN</div>
              <div>
                <div className="font-serif font-bold text-base text-white tracking-tight">START-UP NEWS</div>
                <div className="text-[8px] tracking-[0.3em] uppercase text-gray-500">Bangladesh Business</div>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              The definitive voice of Bangladeshi entrepreneurship, innovation, and startup news.
            </p>
            <div className="flex gap-3">
              {socials.map(({ icon: Icon, href, label }) => (
                <a key={label} href={href} aria-label={label}
                  className="w-8 h-8 border border-white/20 flex items-center justify-center text-gray-500 hover:border-brand-red hover:text-brand-red transition-colors">
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="section-label mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
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
          <span>© 2026 Start-Up News. All rights reserved.</span>
          <span>Made with ❤️ for Bangladesh</span>
        </div>
      </div>
    </footer>
  );
}
