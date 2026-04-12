import Image from "next/image";
import Link from "next/link";
import { startups } from "@/lib/data";
import { ArrowRight, MapPin, TrendingUp } from "lucide-react";

const stageColors: Record<string, string> = {
  "Pre-seed": "bg-gray-100 text-gray-600",
  "Seed": "bg-green-100 text-green-700",
  "Series A": "bg-blue-100 text-blue-700",
  "Series B": "bg-purple-100 text-purple-700",
};

export default function StartupSpotlight() {
  return (
    <section className="pb-8 lg:pb-12 pt-16 lg:pt-24 bg-brand-gray">
      <div className="container-wide">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-brand-red" />
              <span className="section-label">Startup Directory</span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-brand-dark">Startups to Watch</h2>
            <div className="divider-red mt-3" />
          </div>
          <Link href="/startups" className="hidden sm:flex items-center gap-2 text-xs text-gray-500 hover:text-brand-red transition-colors uppercase tracking-wider">
            All Startups <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {startups.map((startup) => (
            <Link key={startup.id} href={`/startups/${startup.slug}`}
              className="group bg-white border border-brand-border card-hover block overflow-hidden">
              <div className="relative h-40 overflow-hidden">
                <Image src={startup.logo} alt={startup.name} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className={`badge text-[9px] ${stageColors[startup.stage] || "bg-gray-100 text-gray-600"}`}>{startup.stage}</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="section-label text-[9px]">{startup.industry}</span>
                    <h3 className="font-serif font-bold text-lg text-brand-dark mt-0.5 group-hover:text-brand-red transition-colors">{startup.name}</h3>
                  </div>
                  {startup.funding && (
                    <span className="text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-1 flex-shrink-0">{startup.funding}</span>
                  )}
                </div>
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">{startup.tagline}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400 border-t border-brand-border pt-3">
                  <span className="flex items-center gap-1"><MapPin size={10} />{startup.location}</span>
                  <span>Est. {startup.founded}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
