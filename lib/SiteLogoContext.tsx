"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface LogoContextValue {
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
}

const SiteLogoContext = createContext<LogoContextValue>({
  logoUrl: null,
  setLogoUrl: () => {},
});

export function SiteLogoProvider({ children }: { children: React.ReactNode }) {
  const [logoUrl, setLogoUrlState] = useState<string | null>(null);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem("site_logo");
    if (stored) setLogoUrlState(stored);
  }, []);

  const setLogoUrl = (url: string | null) => {
    setLogoUrlState(url);
    if (url) localStorage.setItem("site_logo", url);
    else localStorage.removeItem("site_logo");
  };

  return (
    <SiteLogoContext.Provider value={{ logoUrl, setLogoUrl }}>
      {children}
    </SiteLogoContext.Provider>
  );
}

export const useSiteLogo = () => useContext(SiteLogoContext);
