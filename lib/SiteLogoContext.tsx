"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface LogoContextValue {
  logoUrl: string | null;
  setLogoUrl: (url: string | null) => void;
  loaded: boolean;
}

const SiteLogoContext = createContext<LogoContextValue>({
  logoUrl: null,
  setLogoUrl: () => {},
  loaded: false,
});

export function SiteLogoProvider({ children }: { children: React.ReactNode }) {
  const [logoUrl, setLogoUrlState] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch("/api/settings?key=site_logo")
      .then((r) => r.json())
      .then((val) => { if (val) setLogoUrlState(val); })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const setLogoUrl = (url: string | null) => {
    setLogoUrlState(url);
    // DB save is handled by the caller (settings page)
  };

  return (
    <SiteLogoContext.Provider value={{ logoUrl, setLogoUrl, loaded }}>
      {loaded ? children : children}
    </SiteLogoContext.Provider>
  );
}

export const useSiteLogo = () => useContext(SiteLogoContext);
