import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy — Start-Up News" };

const sections = [
  {
    title: "Information We Collect",
    content: "We collect information you provide directly — such as your name, email address, and password when you create an account. We also collect usage data including pages visited, articles read, and features used to improve our platform.",
  },
  {
    title: "How We Use Your Information",
    content: "We use your information to provide and improve our services, send newsletters you've subscribed to, process payments, and communicate with you about your account. We do not sell your personal data to third parties.",
  },
  {
    title: "Data Storage & Security",
    content: "Your data is stored securely on MongoDB Atlas servers. Passwords are hashed using bcrypt. We use industry-standard security practices to protect your information from unauthorized access.",
  },
  {
    title: "Cookies",
    content: "We use cookies to keep you logged in and to understand how our site is used. You can disable cookies in your browser settings, though some features may not work correctly without them.",
  },
  {
    title: "Third-Party Services",
    content: "We use Cloudinary for image storage, ElevenLabs for voice AI, and Paymently for payment processing. Each of these services has their own privacy policies governing how they handle data.",
  },
  {
    title: "Your Rights",
    content: "You may request access to, correction of, or deletion of your personal data at any time by contacting us at hello@start-upnews.com. We will respond within 30 days.",
  },
  {
    title: "Changes to This Policy",
    content: "We may update this policy from time to time. We will notify registered users of significant changes via email. Continued use of the platform after changes constitutes acceptance.",
  },
];

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-dark text-white py-16">
        <div className="container-wide">
          <span className="section-label mb-3 block">Legal</span>
          <h1 className="font-serif text-4xl font-bold">Privacy Policy</h1>
          <p className="text-gray-400 mt-3 text-sm">Last updated: January 2026</p>
        </div>
      </div>
      <div className="container-wide py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          <p className="text-gray-600 leading-relaxed border-l-4 border-brand-red pl-5">
            Start-Up News is committed to protecting your privacy. This policy explains what data we collect, how we use it, and your rights as a user of our platform.
          </p>
          {sections.map(({ title, content }) => (
            <div key={title}>
              <h2 className="font-serif text-xl font-bold text-brand-dark mb-3">{title}</h2>
              <p className="text-gray-600 leading-relaxed">{content}</p>
            </div>
          ))}
          <div className="border-t border-brand-border pt-8">
            <p className="text-sm text-gray-400">Questions? Contact us at <a href="mailto:hello@start-upnews.com" className="text-brand-red hover:underline">hello@start-upnews.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
