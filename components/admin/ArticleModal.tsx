"use client";
import { useState, useRef } from "react";
import { Article } from "@/lib/types";
import { X, Upload, ImageIcon } from "lucide-react";

interface Props {
  article: Article | null;
  onSave: (data: Article) => void;
  onClose: () => void;
}

const empty: Omit<Article, "id"> = {
  title: "", slug: "", excerpt: "", content: "", category: "",
  author: "", authorAvatar: "", coverImage: "", publishedAt: "",
  readTime: 5, featured: false, tags: [],
};

export default function ArticleModal({ article, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Article, "id">>(article ? { ...article } : empty);
  const [uploading, setUploading] = useState(false);
  const coverRef = useRef<HTMLInputElement>(null);
  const avatarRef = useRef<HTMLInputElement>(null);

  const set = (key: keyof typeof form, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: "coverImage" | "authorAvatar") => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) set(field, data.url);
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: article?.id ?? "" } as Article);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-white">{article ? "Edit Article" : "New Article"}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Title" required>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} required className={inp} placeholder="Article title" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug" required>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} required className={inp} placeholder="article-slug" />
            </Field>
            <Field label="Category" required>
              <input value={form.category} onChange={(e) => set("category", e.target.value)} required className={inp} placeholder="Fintech" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Author">
              <input value={form.author} onChange={(e) => set("author", e.target.value)} className={inp} placeholder="Author name" />
            </Field>
            <Field label="Read Time (min)">
              <input type="number" value={form.readTime} onChange={(e) => set("readTime", Number(e.target.value))} className={inp} min={1} />
            </Field>
          </div>
          <Field label="Published At">
            <input type="date" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} className={inp} />
          </Field>

          {/* Cover Image Upload */}
          <Field label="Cover Image">
            <div className="space-y-2">
              {form.coverImage ? (
                <div className="relative rounded-lg overflow-hidden border border-gray-700">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.coverImage} alt="Cover" className="w-full h-40 object-cover" />
                  <button type="button" onClick={() => set("coverImage", "")}
                    className="absolute top-2 right-2 p-1.5 bg-black/60 text-white rounded-lg hover:bg-red-600 transition-colors">
                    <X size={14} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center gap-2 h-32 border-2 border-dashed border-gray-700 rounded-lg cursor-pointer hover:border-brand-red transition-colors">
                  <ImageIcon size={24} className="text-gray-600" />
                  <span className="text-sm text-gray-500">{uploading ? "Uploading..." : "Click to upload cover image"}</span>
                  <span className="text-xs text-gray-600">PNG, JPG, WebP</span>
                  <input ref={coverRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "coverImage")} className="hidden" />
                </label>
              )}
              {!form.coverImage && (
                <button type="button" onClick={() => coverRef.current?.click()}
                  className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg hover:border-brand-red transition-colors">
                  <Upload size={13} /> Upload Image
                </button>
              )}
            </div>
          </Field>

          {/* Author Avatar Upload */}
          <Field label="Author Avatar">
            <div className="flex items-center gap-3">
              {form.authorAvatar ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.authorAvatar} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-gray-700" />
                  <button type="button" onClick={() => set("authorAvatar", "")}
                    className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center">
                    <X size={10} />
                  </button>
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
                  <ImageIcon size={16} className="text-gray-600" />
                </div>
              )}
              <label className="flex items-center gap-2 px-3 py-2 bg-gray-800 border border-gray-700 text-gray-300 text-xs rounded-lg cursor-pointer hover:border-brand-red transition-colors">
                <Upload size={13} /> Upload Avatar
                <input ref={avatarRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, "authorAvatar")} className="hidden" />
              </label>
            </div>
          </Field>

          <Field label="Excerpt">
            <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} className={inp + " resize-none"} placeholder="Short description..." />
          </Field>
          <Field label="Content">
            <textarea value={form.content} onChange={(e) => set("content", e.target.value)} rows={5} className={inp + " resize-none"} placeholder="Full article content..." />
          </Field>
          <Field label="Tags (comma separated)">
            <input value={form.tags.join(", ")} onChange={(e) => set("tags", e.target.value.split(",").map(t => t.trim()).filter(Boolean))} className={inp} placeholder="fintech, startup, mobile" />
          </Field>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)} className="w-4 h-4 accent-brand-red" />
            <span className="text-sm text-gray-300">Mark as Featured</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors">Cancel</button>
            <button type="submit" disabled={uploading} className="flex-1 px-4 py-2.5 bg-brand-red text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50">
              {article ? "Save Changes" : "Create Article"}
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
