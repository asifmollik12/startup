import type { Metadata } from "next";
import "./globals.css";
import SiteLayout from "@/components/layout/SiteLayout";
import { SiteLogoProvider } from "@/lib/SiteLogoContext";
import { FooterLogoProvider } from "@/lib/FooterLogoContext";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models/SiteSettings";

export const revalidate = 0;

async function getFavicon(): Promise<string | null> {
  try {
    await connectDB();
    const s = await SiteSettings.findOne({ key: "favicon" }).lean() as any;
    return s?.value ?? null;
  } catch { return null; }
}

export async function generateMetadata(): Promise<Metadata> {
  const favicon = await getFavicon();
  return {
    title: "Start-Up News — Bangladesh's Premier Business Magazine",
    description: "Discover Bangladesh's top entrepreneurs, startups, rankings, and business ideas. The definitive voice of Bangladeshi innovation.",
    keywords: "Bangladesh entrepreneurs, startups, business, founders, rankings",
    openGraph: {
      title: "Start-Up News",
      description: "Bangladesh's Premier Business Magazine",
      type: "website",
    },
    ...(favicon ? { icons: { icon: favicon, shortcut: favicon } } : {}),
  };
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
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
