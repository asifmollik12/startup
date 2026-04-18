"use client";
import { useEffect, useState } from "react";

type AdSlot = { id: string; name: string; placement: string; type: string; imageUrl?: string; code?: string; linkUrl: string; active: boolean };

function useAd(placement: string) {
  const [ad, setAd] = useState<AdSlot | null>(null);
  useEffect(() => {
    fetch("/api/ads").then(r => r.json()).then((slots: AdSlot[]) => {
      const match = slots.find(s => s.active && s.placement === placement);
      setAd(match ?? null);
    }).catch(() => {});
  }, [placement]);
  return ad;
}

interface AdBannerProps {
  variant?: "leaderboard" | "rectangle" | "sidebar";
  placement?: string;
  label?: string;
}

export default function AdBanner({ variant = "leaderboard", placement, label = "Advertisement" }: AdBannerProps) {
  const placementKey = placement ?? (variant === "leaderboard" ? "Homepage Hero" : "Article Sidebar");
  const ad = useAd(placementKey);

  if (variant === "leaderboard") {
    return (
      <div className="w-full bg-brand-gray border-y border-brand-border py-3">
        <div className="container-wide">
          <div className="flex flex-col items-center justify-center">
            <span className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2">{label}</span>
            <div className="w-full max-w-[728px] h-[90px] overflow-hidden border border-brand-border">
              {ad?.type === "code" && ad.code ? (
                <div dangerouslySetInnerHTML={{ __html: ad.code }} />
              ) : ad?.imageUrl ? (
                <a href={ad.linkUrl || "#"} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={ad.imageUrl} alt={ad.name} className="w-full h-full object-cover" />
                </a>
              ) : (
                <a href="/advertise" className="group relative flex items-center justify-between w-full h-full bg-brand-dark px-8">
                  <div className="flex items-center gap-5">
                    <div className="w-12 h-12 bg-brand-red flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-serif font-bold text-lg">BD</span>
                    </div>
                    <div>
                      <p className="text-white font-serif font-bold text-lg leading-tight">Grow Your Business in Bangladesh</p>
                      <p className="text-gray-400 text-xs mt-0.5">Reach 2M+ entrepreneurs, founders & investors</p>
                    </div>
                  </div>
                  <span className="hidden sm:block bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5 whitespace-nowrap">Advertise Now</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "rectangle") {
    return (
      <div className="w-full">
        <span className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 text-center">{label}</span>
        <div className="w-full h-[250px] border border-brand-border overflow-hidden">
          {ad?.type === "code" && ad.code ? (
            <div dangerouslySetInnerHTML={{ __html: ad.code }} />
          ) : ad?.imageUrl ? (
            <a href={ad.linkUrl || "#"} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ad.imageUrl} alt={ad.name} className="w-full h-full object-cover" />
            </a>
          ) : (
            <a href="/advertise" className="flex flex-col items-center justify-center w-full h-full bg-brand-dark">
              <div className="w-10 h-10 bg-brand-red flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-serif font-bold">BD</span>
              </div>
              <p className="text-white font-serif font-bold text-xl mb-1">Advertise Here</p>
              <p className="text-gray-400 text-xs mb-4">300 × 250 · Premium Placement</p>
              <span className="bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2">Get Started</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <span className="block text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2">{label}</span>
      <div className="w-full h-[600px] border border-brand-border overflow-hidden">
        {ad?.type === "code" && ad.code ? (
          <div dangerouslySetInnerHTML={{ __html: ad.code }} />
        ) : ad?.imageUrl ? (
          <a href={ad.linkUrl || "#"} target="_blank" rel="noopener noreferrer" className="block w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ad.imageUrl} alt={ad.name} className="w-full h-full object-cover" />
          </a>
        ) : (
          <a href="/advertise" className="flex flex-col items-center justify-center w-full h-full bg-brand-dark">
            <div className="w-12 h-12 bg-brand-red flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-serif font-bold text-lg">BD</span>
            </div>
            <p className="text-white font-serif font-bold text-2xl mb-2 leading-tight text-center">Your Brand<br />Here</p>
            <p className="text-gray-400 text-xs mb-6">160 × 600 · Skyscraper</p>
            <span className="bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2.5">Advertise</span>
          </a>
        )}
      </div>
    </div>
  );
}
