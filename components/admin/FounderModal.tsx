"use client";
import { useState } from "react";
import { Founder } from "@/lib/types";
import { X } from "lucide-react";

interface Props {
  founder: Founder | null;
  onSave: (data: Founder) => void;
  onClose: () => void;
}

const empty: Omit<Founder, "id"> = {
  name: "", slug: "", title: "", company: "", industry: "",
  avatar: "", coverImage: "", bio: "", netWorth: "", founded: "",
  location: "", achievements: [], socialLinks: {}, rank: undefined,
};

export default function FounderModal({ founder, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Founder, "id">>(founder ? { ...founder } : empty);

  const set = (key: keyof typeof form, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: founder?.id ?? "" } as Founder);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-white">{founder ? "Edit Founder" : "Add Founder"}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Full Name" required>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} required className={inp} placeholder="Kamal Quadir" />
            </Field>
            <Field label="Slug" required>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} required className={inp} placeholder="kamal-quadir" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title">
              <input value={form.title} onChange={(e) => set("title", e.target.value)} className={inp} placeholder="CEO & Co-Founder" />
            </Field>
            <Field label="Company">
              <input value={form.company} onChange={(e) => set("company", e.target.value)} className={inp} placeholder="bKash" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Industry">
              <input value={form.industry} onChange={(e) => set("industry", e.target.value)} className={inp} placeholder="Fintech" />
            </Field>
            <Field label="Location">
              <input value={form.location} onChange={(e) => set("location", e.target.value)} className={inp} placeholder="Dhaka" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Founded Year">
              <input value={form.founded} onChange={(e) => set("founded", e.target.value)} className={inp} placeholder="2011" />
            </Field>
            <Field label="Net Worth">
              <input value={form.netWorth ?? ""} onChange={(e) => set("netWorth", e.target.value)} className={inp} placeholder="$500M+" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Rank">
              <input type="number" value={form.rank ?? ""} onChange={(e) => set("rank", e.target.value ? Number(e.target.value) : undefined)} className={inp} placeholder="1" min={1} />
            </Field>
            <Field label="Avatar URL">
              <input value={form.avatar} onChange={(e) => set("avatar", e.target.value)} className={inp} placeholder="https://..." />
            </Field>
          </div>
          <Field label="Cover Image URL">
            <input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} className={inp} placeholder="https://..." />
          </Field>
          <Field label="Bio">
            <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} className={inp + " resize-none"} placeholder="Short biography..." />
          </Field>
          <Field label="Achievements (one per line)">
            <textarea
              value={form.achievements.join("\n")}
              onChange={(e) => set("achievements", e.target.value.split("\n").filter(Boolean))}
              rows={3} className={inp + " resize-none"}
              placeholder="Forbes Asia 30 Under 30&#10;WEF Young Global Leader"
            />
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-brand-red text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
              {founder ? "Save Changes" : "Add Founder"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Field({ label, children, required }: { label: string; children: React.ReactNode; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
    </div>
  );
}

const inp = "w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors";
