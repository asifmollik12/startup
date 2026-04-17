"use client";
import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";

export type PageSection = { title: string; content: string };
export type PageData = {
  hero_title: string;
  hero_subtitle: string;
  sections: PageSection[];
};

const defaultData: PageData = {
  hero_title: "",
  hero_subtitle: "",
  sections: [],
};

export default function PageEditor({ pageKey, label }: { pageKey: string; label: string }) {
  const [data, setData] = useState<PageData>(defaultData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/settings?key=${pageKey}`)
      .then(r => r.json())
      .then(v => { if (v) setData(v); })
      .finally(() => setLoading(false));
  }, [pageKey]);

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: pageKey, value: data }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSection = () =>
    setData(d => ({ ...d, sections: [...d.sections, { title: "", content: "" }] }));

  const removeSection = (i: number) =>
    setData(d => ({ ...d, sections: d.sections.filter((_, idx) => idx !== i) }));

  const updateSection = (i: number, field: keyof PageSection, val: string) =>
    setData(d => ({
      ...d,
      sections: d.sections.map((s, idx) => idx === i ? { ...s, [field]: val } : s),
    }));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={24} className="animate-spin text-gray-400" />
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{label}</h1>
          <p className="text-gray-400 text-sm mt-0.5">Edit the content shown on the public {label} page</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Hero */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
        <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Hero Section</h2>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Page Title</label>
          <input value={data.hero_title}
            onChange={e => setData(d => ({ ...d, hero_title: e.target.value }))}
            placeholder="e.g. About Start-Up News"
            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-red transition-colors" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1.5">Subtitle / Description</label>
          <textarea value={data.hero_subtitle}
            onChange={e => setData(d => ({ ...d, hero_subtitle: e.target.value }))}
            rows={3} placeholder="Short description shown under the title"
            className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-red transition-colors resize-none" />
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Content Sections</h2>
          <button onClick={addSection}
            className="flex items-center gap-1.5 text-xs text-brand-red border border-brand-red px-3 py-1.5 rounded-lg hover:bg-brand-red hover:text-white transition-colors">
            <Plus size={13} /> Add Section
          </button>
        </div>

        {data.sections.length === 0 && (
          <div className="text-center py-10 text-gray-500 text-sm border border-dashed border-gray-700 rounded-xl">
            No sections yet. Click "Add Section" to add content.
          </div>
        )}

        {data.sections.map((section, i) => (
          <div key={i} className="bg-gray-800 border border-gray-700 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Section {i + 1}</span>
              <button onClick={() => removeSection(i)}
                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Section Title</label>
              <input value={section.title}
                onChange={e => updateSection(i, "title", e.target.value)}
                placeholder="e.g. Our Mission"
                className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-red transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">Content</label>
              <textarea value={section.content}
                onChange={e => updateSection(i, "content", e.target.value)}
                rows={4} placeholder="Section content..."
                className="w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-red transition-colors resize-none" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
