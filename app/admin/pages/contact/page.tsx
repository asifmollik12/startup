"use client";
import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Loader2, ExternalLink } from "lucide-react";

const PAGE_KEY = "page_contact";

type ContactItem = { label: string; value: string };

const DEFAULTS = {
  hero_badge: "Contact",
  hero_title: "Get in Touch",
  hero_subtitle: "Whether you have a story tip, want to advertise, or just want to say hello — we'd love to hear from you.",
  info_heading: "Reach Us Directly",
  form_heading: "We'll get back to you within 24 hours",
  form_email: "hello@start-upnews.com",
  contacts: [
    { label: "General Enquiries", value: "hello@start-upnews.com" },
    { label: "Editorial", value: "editorial@start-upnews.com" },
    { label: "Advertising", value: "advertise@start-upnews.com" },
    { label: "Location", value: "Dhaka, Bangladesh" },
  ],
};

const inp = "w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-red transition-colors placeholder-gray-600";

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wider">{children}</label>;
}
function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden">
      <div className="px-5 py-3 border-b border-gray-700">
        <h2 className="text-xs font-bold text-gray-300 uppercase tracking-widest">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

export default function AdminContactPage() {
  const [data, setData] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/settings?key=${PAGE_KEY}`)
      .then(r => r.json())
      .then(v => { if (v && typeof v === "object") setData({ ...DEFAULTS, ...v, contacts: v.contacts?.length ? v.contacts : DEFAULTS.contacts }); })
      .finally(() => setLoading(false));
  }, []);

  const set = (key: string, val: any) => setData(d => ({ ...d, [key]: val }));

  const updateContact = (i: number, field: keyof ContactItem, val: string) =>
    setData(d => ({ ...d, contacts: d.contacts.map((c, idx) => idx === i ? { ...c, [field]: val } : c) }));
  const addContact = () => setData(d => ({ ...d, contacts: [...d.contacts, { label: "", value: "" }] }));
  const removeContact = (i: number) => setData(d => ({ ...d, contacts: d.contacts.filter((_, idx) => idx !== i) }));

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

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 size={22} className="animate-spin text-gray-500" /></div>;

  return (
    <div className="max-w-3xl space-y-5">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">Contact Page</h1>
          <p className="text-gray-500 text-sm mt-0.5">Changes reflect on <span className="text-gray-300">/contact</span> immediately</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/contact" target="_blank"
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
          <div><Label>Badge</Label><input value={data.hero_badge} onChange={e => set("hero_badge", e.target.value)} className={inp} placeholder="Contact" /></div>
          <div><Label>Page Title</Label><input value={data.hero_title} onChange={e => set("hero_title", e.target.value)} className={inp} placeholder="Get in Touch" /></div>
        </div>
        <div>
          <Label>Subtitle</Label>
          <textarea value={data.hero_subtitle} onChange={e => set("hero_subtitle", e.target.value)} rows={2} className={inp + " resize-none"} />
        </div>
      </Card>

      {/* Contact info panel */}
      <Card title="Contact Info Panel">
        <div><Label>Section Heading</Label><input value={data.info_heading} onChange={e => set("info_heading", e.target.value)} className={inp} placeholder="Reach Us Directly" /></div>
        <div className="space-y-2">
          {data.contacts.map((c, i) => (
            <div key={i} className="flex gap-2 items-center">
              <input value={c.label} onChange={e => updateContact(i, "label", e.target.value)}
                className="w-40 bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-brand-red transition-colors" placeholder="Label" />
              <input value={c.value} onChange={e => updateContact(i, "value", e.target.value)}
                className="flex-1 bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-brand-red transition-colors" placeholder="email@example.com or address" />
              <button onClick={() => removeContact(i)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors"><Trash2 size={13} /></button>
            </div>
          ))}
          <button onClick={addContact} className="flex items-center gap-1.5 text-xs text-brand-red border border-brand-red/40 px-3 py-1.5 rounded-lg hover:bg-brand-red hover:text-white transition-colors">
            <Plus size={12} /> Add Contact
          </button>
        </div>
      </Card>

      {/* Form settings */}
      <Card title="Contact Form">
        <div><Label>Form Heading</Label><input value={data.form_heading} onChange={e => set("form_heading", e.target.value)} className={inp} placeholder="We'll get back to you within 24 hours" /></div>
        <div><Label>Form Submission Email (messages sent to)</Label><input value={data.form_email} onChange={e => set("form_email", e.target.value)} className={inp} placeholder="hello@start-upnews.com" /></div>
      </Card>
    </div>
  );
}
