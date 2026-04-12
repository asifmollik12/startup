"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface FooterLogoContextValue {
  footerLogoUrl: string | null;
  setFooterLogoUrl: (url: string | null) => void;
}

const FooterLogoContext = createContext<FooterLogoContextValue>({
  footerLogoUrl: null,
  setFooterLogoUrl: () => {},
});

export function FooterLogoProvider({ children }: { children: React.ReactNode }) {
  const [footerLogoUrl, setFooterLogoUrlState] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings?key=footer_logo")
      .then((r) => r.json())
      .then((val) => { if (val) setFooterLogoUrlState(val); })
      .catch(() => {});
  }, []);

  const setFooterLogoUrl = async (url: string | null) => {
    setFooterLogoUrlState(url);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "footer_logo", value: url }),
    });
  };

  return (
    <FooterLogoContext.Provider value={{ footerLogoUrl, setFooterLogoUrl }}>
      {children}
    </FooterLogoContext.Provider>
  );
}

export const useFooterLogo = () => useContext(FooterLogoContext);
