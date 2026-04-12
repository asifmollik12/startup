import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TopBanner from "@/components/sections/TopBanner";

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
        <Navbar />
        <TopBanner />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
