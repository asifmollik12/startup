import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models/SiteSettings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Terms of Use — Start-Up News" };

const defaultSections = [
  { title: "Acceptance of Terms", content: "By accessing or using Start-Up News, you agree to be bound by these Terms of Use. If you do not agree, please do not use our platform." },
  { title: "User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information when registering." },
  { title: "Content & Intellectual Property", content: "All editorial content, rankings, and data published on Start-Up News is owned by Start-Up News or its licensors. Reproduction requires written permission." },
  { title: "User-Generated Content", content: "By submitting ideas or comments, you grant Start-Up News a non-exclusive license to use and display that content. You retain ownership." },
  { title: "Prohibited Conduct", content: "You may not use our platform to post spam, harass users, distribute malware, scrape data, or engage in any activity that violates applicable law." },
  { title: "AI Features", content: "Our AI assistant is for informational purposes only. Responses may not always be accurate. Do not rely on AI content for financial or legal decisions." },
  { title: "Subscriptions & Payments", content: "Subscription fees are charged in BDT via Paymently. Subscriptions renew monthly unless cancelled. Refunds are handled case-by-case." },
  { title: "Governing Law", content: "These terms are governed by the laws of Bangladesh. Disputes shall be resolved in the courts of Dhaka, Bangladesh." },
];

async function getPageData() {
  try {
    await connectDB();
    const s = await SiteSettings.findOne({ key: "page_terms" }).lean() as any;
    return s?.value ?? null;
  } catch { return null; }
}

export default async function TermsPage() {
  const p = await getPageData();
  const title = p?.hero_title || "Terms of Use";
  const subtitle = p?.hero_subtitle || "Last updated: January 2026";
  const sections = p?.sections?.length ? p.sections : defaultSections;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-dark text-white py-16">
        <div className="container-wide">
          <span className="section-label mb-3 block">Legal</span>
          <h1 className="font-serif text-4xl font-bold">{title}</h1>
          <p className="text-gray-400 mt-3 text-sm">{subtitle}</p>
        </div>
      </div>
      <div className="container-wide py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          {sections.map((s: any, i: number) => (
            <div key={i}>
              <h2 className="font-serif text-xl font-bold text-brand-dark mb-3">{s.title}</h2>
              <p className="text-gray-600 leading-relaxed">{s.content}</p>
            </div>
          ))}
          <div className="border-t border-brand-border pt-8">
            <p className="text-sm text-gray-400">Questions? <a href="mailto:hello@start-upnews.com" className="text-brand-red hover:underline">hello@start-upnews.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
