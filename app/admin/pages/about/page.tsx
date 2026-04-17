"use client";
import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Loader2, ExternalLink } from "lucide-react";

const PAGE_KEY = "page_about";

const DEFAULTS = {
  hero_badge: "About Us",
  hero_title: "Bangladesh's Premier Startup Intelligence Platform",
  hero_subtitle: "Start-Up News was founded with a single belief: the stories of Bangladeshi entrepreneurs deserve world-class coverage.",
  hero_cta_text: "Join Our Community",
  hero_cta_href: "/subscribe",
  sections_badge: "What We Stand For",
  sections_title: "Our Values",
  sections: [
    { title: "Our Mission", content: "To be the definitive voice of Bangladeshi entrepreneurship — telling the stories of founders, startups, and innovators shaping the nation's future." },
    { title: "Our Reach", content: "Serving 2M+ monthly readers across Bangladesh and the diaspora, covering 64 districts and every major industry vertical." },
    { title: "Our Community", content: "A growing network of 500+ profiled founders, 1,200+ listed startups, and thousands of investors, operators, and ecosystem builders." },
    { title: "Our Standard", content: "Rigorous, independent journalism. We don't take money for editorial coverage. Every ranking, profile, and story is earned on merit." },
  ],
  cta_title: "Want to work with us?",
  cta_subtitle: "We're always looking for journalists, researchers, and builders who care about Bangladesh's startup ecosystem.",
  cta_btn_text: "View Openings",
  cta_btn_href: "/careers",
};

const inp = "w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-red transition-colors placeholder-gray-600";
const ta = `${inp} resize-none`;

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{children}</label>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-700 bg-gray-800/80">
        <h2 className="text-xs font-bold text-gray-300 uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

export default function AdminAboutPage() {
  const [data, setData] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/settings?key=${PAGE_KEY}`)
      .then(r => r.json())
      .then(v => { if (v && typeof v === "object") setData({ ...DEFAULTS, ...v }); })
      .finally(() => setLoading(false));
  }, []);

  const set = (key: string, val: any) => setData(d => ({ ...d, [key]: val }));

  const updateSection = (i: number, field: string, val: string) =>
    setData(d => ({ ...d, sections: d.sections.map((s, idx) => idx === i ? { ...s, [field]: val } : s) }));

  const addSection = () =>
    setData(d => ({ ...d, sections: [...d.sections, { title: "", content: "" }] }));

  const removeSection = (i: number) =>
    setData(d => ({ ...d, sections: d.sections.filter((_, idx) => idx !== i) }));

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: PAGE_KEY, value: data }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={22} className="animate-spin text-gray-500" />
    </div>
  );

  return (
    <div className="max-w-3xl space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">About Us Page</h1>
          <p className="text-gray-500 text-sm mt-0.5">Changes reflect on <span className="text-gray-300">/about</span> within 60 seconds</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/about" target="_blank"
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-2 rounded-lg transition-colors">
            <ExternalLink size={12} /> Preview
          </a>
          <button onClick={save} disabled={saving}
            className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>

      {/* Hero */}
      <Card title="Hero Section">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Badge (small label above title)</Label>
            <input value={data.hero_badge} onChange={e => set("hero_badge", e.target.value)} className={inp} placeholder="e.g. About Us" />
          </div>
          <div>
            <Label>Page Title</Label>
            <input value={data.hero_title} onChange={e => set("hero_title", e.target.value)} className={inp} placeholder="Main headline" />
          </div>
        </div>
        <div>
          <Label>Subtitle</Label>
          <textarea value={data.hero_subtitle} onChange={e => set("hero_subtitle", e.target.value)} rows={2} className={ta} placeholder="Short description under the title" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>CTA Button Text</Label>
            <input value={data.hero_cta_text} onChange={e => set("hero_cta_text", e.target.value)} className={inp} placeholder="e.g. Join Our Community" />
          </div>
          <div>
            <Label>CTA Button Link</Label>
            <input value={data.hero_cta_href} onChange={e => set("hero_cta_href", e.target.value)} className={inp} placeholder="e.g. /subscribe" />
          </div>
        </div>
      </Card>

      {/* Values section */}
      <Card title="Values / Content Sections">
        <div className="grid grid-cols-2 gap-4 pb-4 border-b border-gray-700">
          <div>
            <Label>Section Badge</Label>
            <input value={data.sections_badge} onChange={e => set("sections_badge", e.target.value)} className={inp} placeholder="e.g. What We Stand For" />
          </div>
          <div>
            <Label>Section Heading</Label>
            <input value={data.sections_title} onChange={e => set("sections_title", e.target.value)} className={inp} placeholder="e.g. Our Values" />
          </div>
        </div>

        <div className="space-y-3">
          {data.sections.map((s, i) => (
            <div key={i} className="bg-gray-900 border border-gray-700 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Card {i + 1}</span>
                <button onClick={() => removeSection(i)}
                  className="p-1 text-gray-600 hover:text-red-400 transition-colors rounded">
                  <Trash2 size={13} />
                </button>
              </div>
              <div>
                <Label>Title</Label>
                <input value={s.title} onChange={e => updateSection(i, "title", e.target.value)} className={inp} placeholder="e.g. Our Mission" />
              </div>
              <div>
                <Label>Content</Label>
                <textarea value={s.content} onChange={e => updateSection(i, "content", e.target.value)} rows={2} className={ta} placeholder="Description..." />
              </div>
            </div>
          ))}
          <button onClick={addSection}
            className="flex items-center gap-2 text-xs text-brand-red border border-brand-red/50 px-4 py-2 rounded-lg hover:bg-brand-red hover:text-white transition-colors w-full justify-center">
            <Plus size={13} /> Add Card
          </button>
        </div>
      </Card>

      {/* Bottom CTA */}
      <Card title="Bottom CTA Section">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Title</Label>
            <input value={data.cta_title} onChange={e => set("cta_title", e.target.value)} className={inp} placeholder="e.g. Want to work with us?" />
          </div>
          <div>
            <Label>Subtitle</Label>
            <input value={data.cta_subtitle} onChange={e => set("cta_subtitle", e.target.value)} className={inp} placeholder="Supporting text" />
          </div>
          <div>
            <Label>Button Text</Label>
            <input value={data.cta_btn_text} onChange={e => set("cta_btn_text", e.target.value)} className={inp} placeholder="e.g. View Openings" />
          </div>
          <div>
            <Label>Button Link</Label>
            <input value={data.cta_btn_href} onChange={e => set("cta_btn_href", e.target.value)} className={inp} placeholder="e.g. /careers" />
          </div>
        </div>
      </Card>
    </div>
  );
}
