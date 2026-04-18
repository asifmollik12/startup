"use client";
import PageEditor from "@/components/admin/PageEditor";

const defaults = {
  hero_badge: "Advertise",
  hero_title: "Reach Bangladesh's Top Entrepreneurs",
  hero_subtitle: "Start-Up News connects your brand with 2M+ monthly readers — founders, investors, operators, and business leaders across Bangladesh.",
  hero_cta_text: "Get in Touch",
  hero_cta_href: "mailto:advertise@start-upnews.com",
  sections_badge: "Packages",
  sections_title: "Advertising Options",
  sections: [
    { title: "Banner Ads", content: "Homepage and article page display banners. Reach our full audience with top banner, sidebar, and mobile placements. Includes weekly impressions report." },
    { title: "Sponsored Content", content: "Native editorial-style sponsored stories written by our team. Promoted across all channels with social media amplification and permanent archive placement." },
    { title: "Newsletter Sponsorship", content: "Dedicated placement in our weekly newsletter reaching 50,000+ subscribers. High open rates, targeted BD audience, and click tracking report included." },
    { title: "Custom Packages", content: "Need something tailored? We work with brands of all sizes on custom campaigns, events, and partnerships. Contact us to discuss your goals." },
  ],
  stats: [
    { value: "2M+", label: "Monthly Readers" },
    { value: "500+", label: "Founders in Network" },
    { value: "64", label: "Districts Covered" },
    { value: "50K+", label: "Newsletter Subscribers" },
  ],
  cta_title: "Ready to advertise?",
  cta_subtitle: "Get in touch and we'll put together a package that works for your brand.",
  cta_btn_text: "advertise@start-upnews.com",
  cta_btn_href: "mailto:advertise@start-upnews.com",
};

export default function AdminAdvertisePage() {
  return <PageEditor pageKey="page_advertise" label="Advertise" showStats showHeroCta showSectionsMeta showBottomCta defaults={defaults} />;
}
