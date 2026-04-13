"use client";
import { createContext, useContext, useEffect, useState } from "react";

interface DashboardLogoContextValue {
  dashboardLogoUrl: string | null;
  setDashboardLogoUrl: (url: string | null) => void;
}

const DashboardLogoContext = createContext<DashboardLogoContextValue>({
  dashboardLogoUrl: null,
  setDashboardLogoUrl: () => {},
});

export function DashboardLogoProvider({ children }: { children: React.ReactNode }) {
  const [dashboardLogoUrl, setDashboardLogoUrlState] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/settings?key=dashboard_logo")
      .then((r) => r.json())
      .then((val) => { if (val) setDashboardLogoUrlState(val); })
      .catch(() => {});
  }, []);

  const setDashboardLogoUrl = async (url: string | null) => {
    setDashboardLogoUrlState(url);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "dashboard_logo", value: url }),
    });
  };

  return (
    <DashboardLogoContext.Provider value={{ dashboardLogoUrl, setDashboardLogoUrl }}>
      {children}
    </DashboardLogoContext.Provider>
  );
}

export const useDashboardLogo = () => useContext(DashboardLogoContext);
