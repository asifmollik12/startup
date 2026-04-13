import Image from "next/image";
import Link from "next/link";
import { founders } from "@/lib/data";
import { MapPin, Building2 } from "lucide-react";

const industries = ["All", "Fintech", "Mobility", "E-commerce", "Super App", "Agritech", "Edtech"];

export default function FoundersPage() {
  return (
    <div className="pt-4 pb-8">
      <div className="container-wide">
        <div className="border-b border-brand-border pb-4 mb-5">
          <span className="section-label">Profiles</span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-brand-dark mt-2 mb-4">Founder Profiles</h1>
          <p className="text-gray-500 max-w-xl">Meet the visionaries building Bangladesh&apos;s future — one startup at a time.</p>
        </div>
        <div className="flex gap-2 flex-wrap mb-6">
          {industries.map((ind) => (
            <button key={ind} className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider border transition-colors ${
              ind === "All" ? "bg-brand-red text-white border-brand-red" : "border-brand-border text-gray-600 hover:border-brand-red hover:text-brand-red"
            }`}>{ind}</button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {founders.map((founder) => (
            <Link key={founder.id} href={`/founders/${founder.slug}`}
              className="group bg-white border border-brand-border card-hover block overflow-hidden">
              <div className="relative h-52 overflow-hidden">
                <Image src={founder.coverImage} alt={founder.name} fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                {founder.rank && (
                  <div className="absolute top-0 left-0 bg-brand-red px-3 py-1.5">
                    <span className="text-white font-bold text-xs">#{founder.rank}</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3">
                  <Image src={founder.avatar} alt={founder.name} width={48} height={48}
                    className="rounded-full border-2 border-white shadow -mt-8 relative z-10 flex-shrink-0 object-cover" />
                  <div className="pt-1">
                    <span className="section-label text-[9px]">{founder.industry}</span>
                    <h2 className="font-serif font-bold text-lg text-brand-dark group-hover:text-brand-red transition-colors">{founder.name}</h2>
                    <p className="text-gray-500 text-xs">{founder.title}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-4 text-xs text-gray-400 border-t border-brand-border pt-3">
                  <span className="flex items-center gap-1"><Building2 size={10} />{founder.company}</span>
                  <span className="flex items-center gap-1"><MapPin size={10} />{founder.location}</span>
                </div>
                {founder.netWorth && (
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs text-gray-400">Est. Net Worth</span>
                    <span className="text-sm font-bold text-brand-gold">{founder.netWorth}</span>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
