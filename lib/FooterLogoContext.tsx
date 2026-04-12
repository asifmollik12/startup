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
    const stored = localStorage.getItem("footer_logo");
    if (stored) setFooterLogoUrlState(stored);
  }, []);

  const setFooterLogoUrl = (url: string | null) => {
    setFooterLogoUrlState(url);
    if (url) localStorage.setItem("footer_logo", url);
    else localStorage.removeItem("footer_logo");
  };

  return (
    <FooterLogoContext.Provider value={{ footerLogoUrl, setFooterLogoUrl }}>
      {children}
    </FooterLogoContext.Provider>
  );
}

export const useFooterLogo = () => useContext(FooterLogoContext);
