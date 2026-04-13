"use client";
import { useSiteLogo } from "@/lib/SiteLogoContext";

interface SiteLogoProps {
  badgeClass?: string;
  nameClass?: string;
  subtitleClass?: string;
  badge?: string;
  name?: string;
  subtitle?: string;
}

export default function SiteLogo({
  badgeClass = "bg-brand-red text-white font-serif font-bold text-lg px-2.5 py-1 leading-tight tracking-wider",
  nameClass = "font-serif font-bold text-lg text-brand-dark tracking-tight",
  subtitleClass = "text-[8px] tracking-[0.35em] uppercase text-gray-400",
  badge = "SUN",
  name = "START-UP NEWS",
  subtitle = "Bangladesh Business",
}: SiteLogoProps) {
  const { logoUrl, loaded } = useSiteLogo();

  if (!loaded) {
    // Render placeholder same size to avoid layout shift
    return <div className="h-10 w-32" />;
  }

  if (logoUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={logoUrl} alt={name} className="h-10 w-auto object-contain" />
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className={badgeClass}>{badge}</div>
      <div className="leading-tight">
        <div className={nameClass}>{name}</div>
        <div className={subtitleClass}>{subtitle}</div>
      </div>
    </div>
  );
}
