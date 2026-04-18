import PageEditor from "@/components/admin/PageEditor";

const defaults = {
  hero_title: "Privacy Policy",
  hero_subtitle: "Last updated: January 2026",
  sections: [
    { title: "Information We Collect", content: "We collect information you provide directly — name, email, and password when you create an account. We also collect usage data to improve our platform." },
    { title: "How We Use Your Information", content: "We use your information to provide services, send newsletters, process payments, and communicate about your account. We do not sell your personal data." },
    { title: "Data Storage & Security", content: "Your data is stored securely on MongoDB Atlas. Passwords are hashed using bcrypt. We use industry-standard security practices." },
    { title: "Cookies", content: "We use cookies to keep you logged in and understand how our site is used. You can disable cookies in your browser settings." },
    { title: "Third-Party Services", content: "We use Cloudinary for images, ElevenLabs for voice AI, and Paymently for payments. Each has their own privacy policies." },
    { title: "Your Rights", content: "You may request access to, correction of, or deletion of your personal data at any time by contacting hello@start-upnews.com." },
    { title: "Changes to This Policy", content: "We may update this policy from time to time. We will notify registered users of significant changes via email." },
  ],
};

export default function AdminPrivacyPage() {
  return <PageEditor pageKey="page_privacy" label="Privacy Policy" showStats={false} showHeroCta={false} showSectionsMeta={false} showBottomCta={false} defaults={defaults} />;
}
