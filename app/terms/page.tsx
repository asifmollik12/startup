import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Use — Start-Up News" };

const sections = [
  { title: "Acceptance of Terms", content: "By accessing or using Start-Up News, you agree to be bound by these Terms of Use. If you do not agree, please do not use our platform." },
  { title: "User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information when registering. We reserve the right to suspend accounts that violate these terms." },
  { title: "Content & Intellectual Property", content: "All editorial content, rankings, and data published on Start-Up News is owned by Start-Up News or its licensors. You may not reproduce, distribute, or create derivative works without explicit written permission." },
  { title: "User-Generated Content", content: "By submitting ideas, comments, or other content to our platform, you grant Start-Up News a non-exclusive license to use, display, and distribute that content. You retain ownership of your submissions." },
  { title: "Prohibited Conduct", content: "You may not use our platform to post spam, harass other users, distribute malware, scrape our data, or engage in any activity that violates applicable law or these terms." },
  { title: "AI Features", content: "Our AI assistant is provided for informational purposes only. Responses may not always be accurate. Do not rely on AI-generated content for financial, legal, or medical decisions." },
  { title: "Subscriptions & Payments", content: "Subscription fees are charged in BDT. Payments are processed through Paymently. Subscriptions renew monthly unless cancelled. Refunds are handled on a case-by-case basis." },
  { title: "Limitation of Liability", content: "Start-Up News is not liable for any indirect, incidental, or consequential damages arising from your use of the platform. Our total liability shall not exceed the amount you paid us in the past 12 months." },
  { title: "Governing Law", content: "These terms are governed by the laws of Bangladesh. Any disputes shall be resolved in the courts of Dhaka, Bangladesh." },
];

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-dark text-white py-16">
        <div className="container-wide">
          <span className="section-label mb-3 block">Legal</span>
          <h1 className="font-serif text-4xl font-bold">Terms of Use</h1>
          <p className="text-gray-400 mt-3 text-sm">Last updated: January 2026</p>
        </div>
      </div>
      <div className="container-wide py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          <p className="text-gray-600 leading-relaxed border-l-4 border-brand-red pl-5">
            Please read these terms carefully before using Start-Up News. These terms govern your access to and use of our website, mobile applications, and services.
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
