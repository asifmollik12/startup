"use client";
import { useEffect, useState } from "react";
import AdSlotRenderer from "./AdSlotRenderer";

type AdSlot = { id: string; name: string; placement: string; type: string; imageUrl?: string; code?: string; linkUrl: string; active: boolean };

export default function InlineAdBanner({ placement = "Between Article Paragraphs", fullSize = false }: { placement?: string; fullSize?: boolean }) {
  const [ad, setAd] = useState<AdSlot | null | undefined>(undefined);

  useEffect(() => {
    fetch("/api/ads").then(r => r.json()).then((slots: AdSlot[]) => {
      const match = slots.find(s => s.active && s.placement === placement);
      setAd(match ?? null);
    }).catch(() => setAd(null));
  }, [placement]);

  if (ad === undefined) return null;

  // Google AdSense / HTML code — use script-safe renderer
  if (ad?.type === "code" && ad.code) {
    return (
      <div className="w-full flex justify-center py-2">
        <AdSlotRenderer code={ad.code} />
      </div>
    );
  }

  // Manual image upload
  if (ad?.imageUrl) {
    return (
      <a href={ad.linkUrl || "#"} target="_blank" rel="noopener noreferrer"
        className="block w-full overflow-hidden border-y border-brand-border hover:opacity-95 transition-opacity">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={ad.imageUrl} alt={ad.name} className="w-full block h-auto" />
      </a>
    );
  }

  // Default fallback — no ad configured
  return (
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
  );
}
