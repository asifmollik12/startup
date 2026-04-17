import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models/SiteSettings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Cookie Policy — Start-Up News" };

const defaultSections = [
  { title: "What Are Cookies?", content: "Cookies are small text files stored on your device when you visit our site. They help websites remember information about your visit." },
  { title: "Essential Cookies", content: "These keep you logged in and make the site function correctly. They cannot be disabled without affecting core functionality." },
  { title: "Functional Cookies", content: "These remember your preferences and settings to provide a more personalised experience across visits." },
  { title: "Analytics Cookies", content: "These help us understand how visitors use our site so we can improve it. Data is aggregated and anonymous." },
  { title: "Managing Cookies", content: "You can control cookies through your browser settings. Disabling essential cookies may affect your ability to log in or use certain features." },
];

async function getPageData() {
  try {
    await connectDB();
    const s = await SiteSettings.findOne({ key: "page_cookies" }).lean() as any;
    return s?.value ?? null;
  } catch { return null; }
}

export default async function CookiesPage() {
  const page = await getPageData();
  const heroTitle = page?.hero_title || "Cookie Policy";
  const heroSubtitle = page?.hero_subtitle || "Last updated: January 2026";
  const sections = page?.sections?.length ? page.sections : defaultSections;

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-dark text-white py-16">
        <div className="container-wide">
          <span className="section-label mb-3 block">Legal</span>
          <h1 className="font-serif text-4xl font-bold">{heroTitle}</h1>
          <p className="text-gray-400 mt-3 text-sm">{heroSubtitle}</p>
        </div>
      </div>
      <div className="container-wide py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          {sections.map((s: any, i: number) => (
            <div key={i}>
              <h2 className="font-serif text-xl font-bold text-brand-dark mb-3">{s.title}</h2>
              <div className="text-gray-600 leading-relaxed prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: s.content }} />
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
