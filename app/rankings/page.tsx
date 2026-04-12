import Image from "next/image";
import Link from "next/link";
import { founders } from "@/lib/data";
import { Trophy, Medal, Award, TrendingUp, ArrowRight } from "lucide-react";

export default function RankingsPage() {
  const top3 = founders.slice(0, 3);
  const rest = founders.slice(3);
  return (
    <div className="section-pad">
      <div className="container-wide">
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Trophy size={16} className="text-brand-gold" />
            <span className="section-label">Annual Rankings</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold text-brand-dark mb-4">
            Top Entrepreneurs<br />of Bangladesh 2026
          </h1>
          <div className="w-12 h-0.5 bg-brand-red mx-auto mb-4" />
          <p className="text-gray-500 max-w-xl mx-auto">Ranked by impact, innovation, revenue growth, and contribution to Bangladesh&apos;s entrepreneurial ecosystem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {top3.map((founder, i) => {
            const icons = [Trophy, Medal, Award];
            const Icon = icons[i];
            const borders = ["border-brand-gold/40 bg-amber-50", "border-gray-200 bg-white", "border-amber-700/20 bg-orange-50"];
            const iconColors = ["text-brand-gold", "text-gray-400", "text-amber-600"];
            return (
              <Link key={founder.id} href={`/founders/${founder.slug}`}
                className={`group relative border-2 ${borders[i]} p-6 text-center card-hover block ${i === 0 ? "md:-mt-4" : ""}`}>
                <div className="flex justify-center mb-2"><Icon size={24} className={iconColors[i]} /></div>
                <div className="text-5xl font-serif font-bold text-gray-100 mb-3">#{i + 1}</div>
                <div className="relative w-20 h-20 mx-auto mb-4 overflow-hidden rounded-full">
                  <Image src={founder.avatar} alt={founder.name} fill className="object-cover" />
                </div>
                <span className="section-label text-[9px]">{founder.industry}</span>
                <h2 className="font-serif font-bold text-xl text-brand-dark mt-1 group-hover:text-brand-red transition-colors">{founder.name}</h2>
                <p className="text-gray-500 text-sm">{founder.company}</p>
                {founder.netWorth && <p className="font-bold text-brand-gold mt-2">{founder.netWorth}</p>}
                <div className="mt-4 flex flex-wrap gap-1 justify-center">
                  {founder.achievements.slice(0, 2).map((ach) => (
                    <span key={ach} className="text-[9px] bg-white border border-brand-border px-2 py-0.5 text-gray-500">{ach}</span>
                  ))}
                </div>
              </Link>
            );
          })}
        </div>

        <div className="bg-white border border-brand-border overflow-hidden">
          <div className="bg-brand-dark px-6 py-4 flex items-center gap-3">
            <TrendingUp size={14} className="text-brand-gold" />
            <span className="font-bold uppercase tracking-wider text-xs text-white">Full Rankings — #4 to #{founders.length}</span>
          </div>
          {rest.map((founder, i) => (
            <Link key={founder.id} href={`/founders/${founder.slug}`}
              className="group flex items-center gap-4 px-6 py-4 border-b border-brand-border hover:bg-brand-gray transition-colors last:border-0">
              <span className="text-2xl font-serif font-bold text-gray-200 w-10 flex-shrink-0">#{i + 4}</span>
              <Image src={founder.avatar} alt={founder.name} width={44} height={44} className="rounded-full flex-shrink-0 object-cover" />
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-brand-dark group-hover:text-brand-red transition-colors">{founder.name}</h3>
                <p className="text-gray-500 text-xs">{founder.title} · {founder.company}</p>
              </div>
              <div className="hidden sm:block text-right">
                <span className="badge-gray text-[9px]">{founder.industry}</span>
                {founder.netWorth && <p className="text-brand-gold font-bold text-sm mt-1">{founder.netWorth}</p>}
              </div>
              <ArrowRight size={14} className="text-gray-300 group-hover:text-brand-red transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
