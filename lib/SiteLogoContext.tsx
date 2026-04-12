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

  useEffect(() => {
    fetch("/api/settings?key=site_logo")
      .then((r) => r.json())
      .then((val) => { if (val) setLogoUrlState(val); })
      .catch(() => {});
  }, []);

  const setLogoUrl = async (url: string | null) => {
    setLogoUrlState(url);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "site_logo", value: url }),
    });
  };

  return (
    <SiteLogoContext.Provider value={{ logoUrl, setLogoUrl }}>
      {children}
    </SiteLogoContext.Provider>
  );
}

export const useSiteLogo = () => useContext(SiteLogoContext);
