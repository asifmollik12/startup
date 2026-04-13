import type { Metadata } from "next";
import "./globals.css";
import SiteLayout from "@/components/layout/SiteLayout";
import { SiteLogoProvider } from "@/lib/SiteLogoContext";
import { FooterLogoProvider } from "@/lib/FooterLogoContext";

export const metadata: Metadata = {
  title: "Start-Up News — Bangladesh's Premier Business Magazine",
  description:
    "Discover Bangladesh's top entrepreneurs, startups, rankings, and business ideas. The definitive voice of Bangladeshi innovation.",
  keywords: "Bangladesh entrepreneurs, startups, business, founders, rankings",
  openGraph: {
    title: "Start-Up News",
    description: "Bangladesh's Premier Business Magazine",
    type: "website",
  },
};

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
