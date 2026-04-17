import type { Metadata } from "next";
import { connectDB } from "@/lib/mongodb";
import { SiteSettings } from "@/lib/models/SiteSettings";

export const revalidate = 60;
export const metadata: Metadata = { title: "Privacy Policy — Start-Up News" };

const defaultSections = [
  { title: "Information We Collect", content: "We collect information you provide directly — name, email, and password when you create an account. We also collect usage data to improve our platform." },
  { title: "How We Use Your Information", content: "We use your information to provide services, send newsletters, process payments, and communicate about your account. We do not sell your personal data." },
  { title: "Data Storage & Security", content: "Your data is stored securely on MongoDB Atlas. Passwords are hashed using bcrypt. We use industry-standard security practices." },
  { title: "Cookies", content: "We use cookies to keep you logged in and understand how our site is used. You can disable cookies in your browser settings." },
  { title: "Third-Party Services", content: "We use Cloudinary for images, ElevenLabs for voice AI, and Paymently for payments. Each has their own privacy policies." },
  { title: "Your Rights", content: "You may request access to, correction of, or deletion of your personal data at any time by contacting hello@start-upnews.com." },
  { title: "Changes to This Policy", content: "We may update this policy from time to time. We will notify registered users of significant changes via email." },
];

async function getPageData() {
  try {
    await connectDB();
    const s = await SiteSettings.findOne({ key: "page_privacy" }).lean() as any;
    return s?.value ?? null;
  } catch { return null; }
}

export default async function PrivacyPage() {
  const p = await getPageData();
  const title = p?.hero_title || "Privacy Policy";
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
