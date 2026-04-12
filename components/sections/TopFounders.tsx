import Image from "next/image";
import Link from "next/link";
import { founders } from "@/lib/data";
import { ArrowRight, Trophy } from "lucide-react";

export default function TopFounders() {
  const top = founders.slice(0, 5);
  return (
    <section className="bg-brand-dark section-pad">
      <div className="container-wide">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Trophy size={14} className="text-brand-gold" />
              <span className="section-label">2026 Rankings</span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white">Top Entrepreneurs</h2>
            <div className="divider-red mt-3" />
          </div>
          <Link href="/rankings" className="hidden sm:flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors uppercase tracking-wider">
            Full Rankings <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {top.map((founder, i) => (
            <Link key={founder.id} href={`/founders/${founder.slug}`} className="group relative overflow-hidden aspect-[3/4] block">
              <Image src={founder.avatar} alt={founder.name} fill
                className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
              <div className="absolute inset-0 border border-transparent group-hover:border-brand-red transition-colors duration-300" />
              <div className="absolute top-0 left-0 bg-brand-red px-2 py-1">
                <span className="text-white font-bold text-xs">#{i + 1}</span>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <p className="text-brand-gold text-[9px] font-bold uppercase tracking-wider mb-0.5">{founder.industry}</p>
                <h3 className="text-white font-serif font-bold text-sm leading-tight">{founder.name}</h3>
                <p className="text-gray-400 text-[10px]">{founder.company}</p>
                {founder.netWorth && <p className="text-brand-gold text-xs font-bold mt-1">{founder.netWorth}</p>}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
