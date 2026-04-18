"use client";
import { useEffect, useState } from "react";

type AdSlot = { id: string; name: string; placement: string; type: string; imageUrl?: string; code?: string; linkUrl: string; active: boolean };

export default function InlineAdBanner({ label = "Advertisement", placement = "Between Article Paragraphs", fullSize = false }: { label?: string; placement?: string; fullSize?: boolean }) {
  const [ad, setAd] = useState<AdSlot | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/ads").then(r => r.json()).then((slots: AdSlot[]) => {
      const match = slots.find(s => s.active && s.placement === placement);
      setAd(match ?? null);
    }).catch(() => setAd(null));
  }, [placement]);

  // Still loading — render nothing to avoid layout shift
  if (ad === undefined) return null;

  return (
    <div className="w-full">
      {ad?.type === "code" && ad.code ? (
        <div dangerouslySetInnerHTML={{ __html: ad.code }} />
      ) : ad?.imageUrl ? (
        <a href={ad.linkUrl || "#"} target="_blank" rel="noopener noreferrer" className="block w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={ad.imageUrl} alt={ad.name} className={`w-full block object-cover ${fullSize ? "h-[200px]" : "h-[90px]"}`} />
        </a>
      ) : (
        <a href="/advertise"
          className="group relative flex items-center justify-between overflow-hidden bg-brand-dark border border-white/10 px-8 py-6 hover:border-brand-red transition-colors cursor-pointer w-full">
          <div className="relative flex items-center gap-5">
            <div className="w-10 h-10 bg-brand-red flex items-center justify-center flex-shrink-0">
              <span className="text-white font-serif font-bold text-sm">SUN</span>
            </div>
            <div>
              <p className="text-white font-serif font-bold text-base leading-tight">Grow Your Business with Start-Up News</p>
              <p className="text-gray-500 text-xs mt-0.5">Premium placements across Bangladesh&apos;s #1 startup media platform</p>
            </div>
          </div>
          <span className="relative hidden md:block bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 group-hover:bg-red-700 transition-colors whitespace-nowrap">
            Advertise Now →
          </span>
        </a>
      )}
    </div>
  );
}
