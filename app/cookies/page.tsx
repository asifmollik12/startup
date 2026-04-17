import type { Metadata } from "next";

export const metadata: Metadata = { title: "Cookie Policy — Start-Up News" };

const cookies = [
  { name: "Session Cookie", purpose: "Keeps you logged in during your visit", duration: "Session", type: "Essential" },
  { name: "Auth Token", purpose: "Remembers your login across visits", duration: "30 days", type: "Essential" },
  { name: "Preferences", purpose: "Stores your site preferences", duration: "1 year", type: "Functional" },
  { name: "Analytics", purpose: "Helps us understand how the site is used", duration: "90 days", type: "Analytics" },
];

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-dark text-white py-16">
        <div className="container-wide">
          <span className="section-label mb-3 block">Legal</span>
          <h1 className="font-serif text-4xl font-bold">Cookie Policy</h1>
          <p className="text-gray-400 mt-3 text-sm">Last updated: January 2026</p>
        </div>
      </div>
      <div className="container-wide py-16">
        <div className="max-w-3xl mx-auto space-y-10">
          <p className="text-gray-600 leading-relaxed border-l-4 border-brand-red pl-5">
            Cookies are small text files stored on your device when you visit our site. This policy explains what cookies we use and why.
          </p>

          <div>
            <h2 className="font-serif text-xl font-bold text-brand-dark mb-3">What Are Cookies?</h2>
            <p className="text-gray-600 leading-relaxed">Cookies help websites remember information about your visit — like staying logged in or remembering your preferences. They make your experience faster and more personalised.</p>
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-brand-dark mb-5">Cookies We Use</h2>
            <div className="border border-brand-border overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-brand-gray border-b border-brand-border">
                  <tr>
                    {["Cookie", "Purpose", "Duration", "Type"].map(h => (
                      <th key={h} className="text-left px-4 py-3 text-xs font-bold uppercase tracking-wider text-gray-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-brand-border">
                  {cookies.map((c) => (
                    <tr key={c.name} className="hover:bg-brand-gray transition-colors">
                      <td className="px-4 py-3 font-semibold text-brand-dark">{c.name}</td>
                      <td className="px-4 py-3 text-gray-500">{c.purpose}</td>
                      <td className="px-4 py-3 text-gray-500">{c.duration}</td>
                      <td className="px-4 py-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 ${c.type === "Essential" ? "bg-brand-red/10 text-brand-red" : "bg-gray-100 text-gray-500"}`}>
                          {c.type}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-xl font-bold text-brand-dark mb-3">Managing Cookies</h2>
            <p className="text-gray-600 leading-relaxed">You can control cookies through your browser settings. Disabling essential cookies may affect your ability to log in or use certain features. Most browsers allow you to block or delete cookies from the settings menu.</p>
          </div>

          <div className="border-t border-brand-border pt-8">
            <p className="text-sm text-gray-400">Questions? Contact us at <a href="mailto:hello@start-upnews.com" className="text-brand-red hover:underline">hello@start-upnews.com</a></p>
          </div>
        </div>
      </div>
    </div>
  );
}
