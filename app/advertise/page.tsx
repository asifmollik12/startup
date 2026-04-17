import Link from "next/link";
import { ArrowRight, BarChart2, Users, Target, Zap, Mail } from "lucide-react";
import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models/SiteSettings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Advertise — Start-Up News" };

const defaultSections = [
  { title: "Banner Ads", content: "Homepage and article page display banners. Reach our full audience with top banner, sidebar, and mobile placements. Includes weekly impressions report." },
  { title: "Sponsored Content", content: "Native editorial-style sponsored stories written by our team. Promoted across all channels with social media amplification and permanent archive placement." },
  { title: "Newsletter Sponsorship", content: "Dedicated placement in our weekly newsletter reaching 50,000+ subscribers. High open rates, targeted BD audience, and click tracking report included." },
  { title: "Custom Packages", content: "Need something tailored? We work with brands of all sizes on custom campaigns, events, and partnerships. Contact us to discuss your goals." },
];

const defaultStats = [
  { value: "2M+", label: "Monthly Readers" },
  { value: "500+", label: "Founders in Network" },
  { value: "64", label: "Districts Covered" },
  { value: "50K+", label: "Newsletter Subscribers" },
];

const statIcons = [Users, Target, BarChart2, Zap];

async function getPageData() {
  try {
    await connectDB();
    const s = await SiteSettings.findOne({ key: "page_advertise" }).lean() as any;
    return s?.value ?? null;
  } catch { return null; }
}

export default async function AdvertisePage() {
  const page = await getPageData();
  const heroTitle = page?.hero_title || "Reach Bangladesh's Top Entrepreneurs";
  const heroSubtitle = page?.hero_subtitle || "Start-Up News connects your brand with 2M+ monthly readers — founders, investors, operators, and business leaders across Bangladesh.";
  const sections = page?.sections?.length ? page.sections : defaultSections;
  const stats = page?.stats?.length ? page.stats : defaultStats;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-dark text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,16,46,0.15)_0%,_transparent_60%)] pointer-events-none" />
        <div className="container-wide relative">
          <span className="section-label mb-4 block">Advertise</span>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight max-w-3xl mb-6">
            <span className="text-brand-red">{heroTitle}</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed mb-8">{heroSubtitle}</p>
          <a href="mailto:advertise@start-upnews.com" className="btn-primary">Get in Touch <ArrowRight size={15} /></a>
        </div>
      </div>

      {/* Dynamic stats */}
      <div className="border-b border-brand-border">
        <div className="container-wide py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat: any, i: number) => {
              const Icon = statIcons[i % statIcons.length];
              return (
                <div key={i} className="text-center">
                  <div className="w-12 h-12 bg-brand-red/10 flex items-center justify-center mx-auto mb-3">
                    <Icon size={20} className="text-brand-red" />
                  </div>
                  <div className="font-serif text-3xl font-bold text-brand-dark">{stat.value}</div>
                  <div className="text-gray-400 text-xs uppercase tracking-wider mt-1">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic sections */}
      <div className="container-wide py-16 lg:py-20">
        <div className="text-center mb-12">
          <span className="section-label">Packages</span>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-brand-dark mt-2">Advertising Options</h2>
          <div className="w-10 h-0.5 bg-brand-red mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {sections.map((s: any, i: number) => (
            <div key={i} className="border border-brand-border p-8 hover:border-brand-red transition-colors group">
              <h3 className="font-serif text-xl font-bold text-brand-dark mb-3 group-hover:text-brand-red transition-colors">{s.title}</h3>
              <p className="text-gray-500 leading-relaxed">{s.content}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-brand-dark py-16">
        <div className="container-wide text-center max-w-xl mx-auto">
          <Mail size={32} className="text-brand-red mx-auto mb-4" />
          <h2 className="font-serif text-3xl font-bold text-white mb-3">Ready to advertise?</h2>
          <p className="text-gray-400 text-sm mb-6">Get in touch and we&apos;ll put together a package that works for your brand.</p>
          <a href="mailto:advertise@start-upnews.com" className="btn-primary">advertise@start-upnews.com <ArrowRight size={14} /></a>
        </div>
      </div>
    </div>
  );
}
