"use client";
import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Loader2 } from "lucide-react";
import RichTextEditor from "./RichTextEditor";

export type PageSection = { title: string; content: string };
export type StatItem = { value: string; label: string };
export type PageData = {
  // Hero
  hero_badge?: string;
  hero_title: string;
  hero_subtitle: string;
  hero_cta_text?: string;
  hero_cta_href?: string;
  // Sections block
  sections_badge?: string;
  sections_title?: string;
  sections: PageSection[];
  // Stats
  stats?: StatItem[];
  // Bottom CTA
  cta_title?: string;
  cta_subtitle?: string;
  cta_btn_text?: string;
  cta_btn_href?: string;
};

const emptyData: PageData = {
  hero_title: "",
  hero_subtitle: "",
  sections: [],
};

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-gray-400 mb-1.5 font-medium">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full bg-gray-900 border border-gray-700 text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-red transition-colors";
const ta = `${inp} resize-none`;

export default function PageEditor({
  pageKey, label,
  showStats = false,
  showHeroCta = true,
  showSectionsMeta = true,
  showBottomCta = true,
  defaults,
}: {
  pageKey: string;
  label: string;
  showStats?: boolean;
  showHeroCta?: boolean;
  showSectionsMeta?: boolean;
  showBottomCta?: boolean;
  defaults?: Partial<PageData>;
}) {
  const baseDefaults: PageData = { ...emptyData, ...defaults };
  const [data, setData] = useState<PageData>(baseDefaults);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch(`/api/settings?key=${pageKey}`)
      .then(r => r.json())
      .then(v => { if (v && typeof v === "object" && Object.keys(v).length > 0) setData({ ...baseDefaults, ...v }); })
      .finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageKey]);

  const set = (key: keyof PageData, val: any) => setData(d => ({ ...d, [key]: val }));

  const save = async () => {
    setSaving(true);
    await fetch("/api/settings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: pageKey, value: data }),
    });
    setSaving(false); setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addSection = () => set("sections", [...data.sections, { title: "", content: "" }]);
  const removeSection = (i: number) => set("sections", data.sections.filter((_, idx) => idx !== i));
  const updateSection = (i: number, field: keyof PageSection, val: string) =>
    set("sections", data.sections.map((s, idx) => idx === i ? { ...s, [field]: val } : s));
  const updateStat = (i: number, field: keyof StatItem, val: string) =>
    set("stats", (data.stats ?? []).map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={24} className="animate-spin text-gray-400" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white">{label}</h1>
          <p className="text-gray-400 text-sm mt-0.5">Editing public <span className="text-white">/{pageKey.replace("page_", "")}</span> page</p>
        </div>
        <button onClick={save} disabled={saving}
          className="flex items-center gap-2 bg-brand-red text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saved ? "Saved!" : saving ? "Saving..." : "Save Changes"}
        </button>
      </div>

      {/* Hero */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
        <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Hero Section</h2>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Badge / Label (small text above title)">
            <input value={data.hero_badge ?? ""} onChange={e => set("hero_badge", e.target.value)}
              placeholder="e.g. About Us" className={inp} />
          </Field>
          <Field label="Page Title">
            <input value={data.hero_title} onChange={e => set("hero_title", e.target.value)}
              placeholder="Main headline" className={inp} />
          </Field>
        </div>
        <Field label="Subtitle / Description">
          <textarea value={data.hero_subtitle} onChange={e => set("hero_subtitle", e.target.value)}
            rows={2} placeholder="Short description under the title" className={ta} />
        </Field>
        {showHeroCta && (
          <div className="grid grid-cols-2 gap-4">
            <Field label="CTA Button Text">
              <input value={data.hero_cta_text ?? ""} onChange={e => set("hero_cta_text", e.target.value)}
                placeholder="e.g. Get in Touch" className={inp} />
            </Field>
            <Field label="CTA Button Link">
              <input value={data.hero_cta_href ?? ""} onChange={e => set("hero_cta_href", e.target.value)}
                placeholder="e.g. /contact or mailto:..." className={inp} />
            </Field>
          </div>
        )}
      </div>

      {/* Stats */}
      {showStats && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Stats Bar</h2>
          <div className="grid grid-cols-2 gap-3">
            {(data.stats ?? []).map((stat, i) => (
              <div key={i} className="flex gap-2">
                <input value={stat.value} onChange={e => updateStat(i, "value", e.target.value)}
                  placeholder="2M+" className="w-24 bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-brand-red transition-colors" />
                <input value={stat.label} onChange={e => updateStat(i, "label", e.target.value)}
                  placeholder="Label" className="flex-1 bg-gray-900 border border-gray-700 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:border-brand-red transition-colors" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sections */}
      <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Content Sections</h2>
          <button onClick={addSection}
            className="flex items-center gap-1.5 text-xs text-brand-red border border-brand-red px-3 py-1.5 rounded-lg hover:bg-brand-red hover:text-white transition-colors">
            <Plus size={13} /> Add Section
          </button>
        </div>

        {showSectionsMeta && (
          <div className="grid grid-cols-2 gap-4 pb-2 border-b border-gray-700">
            <Field label="Section Badge">
              <input value={data.sections_badge ?? ""} onChange={e => set("sections_badge", e.target.value)}
                placeholder="e.g. What We Stand For" className={inp} />
            </Field>
            <Field label="Section Heading">
              <input value={data.sections_title ?? ""} onChange={e => set("sections_title", e.target.value)}
                placeholder="e.g. Our Values" className={inp} />
            </Field>
          </div>
        )}

        {data.sections.length === 0 && (
          <div className="text-center py-8 text-gray-500 text-sm border border-dashed border-gray-700 rounded-xl">
            No sections yet. Click "Add Section" to add content.
          </div>
        )}

        {data.sections.map((section, i) => (
          <div key={i} className="bg-gray-900 border border-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wider">Section {i + 1}</span>
              <button onClick={() => removeSection(i)}
                className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                <Trash2 size={13} />
              </button>
            </div>
            <Field label="Title">
              <input value={section.title} onChange={e => updateSection(i, "title", e.target.value)}
                placeholder="Section title" className={inp} />
            </Field>
            <Field label="Content">
              <RichTextEditor
                value={section.content}
                onChange={val => updateSection(i, "content", val)}
                placeholder="Section content..."
                rows={4}
              />
            </Field>
          </div>
        ))}
      </div>

      {/* Bottom CTA */}
      {showBottomCta && (
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-6 space-y-4">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Bottom CTA Section</h2>
          <div className="grid grid-cols-2 gap-4">
            <Field label="CTA Title">
              <input value={data.cta_title ?? ""} onChange={e => set("cta_title", e.target.value)}
                placeholder="e.g. Want to work with us?" className={inp} />
            </Field>
            <Field label="CTA Subtitle">
              <input value={data.cta_subtitle ?? ""} onChange={e => set("cta_subtitle", e.target.value)}
                placeholder="Supporting text" className={inp} />
            </Field>
            <Field label="CTA Button Text">
              <input value={data.cta_btn_text ?? ""} onChange={e => set("cta_btn_text", e.target.value)}
                placeholder="e.g. View Openings" className={inp} />
            </Field>
            <Field label="CTA Button Link">
              <input value={data.cta_btn_href ?? ""} onChange={e => set("cta_btn_href", e.target.value)}
                placeholder="e.g. /careers or mailto:..." className={inp} />
            </Field>
          </div>
        </div>
      )}
    </div>
  );
}
