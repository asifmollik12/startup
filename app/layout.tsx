import type { Metadata } from "next";
import "./globals.css";
import SiteLayout from "@/components/layout/SiteLayout";
import { SiteLogoProvider } from "@/lib/SiteLogoContext";
import { FooterLogoProvider } from "@/lib/FooterLogoContext";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models/SiteSettings";

export const revalidate = 60; // cache layout for 60s — settings rarely change

async function getAllSettings() {
  try {
    await connectDB();
    const settings = await SiteSettings.find({
      key: { $in: ["favicon", "seoTitle", "seoDescription", "seoKeywords", "ogImage"] }
    }).lean() as any[];
    return Object.fromEntries(settings.map((s: any) => [s.key, s.value]));
  } catch { return {}; }
}

export async function generateMetadata(): Promise<Metadata> {
  const s = await getAllSettings();
  const title = s.seoTitle || "Start-Up News — Bangladesh's Premier Business Magazine";
  const description = s.seoDescription || "Discover Bangladesh's top entrepreneurs, startups, rankings, and business ideas. The definitive voice of Bangladeshi innovation.";
  const keywords = s.seoKeywords || "Bangladesh entrepreneurs, startups, business, founders, rankings";
  return {
    title, description, keywords,
    openGraph: { title, description, type: "website", ...(s.ogImage ? { images: [{ url: s.ogImage, width: 1200, height: 630 }] } : {}) },
    twitter: { card: "summary_large_image", title, description, ...(s.ogImage ? { images: [s.ogImage] } : {}) },
    ...(s.favicon ? { icons: { icon: s.favicon, shortcut: s.favicon } } : {}),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const s = await getAllSettings();
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="dns-prefetch" href="//res.cloudinary.com" />
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        {s.favicon && <link rel="icon" href={s.favicon} />}
        {s.favicon && <link rel="shortcut icon" href={s.favicon} />}
      </head>
      <body>
        <SiteLogoProvider>
          <FooterLogoProvider>
            <SiteLayout>{children}</SiteLayout>
          </FooterLogoProvider>
        </SiteLogoProvider>
      </body>
    </html>
  );
}
