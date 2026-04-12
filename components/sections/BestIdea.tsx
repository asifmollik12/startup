import Link from "next/link";
import { ideas } from "@/lib/data";
import { Lightbulb, ThumbsUp, Trophy, ArrowRight } from "lucide-react";

export default function BestIdea() {
  const winner = ideas.find((i) => i.winner);
  const runners = ideas.filter((i) => !i.winner);
  return (
    <section className="pb-16 lg:pb-24 pt-8 lg:pt-12 bg-white">
      <div className="container-wide">
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb size={14} className="text-brand-gold" />
              <span className="section-label">Community Vote</span>
            </div>
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-brand-dark">Best Idea of the Month</h2>
            <div className="divider-red mt-3" />
          </div>
          <Link href="/ideas" className="hidden sm:flex items-center gap-2 text-xs text-gray-500 hover:text-brand-red transition-colors uppercase tracking-wider">
            Submit Idea <ArrowRight size={13} />
          </Link>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {winner && (
            <div className="lg:col-span-2 bg-brand-dark text-white p-8 lg:p-10 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-red/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-4">
                  <Trophy size={16} className="text-brand-gold" />
                  <span className="text-brand-gold text-xs font-bold uppercase tracking-widest">Winner — {winner.month}</span>
                </div>
                <span className="badge bg-brand-red/20 text-brand-red border border-brand-red/30 text-[9px] mb-4">{winner.category}</span>
                <h3 className="font-serif text-2xl lg:text-3xl font-bold mb-3 leading-tight">{winner.title}</h3>
                <p className="text-gray-300 leading-relaxed mb-8">{winner.description}</p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Submitted by</p>
                    <p className="font-semibold text-white">{winner.submittedBy}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-white/10 px-5 py-3">
                    <ThumbsUp size={15} className="text-brand-gold" />
                    <span className="font-bold text-brand-gold text-xl">{winner.votes.toLocaleString()}</span>
                    <span className="text-gray-400 text-xs">votes</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="flex flex-col gap-4">
            <h4 className="section-label">Runners Up</h4>
            {runners.map((idea) => (
              <div key={idea.id} className="border border-brand-border p-5 hover:border-brand-red transition-colors bg-white">
                <div className="flex items-start justify-between mb-2">
                  <span className="badge-gray text-[9px]">{idea.category}</span>
                  <div className="flex items-center gap-1 text-gray-400 text-xs"><ThumbsUp size={10} /><span>{idea.votes.toLocaleString()}</span></div>
                </div>
                <h4 className="font-serif font-bold text-base text-brand-dark mb-1 leading-snug">{idea.title}</h4>
                <p className="text-gray-500 text-sm line-clamp-2">{idea.description}</p>
                <p className="text-xs text-gray-400 mt-2">by {idea.submittedBy}</p>
              </div>
            ))}
            <Link href="/ideas" className="btn-outline text-xs text-center justify-center">Submit Your Idea</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
