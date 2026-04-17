import Link from "next/link";
import { ArrowRight, BarChart2, Users, Target, Zap, Mail } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Advertise — Start-Up News",
  description: "Reach Bangladesh's top founders, investors, and entrepreneurs.",
};

const packages = [
  {
    name: "Banner Ads",
    price: "৳15,000",
    period: "per month",
    desc: "Homepage and article page display banners",
    features: ["Top banner placement", "Sidebar ads", "Mobile optimized", "Weekly impressions report"],
  },
  {
    name: "Sponsored Content",
    price: "৳35,000",
    period: "per article",
    desc: "Native editorial-style sponsored stories",
    features: ["Written by our editorial team", "Promoted across all channels", "Social media amplification", "Permanent archive placement"],
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Newsletter",
    price: "৳20,000",
    period: "per send",
    desc: "Dedicated placement in our weekly newsletter",
    features: ["50,000+ subscribers", "High open rates", "Targeted BD audience", "Click tracking report"],
  },
];

const stats = [
  { icon: Users, value: "2M+", label: "Monthly Readers" },
  { icon: Target, value: "500+", label: "Founders in Network" },
  { icon: BarChart2, value: "64", label: "Districts Covered" },
  { icon: Zap, value: "50K+", label: "Newsletter Subscribers" },
];

export default function AdvertisePage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-brand-dark text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,16,46,0.15)_0%,_transparent_60%)] pointer-events-none" />
        <div className="container-wide relative">
          <span className="section-label mb-4 block">Advertise</span>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight max-w-3xl mb-6">
            Reach Bangladesh&apos;s<br />
            <span className="text-brand-red">Top Entrepreneurs</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed mb-8">
            Start-Up News connects your brand with 2M+ monthly readers — founders, investors, operators, and business leaders across Bangladesh.
          </p>
          <a href="mailto:advertise@start-upnews.com" className="btn-primary">
            Get in Touch <ArrowRight size={15} />
          </a>
        </div>
      </div>

      {/* Stats */}
      <div className="border-b border-brand-border">
        <div className="container-wide py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map(({ icon: Icon, value, label }) => (
              <div key={label} className="text-center">
                <div className="w-12 h-12 bg-brand-red/10 flex items-center justify-center mx-auto mb-3">
                  <Icon size={20} className="text-brand-red" />
                </div>
                <div className="font-serif text-3xl font-bold text-brand-dark">{value}</div>
                <div className="text-gray-400 text-xs uppercase tracking-wider mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Packages */}
      <div className="container-wide py-16 lg:py-20">
        <div className="text-center mb-12">
          <span className="section-label">Packages</span>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-brand-dark mt-2">Advertising Options</h2>
          <div className="w-10 h-0.5 bg-brand-red mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {packages.map((pkg) => (
            <div key={pkg.name} className={`relative border flex flex-col ${pkg.highlight ? "border-brand-red shadow-xl shadow-brand-red/10" : "border-brand-border"}`}>
              {pkg.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-red text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1">{pkg.badge}</span>
                </div>
              )}
              <div className={`p-6 ${pkg.highlight ? "bg-brand-dark text-white" : "bg-white"}`}>
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${pkg.highlight ? "text-brand-red" : "text-gray-400"}`}>{pkg.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`font-serif text-3xl font-bold ${pkg.highlight ? "text-white" : "text-brand-dark"}`}>{pkg.price}</span>
                  <span className="text-sm text-gray-400 mb-1">/{pkg.period}</span>
                </div>
                <p className={`text-sm ${pkg.highlight ? "text-gray-400" : "text-gray-500"}`}>{pkg.desc}</p>
              </div>
              <div className={`p-6 flex-1 flex flex-col ${pkg.highlight ? "bg-gray-900" : "bg-brand-gray"}`}>
                <ul className="space-y-3 flex-1 mb-6">
                  {pkg.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className={`mt-0.5 flex-shrink-0 w-1.5 h-1.5 rounded-full ${pkg.highlight ? "bg-brand-red" : "bg-brand-red"}`} />
                      <span className={pkg.highlight ? "text-gray-300" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <a href="mailto:advertise@start-upnews.com"
                  className={`w-full text-center py-3 text-sm font-bold uppercase tracking-wider transition-colors ${pkg.highlight ? "bg-brand-red text-white hover:bg-red-700" : "bg-brand-dark text-white hover:bg-gray-800"}`}>
                  Get Started
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-brand-dark py-16">
        <div className="container-wide text-center max-w-xl mx-auto">
          <Mail size={32} className="text-brand-red mx-auto mb-4" />
          <h2 className="font-serif text-3xl font-bold text-white mb-3">Custom Packages Available</h2>
          <p className="text-gray-400 text-sm mb-6">Need something tailored? We work with brands of all sizes on custom campaigns, events, and partnerships.</p>
          <a href="mailto:advertise@start-upnews.com" className="btn-primary">
            advertise@start-upnews.com <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
