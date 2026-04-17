import Link from "next/link";
import { ArrowRight, Users, Target, Globe, Award } from "lucide-react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models/SiteSettings";

export const revalidate = 60;
export const metadata: Metadata = { title: "About Us — Start-Up News" };

const icons = [Target, Globe, Users, Award];
const defaultSections = [
  { title: "Our Mission", content: "To be the definitive voice of Bangladeshi entrepreneurship — telling the stories of founders, startups, and innovators shaping the nation's future." },
  { title: "Our Reach", content: "Serving 2M+ monthly readers across Bangladesh and the diaspora, covering 64 districts and every major industry vertical." },
  { title: "Our Community", content: "A growing network of 500+ profiled founders, 1,200+ listed startups, and thousands of investors, operators, and ecosystem builders." },
  { title: "Our Standard", content: "Rigorous, independent journalism. We don't take money for editorial coverage. Every ranking, profile, and story is earned on merit." },
];

async function getPageData() {
  try {
    await connectDB();
    const s = await SiteSettings.findOne({ key: "page_about" }).lean() as any;
    return s?.value ?? null;
  } catch { return null; }
}

export default async function AboutPage() {
  const p = await getPageData();
  const badge = p?.hero_badge || "About Us";
  const title = p?.hero_title || "Bangladesh's Premier Startup Intelligence Platform";
  const subtitle = p?.hero_subtitle || "Start-Up News was founded with a single belief: the stories of Bangladeshi entrepreneurs deserve world-class coverage.";
  const ctaText = p?.hero_cta_text || "Join Our Community";
  const ctaHref = p?.hero_cta_href || "/subscribe";
  const secBadge = p?.sections_badge || "What We Stand For";
  const secTitle = p?.sections_title || "Our Values";
  const sections = p?.sections?.length ? p.sections : defaultSections;
  const ctaTitle = p?.cta_title || "Want to work with us?";
  const ctaSub = p?.cta_subtitle || "We're always looking for journalists, researchers, and builders who care about Bangladesh's startup ecosystem.";
  const ctaBtnText = p?.cta_btn_text || "View Openings";
  const ctaBtnHref = p?.cta_btn_href || "/careers";

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-dark text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,16,46,0.15)_0%,_transparent_60%)] pointer-events-none" />
        <div className="container-wide relative">
          <span className="section-label mb-4 block">{badge}</span>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight max-w-3xl mb-6 text-brand-red">{title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed mb-8">{subtitle}</p>
          <Link href={ctaHref} className="btn-primary">{ctaText} <ArrowRight size={15} /></Link>
        </div>
      </div>

      <div className="container-wide py-16 lg:py-20">
        <div className="text-center mb-12">
          <span className="section-label">{secBadge}</span>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-brand-dark mt-2">{secTitle}</h2>
          <div className="w-10 h-0.5 bg-brand-red mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {sections.map((s: any, i: number) => {
            const Icon = icons[i % icons.length];
            return (
              <div key={i} className="border border-brand-border p-8 hover:border-brand-red transition-colors group">
                <div className="w-12 h-12 bg-brand-red/10 flex items-center justify-center mb-5 group-hover:bg-brand-red transition-colors">
                  <Icon size={20} className="text-brand-red group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-serif text-xl font-bold text-brand-dark mb-3">{s.title}</h3>
                <p className="text-gray-500 leading-relaxed">{s.content}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-brand-dark py-16">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/10">
            {[["2M+","Monthly Readers"],["500+","Founders Profiled"],["1,200+","Startups Listed"],["2026","Est. Year"]].map(([v,l]) => (
              <div key={l} className="text-center px-6 py-4">
                <div className="font-serif text-4xl font-bold text-white mb-1">{v}</div>
                <div className="text-gray-500 text-xs uppercase tracking-widest">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-brand-gray border-t border-brand-border py-16">
        <div className="container-wide text-center max-w-xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-brand-dark mb-3">{ctaTitle}</h2>
          <p className="text-gray-500 mb-6">{ctaSub}</p>
          <div className="flex gap-3 justify-center">
            <Link href={ctaBtnHref} className="btn-primary">{ctaBtnText} <ArrowRight size={14} /></Link>
            <Link href="/contact" className="btn-outline">Get in Touch</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
