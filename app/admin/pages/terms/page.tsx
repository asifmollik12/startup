import PageEditor from "@/components/admin/PageEditor";

const defaults = {
  hero_title: "Terms of Use",
  hero_subtitle: "Last updated: January 2026",
  sections: [
    { title: "Acceptance of Terms", content: "By accessing or using Start-Up News, you agree to be bound by these Terms of Use." },
    { title: "User Accounts", content: "You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information when registering." },
    { title: "Content & Intellectual Property", content: "All editorial content, rankings, and data published on Start-Up News is owned by Start-Up News or its licensors. Reproduction requires written permission." },
    { title: "User-Generated Content", content: "By submitting ideas or comments, you grant Start-Up News a non-exclusive license to use and display that content. You retain ownership." },
    { title: "Prohibited Conduct", content: "You may not use our platform to post spam, harass users, distribute malware, scrape data, or engage in any activity that violates applicable law." },
    { title: "AI Features", content: "Our AI assistant is for informational purposes only. Responses may not always be accurate. Do not rely on AI content for financial or legal decisions." },
    { title: "Subscriptions & Payments", content: "Subscription fees are charged in BDT via Paymently. Subscriptions renew monthly unless cancelled. Refunds are handled case-by-case." },
    { title: "Governing Law", content: "These terms are governed by the laws of Bangladesh. Disputes shall be resolved in the courts of Dhaka, Bangladesh." },
  ],
};

export default function AdminTermsPage() {
  return <PageEditor pageKey="page_terms" label="Terms of Use" showStats={false} showHeroCta={false} showSectionsMeta={false} showBottomCta={false} defaults={defaults} />;
}
