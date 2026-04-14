"use client";
import { useState, useRef } from "react";
import { Startup } from "@/lib/types";
import { X, Upload, ImageIcon } from "lucide-react";

interface Props {
  startup: Startup | null;
  onSave: (data: Startup) => void;
  onClose: () => void;
}

const stages = ["Pre-seed", "Seed", "Series A", "Series B", "Series C", "Growth"];

const empty: Omit<Startup, "id"> = {
  name: "", slug: "", tagline: "", description: "", logo: "",
  industry: "", stage: "Seed", founded: "", location: "",
  founders: [], funding: "", website: "",
};

export default function StartupModal({ startup, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Startup, "id">>(startup ? { ...startup } : empty);
  const [uploading, setUploading] = useState(false);
  const logoRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof form, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) set("logo", data.url);
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: startup?.id ?? "" } as Startup);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-white">{startup ? "Edit Startup" : "Add Startup"}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" required>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} required className={inp} placeholder="NovaPay" />
            </Field>
            <Field label="Slug" required>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} required className={inp} placeholder="novapay" />
            </Field>
          </div>
          <Field label="Tagline">
            <input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} className={inp} placeholder="Short tagline..." />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={2} className={inp + " resize-none"} placeholder="What does this startup do?" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Industry">
              <input value={form.industry} onChange={(e) => set("industry", e.target.value)} className={inp} placeholder="Fintech" />
            </Field>
            <Field label="Stage">
              <select value={form.stage} onChange={(e) => set("stage", e.target.value)} className={inp}>
                {stages.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Founded">
              <input value={form.founded} onChange={(e) => set("founded", e.target.value)} className={inp} placeholder="2023" />
            </Field>
            <Field label="Location">
              <input value={form.location} onChange={(e) => set("location", e.target.value)} className={inp} placeholder="Dhaka" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Funding">
              <input value={form.funding ?? ""} onChange={(e) => set("funding", e.target.value)} className={inp} placeholder="$3.2M" />
            </Field>
            <Field label="Website">
              <input value={form.website} onChange={(e) => set("website", e.target.value)} className={inp} placeholder="https://..." />
            </Field>
          </div>
          <Field label="Founders (comma separated)">
            <input
              value={form.founders.join(", ")}
              onChange={(e) => set("founders", e.target.value.split(",").map((f) => f.trim()).filter(Boolean))}
              className={inp}
              placeholder="Arif Hossain, Priya Das"
            />
          </Field>
          <Field label="Logo">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 border border-gray-700 bg-gray-800 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {form.logo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.logo} alt="Logo" className="w-full h-full object-contain p-1" />
                ) : (
                  <ImageIcon size={20} className="text-gray-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg cursor-pointer hover:border-brand-red transition-colors">
                  <Upload size={13} /> {uploading ? "Uploading..." : "Upload Logo"}
                  <input ref={logoRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </label>
                {form.logo && (
                  <button type="button" onClick={() => set("logo", "")} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><X size={13} /></button>
                )}
              </div>
            </div>
          </Field>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-brand-red text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
              {startup ? "Save Changes" : "Add Startup"}
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
