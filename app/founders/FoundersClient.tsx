"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Building2 } from "lucide-react";

export default function FoundersClient({ founders }: { founders: any[] }) {
  const [active, setActive] = useState("All");

  const industries = ["All", ...Array.from(new Set(founders.map(f => f.industry).filter(Boolean)))];
  const filtered = active === "All" ? founders : founders.filter(f => f.industry === active);

  return (
    <div className="pt-4 pb-6">
      <div className="container-wide">
        <div className="border-b border-brand-border pb-4 mb-5">
          <span className="section-label">Profiles</span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-brand-dark mt-2 mb-4">Founder Profiles</h1>
          <p className="text-gray-500 max-w-xl">Meet the visionaries building Bangladesh&apos;s future — one startup at a time.</p>
        </div>

        {/* Sticky filter bar */}
        <div className="sticky top-16 z-20 bg-white border-b border-brand-border -mx-4 px-4 mb-6">
          <div className="flex items-center gap-0 overflow-x-auto scrollbar-hide">
            {industries.map(ind => (
              <button key={ind} onClick={() => setActive(ind)}
                className={`flex-shrink-0 px-5 py-3.5 text-xs font-bold uppercase tracking-wider border-b-2 transition-all whitespace-nowrap ${
                  active === ind ? "border-brand-red text-brand-red" : "border-transparent text-gray-500 hover:text-brand-dark hover:border-gray-300"
                }`}>
                {ind}
                {ind !== "All" && (
                  <span className="ml-1.5 text-[10px] text-gray-400">({founders.filter(f => f.industry === ind).length})</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <p className="text-gray-400 text-center py-16">No founders yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((founder) => (
              <Link key={founder.id} href={`/founders/${founder.slug}`}
                className="group bg-white border border-brand-border card-hover block overflow-hidden">
                <div className="relative h-52 overflow-hidden bg-gray-100">
                  {founder.avatar ? (
                    <Image src={founder.avatar} alt={founder.name} fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover object-top group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                      <span className="font-serif font-bold text-4xl text-gray-400">{founder.name?.charAt(0)}</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  {founder.rank && (
                    <div className="absolute top-0 left-0 bg-brand-red px-3 py-1.5">
                      <span className="text-white font-bold text-xs">#{founder.rank}</span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 rounded-full border-2 border-white shadow -mt-8 relative z-10 flex-shrink-0 overflow-hidden bg-gray-200">
                      {founder.avatar && (
                        <Image src={founder.avatar} alt={founder.name} width={48} height={48} className="object-cover w-full h-full" />
                      )}
                    </div>
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
        )}
      </div>
    </div>
  );
}
