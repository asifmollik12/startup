import Image from "next/image";
import Link from "next/link";
import { founders } from "@/lib/data";
import { Trophy, TrendingUp, ArrowUpRight, Crown, Medal, Award } from "lucide-react";

export default function RankingsPage() {
  const top3 = founders.slice(0, 3);
  const rest = founders.slice(3);

  const podiumOrder = [top3[1], top3[0], top3[2]];
  const podiumRanks = [2, 1, 3];
  const podiumHeights = ["h-28", "h-36", "h-24"];
  const podiumIcons = [Medal, Crown, Award];
  const podiumColors = ["text-gray-400", "text-brand-gold", "text-amber-600"];
  const podiumBg = ["bg-gray-100", "bg-brand-gold/10 border-brand-gold/30", "bg-amber-50 border-amber-200"];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-brand-dark text-white py-16 px-4">
        <div className="container-wide text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Trophy size={14} className="text-brand-gold" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-gold">Annual Rankings 2026</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-4">
            Top Entrepreneurs<br />of Bangladesh
          </h1>
          <div className="w-10 h-0.5 bg-brand-red mx-auto mb-5" />
          <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
            Ranked by impact, innovation, revenue growth, and contribution to Bangladesh's entrepreneurial ecosystem.
          </p>
          <div className="flex items-center justify-center gap-8 mt-8">
            {[
              { value: founders.length, label: "Founders Ranked" },
              { value: "12", label: "Industries" },
              { value: "2026", label: "Edition" },
            ].map(({ value, label }) => (
              <div key={label} className="text-center">
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container-wide py-14 px-4">
        {/* Podium */}
        <div className="flex items-end justify-center gap-4 mb-14">
          {podiumOrder.map((founder, i) => {
            const rank = podiumRanks[i];
            const Icon = podiumIcons[i];
            const isFirst = rank === 1;
            return (
              <Link key={founder.id} href={`/founders/${founder.slug}`}
                className={`group flex flex-col items-center w-full max-w-[220px] ${isFirst ? "z-10" : ""}`}>
                {/* Card */}
                <div className={`w-full border-2 ${podiumBg[i]} rounded-2xl p-5 text-center transition-all duration-200 hover:shadow-xl hover:-translate-y-1 ${isFirst ? "shadow-lg" : ""}`}>
                  <Icon size={20} className={`${podiumColors[i]} mx-auto mb-3`} />
                  <div className={`relative mx-auto mb-3 rounded-full overflow-hidden border-4 ${isFirst ? "w-20 h-20 border-brand-gold/40" : "w-16 h-16 border-gray-200"}`}>
                    <Image src={founder.avatar} alt={founder.name} fill className="object-cover" />
                  </div>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-brand-red">{founder.industry}</span>
                  <h2 className={`font-serif font-bold text-brand-dark mt-1 group-hover:text-brand-red transition-colors ${isFirst ? "text-lg" : "text-base"}`}>{founder.name}</h2>
                  <p className="text-gray-500 text-xs mt-0.5">{founder.company}</p>
                  {founder.netWorth && <p className={`font-bold text-brand-gold mt-2 ${isFirst ? "text-base" : "text-sm"}`}>{founder.netWorth}</p>}
                  {isFirst && (
                    <div className="mt-3 flex flex-wrap gap-1 justify-center">
                      {founder.achievements.slice(0, 2).map((a) => (
                        <span key={a} className="text-[8px] bg-white border border-gray-200 px-2 py-0.5 text-gray-500 rounded">{a}</span>
                      ))}
                    </div>
                  )}
                </div>
                {/* Podium base */}
                <div className={`w-full ${podiumHeights[i]} ${isFirst ? "bg-brand-gold" : rank === 2 ? "bg-gray-300" : "bg-amber-600/60"} rounded-b-lg flex items-center justify-center`}>
                  <span className={`font-serif font-black text-white ${isFirst ? "text-4xl" : "text-3xl"}`}>#{rank}</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Full Rankings */}
        <div className="border border-brand-border rounded-2xl overflow-hidden shadow-sm">
          <div className="bg-brand-dark px-6 py-4 flex items-center gap-3">
            <TrendingUp size={14} className="text-brand-gold" />
            <span className="font-bold uppercase tracking-wider text-xs text-white">Full Rankings — #4 to #{founders.length}</span>
          </div>
          {rest.map((founder, i) => (
            <Link key={founder.id} href={`/founders/${founder.slug}`}
              className="group flex items-center gap-5 px-6 py-4 border-b border-brand-border hover:bg-brand-gray transition-colors last:border-0">
              <div className="w-8 flex-shrink-0 text-center">
                <span className="text-xl font-serif font-bold text-gray-200">#{i + 4}</span>
              </div>
              <div className="relative w-11 h-11 flex-shrink-0">
                <Image src={founder.avatar} alt={founder.name} fill className="rounded-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-serif font-bold text-brand-dark group-hover:text-brand-red transition-colors text-sm">{founder.name}</h3>
                <p className="text-gray-400 text-xs mt-0.5">{founder.title} · {founder.company}</p>
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <span className="text-[9px] font-semibold uppercase tracking-wider bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{founder.industry}</span>
                {founder.netWorth && <span className="text-brand-gold font-bold text-sm">{founder.netWorth}</span>}
              </div>
              <ArrowUpRight size={15} className="text-gray-300 group-hover:text-brand-red transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
