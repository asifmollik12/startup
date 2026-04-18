import PageEditor from "@/components/admin/PageEditor";

const defaults = {
  hero_title: "Cookie Policy",
  hero_subtitle: "Last updated: January 2026",
  sections: [
    { title: "What Are Cookies?", content: "Cookies are small text files stored on your device when you visit our site. They help websites remember information about your visit." },
    { title: "Essential Cookies", content: "These keep you logged in and make the site function correctly. They cannot be disabled without affecting core functionality." },
    { title: "Functional Cookies", content: "These remember your preferences and settings to provide a more personalised experience across visits." },
    { title: "Analytics Cookies", content: "These help us understand how visitors use our site so we can improve it. Data is aggregated and anonymous." },
    { title: "Managing Cookies", content: "You can control cookies through your browser settings. Disabling essential cookies may affect your ability to log in or use certain features." },
  ],
};

export default function AdminCookiesPage() {
  return <PageEditor pageKey="page_cookies" label="Cookie Policy" showStats={false} showHeroCta={false} showSectionsMeta={false} showBottomCta={false} defaults={defaults} />;
}
