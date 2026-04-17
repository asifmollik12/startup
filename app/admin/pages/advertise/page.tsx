"use client";
import PageEditor from "@/components/admin/PageEditor";
import { useEffect, useState } from "react";

const defaultStats = [
  { value: "2M+", label: "Monthly Readers" },
  { value: "500+", label: "Founders in Network" },
  { value: "64", label: "Districts Covered" },
  { value: "50K+", label: "Newsletter Subscribers" },
];

export default function AdminAdvertisePage() {
  const [ready, setReady] = useState(false);

  // Pre-seed stats if not set
  useEffect(() => {
    fetch("/api/settings?key=page_advertise")
      .then(r => r.json())
      .then(v => {
        if (!v?.stats) {
          fetch("/api/settings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              key: "page_advertise",
              value: { hero_title: v?.hero_title || "", hero_subtitle: v?.hero_subtitle || "", sections: v?.sections || [], stats: defaultStats },
            }),
          });
        }
        setReady(true);
      });
  }, []);

  if (!ready) return null;
  return <PageEditor pageKey="page_advertise" label="Advertise" />;
}
