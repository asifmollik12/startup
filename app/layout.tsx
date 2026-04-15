import type { Metadata } from "next";
import "./globals.css";
import SiteLayout from "@/components/layout/SiteLayout";
import { SiteLogoProvider } from "@/lib/SiteLogoContext";
import { FooterLogoProvider } from "@/lib/FooterLogoContext";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models/SiteSettings";

export const revalidate = 0;

async function getSetting(key: string): Promise<string | null> {
  try {
    await connectDB();
    const s = await SiteSettings.findOne({ key }).lean() as any;
    return s?.value || null;
  } catch { return null; }
}

export async function generateMetadata(): Promise<Metadata> {
  const [favicon, seoTitle, seoDesc, seoKeywords, ogImage] = await Promise.all([
    getSetting("favicon"),
    getSetting("seoTitle"),
    getSetting("seoDescription"),
    getSetting("seoKeywords"),
    getSetting("ogImage"),
  ]);

  const title = seoTitle || "Start-Up News — Bangladesh's Premier Business Magazine";
  const description = seoDesc || "Discover Bangladesh's top entrepreneurs, startups, rankings, and business ideas. The definitive voice of Bangladeshi innovation.";
  const keywords = seoKeywords || "Bangladesh entrepreneurs, startups, business, founders, rankings";

  return {
    title,
    description,
    keywords,
    openGraph: {
      title,
      description,
      type: "website",
      ...(ogImage ? { images: [{ url: ogImage, width: 1200, height: 630 }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    ...(favicon ? { icons: { icon: favicon, shortcut: favicon } } : {}),
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const favicon = await getSetting("favicon");
  return (
    <html lang="en">
      <head>
        {favicon && <link rel="icon" href={favicon} />}
        {favicon && <link rel="shortcut icon" href={favicon} />}
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
