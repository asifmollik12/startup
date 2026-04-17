"use client";
import { useState, useEffect } from "react";
import { Mail, MapPin, Send, ArrowRight } from "lucide-react";

const defaultContacts = [
  { label: "General Enquiries", value: "hello@start-upnews.com", href: "mailto:hello@start-upnews.com" },
  { label: "Editorial", value: "editorial@start-upnews.com", href: "mailto:editorial@start-upnews.com" },
  { label: "Advertising", value: "advertise@start-upnews.com", href: "mailto:advertise@start-upnews.com" },
  { label: "Location", value: "Dhaka, Bangladesh", href: "#" },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [heroTitle, setHeroTitle] = useState("Get in Touch");
  const [heroSubtitle, setHeroSubtitle] = useState("Whether you have a story tip, want to advertise, or just want to say hello — we'd love to hear from you.");
  const [sections, setSections] = useState(defaultContacts);

  useEffect(() => {
    fetch("/api/settings?key=page_contact")
      .then(r => r.json())
      .then(v => {
        if (v) {
          if (v.hero_title) setHeroTitle(v.hero_title);
          if (v.hero_subtitle) setHeroSubtitle(v.hero_subtitle);
          if (v.sections?.length) setSections(v.sections.map((s: any) => ({
            label: s.title, value: s.content, href: s.content.includes("@") ? `mailto:${s.content}` : "#"
          })));
        }
      });
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailto = `mailto:hello@start-upnews.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`Name: ${form.name}\nEmail: ${form.email}\n\n${form.message}`)}`;
    window.location.href = mailto;
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="bg-brand-dark text-white py-20 lg:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,16,46,0.15)_0%,_transparent_60%)] pointer-events-none" />
        <div className="container-wide relative">
          <span className="section-label mb-4 block">Contact</span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold leading-tight max-w-2xl mb-4">
            <span className="text-brand-red">{heroTitle}</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl leading-relaxed">{heroSubtitle}</p>
        </div>
      </div>

      <div className="container-wide py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div>
              <span className="section-label">Contact Info</span>
              <h2 className="font-serif text-2xl font-bold text-brand-dark mt-2 mb-6">Reach Us Directly</h2>
            </div>
            {sections.map(({ label, value, href }: any) => (
              <a key={label} href={href}
                className="flex items-start gap-4 p-4 border border-brand-border hover:border-brand-red transition-colors group">
                <div className="w-10 h-10 bg-brand-red/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-red transition-colors">
                  {value.includes("@") ? <Mail size={16} className="text-brand-red group-hover:text-white transition-colors" /> : <MapPin size={16} className="text-brand-red group-hover:text-white transition-colors" />}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-0.5">{label}</p>
                  <p className="text-sm font-semibold text-brand-dark group-hover:text-brand-red transition-colors">{value}</p>
                </div>
              </a>
            ))}
          </div>

          <div className="lg:col-span-2">
            <span className="section-label">Send a Message</span>
            <h2 className="font-serif text-2xl font-bold text-brand-dark mt-2 mb-6">We&apos;ll get back to you within 24 hours</h2>
            {sent ? (
              <div className="border border-green-200 bg-green-50 p-8 text-center">
                <Send size={20} className="text-green-600 mx-auto mb-3" />
                <h3 className="font-bold text-brand-dark mb-2">Message Sent!</h3>
                <p className="text-gray-500 text-sm">We&apos;ll respond within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Full Name</label>
                    <input type="text" required placeholder="Your name" value={form.name}
                      onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-brand-border px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
                    <input type="email" required placeholder="your@email.com" value={form.email}
                      onChange={e => setForm({ ...form, email: e.target.value })}
                      className="w-full border border-brand-border px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Subject</label>
                  <input type="text" required placeholder="What's this about?" value={form.subject}
                    onChange={e => setForm({ ...form, subject: e.target.value })}
                    className="w-full border border-brand-border px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Message</label>
                  <textarea required rows={6} placeholder="Tell us more..." value={form.message}
                    onChange={e => setForm({ ...form, message: e.target.value })}
                    className="w-full border border-brand-border px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors resize-none" />
                </div>
                <button type="submit"
                  className="flex items-center gap-2 bg-brand-red text-white px-8 py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors">
                  Send Message <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
