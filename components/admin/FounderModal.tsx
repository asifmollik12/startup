"use client";
import { useState, useRef, useEffect } from "react";
import { Founder } from "@/lib/types";
import { X, Upload, ImageIcon } from "lucide-react";

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
  const [uploading, setUploading] = useState<string | null>(null);
  const [industryOptions, setIndustryOptions] = useState<string[]>([]);
  const avatarRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch("/api/categories").then(r => r.json()).then(data => setIndustryOptions(data.map((c: any) => c.name))).catch(() => {});
  }, []);

  const set = (key: keyof typeof form, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "avatar" | "coverImage") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(field);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) set(field, data.url);
    setUploading(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: founder?.id ?? "" } as Founder);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="relative bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Upload progress bar */}
        {uploading && (
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gray-800 rounded-t-xl overflow-hidden z-20">
            <div className="h-full w-1/2 bg-brand-red animate-[uploadProgress_1.5s_ease-in-out_infinite]" />
          </div>
        )}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-white">{founder ? "Edit Founder" : "Add Founder"}</h2>
            {uploading && <span className="text-xs text-brand-red animate-pulse">Uploading...</span>}
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><X size={18} /></button>
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
              <select value={form.industry} onChange={(e) => set("industry", e.target.value)} className={inp}>
                <option value="">Select industry...</option>
                {industryOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                {form.industry && !industryOptions.includes(form.industry) && (
                  <option value={form.industry}>{form.industry}</option>
                )}
              </select>
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
          <Field label="Rank">
            <input type="number" value={form.rank ?? ""} onChange={(e) => set("rank", e.target.value ? Number(e.target.value) : undefined)} className={inp} placeholder="1" min={1} />
          </Field>

          {/* Avatar Upload */}
          <Field label="Avatar Photo">
            <div className="flex items-center gap-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-800 border border-gray-700 flex items-center justify-center flex-shrink-0">
                {form.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={form.avatar} alt="Avatar" className="w-full h-full object-cover" style={{ imageRendering: "auto" }} />
                ) : (
                  <ImageIcon size={24} className="text-gray-600" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg cursor-pointer hover:border-brand-red transition-colors">
                  <Upload size={13} /> {uploading === "avatar" ? "Uploading..." : "Upload Photo"}
                  <input ref={avatarRef} type="file" accept="image/*" onChange={(e) => handleUpload(e, "avatar")} className="hidden" />
                </label>
                {form.avatar && (
                  <button type="button" onClick={() => set("avatar", "")} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><X size={13} /></button>
                )}
              </div>
            </div>
          </Field>

          {/* Cover Image Upload */}
          <Field label="Cover Image">
            <div className="space-y-2">
              {form.coverImage ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverImage} alt="Cover" className="w-full h-32 object-cover" />
                  <button type="button" onClick={() => set("coverImage", "")}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-red-600 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-brand-red transition-colors">
                  <ImageIcon size={20} className="text-gray-600" />
                  <span className="text-xs text-gray-500">{uploading === "coverImage" ? "Uploading..." : "Click to upload cover image"}</span>
                  <input ref={coverRef} type="file" accept="image/*" onChange={(e) => handleUpload(e, "coverImage")} className="hidden" />
                </label>
              )}
            </div>
          </Field>

          <Field label="Bio">
            <textarea value={form.bio} onChange={(e) => set("bio", e.target.value)} rows={3} className={inp + " resize-none"} placeholder="Short biography..." />
          </Field>
          <Field label="Achievements (one per line)">
            <textarea value={form.achievements.join("\n")} onChange={(e) => set("achievements", e.target.value.split("\n").filter(Boolean))}
              rows={3} className={inp + " resize-none"} placeholder={"Forbes Asia 30 Under 30\nWEF Young Global Leader"} />
          </Field>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Twitter">
              <input value={form.socialLinks?.twitter ?? ""} onChange={(e) => set("socialLinks", { ...form.socialLinks, twitter: e.target.value })} className={inp} placeholder="https://twitter.com/..." />
            </Field>
            <Field label="LinkedIn">
              <input value={form.socialLinks?.linkedin ?? ""} onChange={(e) => set("socialLinks", { ...form.socialLinks, linkedin: e.target.value })} className={inp} placeholder="https://linkedin.com/..." />
            </Field>
            <Field label="Website">
              <input value={form.socialLinks?.website ?? ""} onChange={(e) => set("socialLinks", { ...form.socialLinks, website: e.target.value })} className={inp} placeholder="https://..." />
            </Field>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors">Cancel</button>
            <button type="submit" disabled={!!uploading} className="flex-1 px-4 py-2.5 bg-brand-red text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
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
