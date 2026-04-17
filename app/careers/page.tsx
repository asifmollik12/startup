import { ArrowRight } from "lucide-react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models/SiteSettings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Careers — Start-Up News" };

const defaultSections = [
  { title: "Senior Reporter — Startups & Tech", content: "Cover Bangladesh's fast-growing startup ecosystem. Break news, write features, and build relationships with founders and investors. Full-time · Dhaka" },
  { title: "Frontend Developer", content: "Build and improve our Next.js platform. Work on reader-facing features, performance, and editorial tools. Full-time · Remote / Dhaka" },
  { title: "Social Media Manager", content: "Grow our presence across Facebook, LinkedIn, and Instagram. Part-time · Remote" },
  { title: "Research Analyst", content: "Compile data for our annual rankings, startup database, and industry reports. Full-time · Dhaka" },
];

async function getPageData() {
  try {
    await connectDB();
    const s = await SiteSettings.findOne({ key: "page_careers" }).lean() as any;
    return s?.value ?? null;
  } catch { return null; }
}

export default async function CareersPage() {
  const p = await getPageData();
  const badge = p?.hero_badge || "Careers";
  const title = p?.hero_title || "Build the Future of BD Startup Media";
  const subtitle = p?.hero_subtitle || "We're a small, ambitious team on a mission to tell the stories of Bangladesh's entrepreneurs.";
  const secBadge = p?.sections_badge || "Open Roles";
  const secTitle = p?.sections_title || "Current Openings";
  const sections = p?.sections?.length ? p.sections : defaultSections;
  const ctaTitle = p?.cta_title || "Don't see your role?";
  const ctaSub = p?.cta_subtitle || "Send us your CV and tell us how you'd contribute.";
  const ctaBtnText = p?.cta_btn_text || "careers@start-upnews.com";
  const ctaBtnHref = p?.cta_btn_href || "mailto:careers@start-upnews.com";

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-dark text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,16,46,0.15)_0%,_transparent_60%)] pointer-events-none" />
        <div className="container-wide relative">
          <span className="section-label mb-4 block">{badge}</span>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight max-w-3xl mb-6 text-brand-red">{title}</h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">{subtitle}</p>
        </div>
      </div>

      <div className="container-wide py-16 lg:py-20">
        <div className="mb-10">
          <span className="section-label">{secBadge}</span>
          <h2 className="font-serif text-3xl font-bold text-brand-dark mt-2">{secTitle}</h2>
          <div className="w-10 h-0.5 bg-brand-red mt-3" />
        </div>
        <div className="space-y-4 max-w-3xl">
          {sections.map((s: any, i: number) => (
            <div key={i} className="border border-brand-border p-6 hover:border-brand-red transition-colors group">
              <div className="flex items-start justify-between gap-4 mb-3">
                <h3 className="font-serif text-lg font-bold text-brand-dark group-hover:text-brand-red transition-colors">{s.title}</h3>
                <a href={`mailto:careers@start-upnews.com?subject=Application: ${s.title}`}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-red-700 transition-colors">
                  Apply <ArrowRight size={12} />
                </a>
              </div>
              <p className="text-gray-500 text-sm leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-gray border-t border-brand-border py-16">
        <div className="container-wide text-center max-w-xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-brand-dark mb-3">{ctaTitle}</h2>
          <p className="text-gray-500 mb-6">{ctaSub}</p>
          <a href={ctaBtnHref} className="btn-primary">{ctaBtnText} <ArrowRight size={14} /></a>
        </div>
      </div>
    </div>
  );
}
