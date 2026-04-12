"use client";
import { useState } from "react";
import { Article } from "@/lib/types";
import { X } from "lucide-react";

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

  const set = (key: keyof typeof form, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

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
            <input value={form.title} onChange={(e) => set("title", e.target.value)} required className={input} placeholder="Article title" />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Slug" required>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} required className={input} placeholder="article-slug" />
            </Field>
            <Field label="Category" required>
              <input value={form.category} onChange={(e) => set("category", e.target.value)} required className={input} placeholder="Fintech" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Author">
              <input value={form.author} onChange={(e) => set("author", e.target.value)} className={input} placeholder="Author name" />
            </Field>
            <Field label="Read Time (min)">
              <input type="number" value={form.readTime} onChange={(e) => set("readTime", Number(e.target.value))} className={input} min={1} />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Published At">
              <input type="date" value={form.publishedAt} onChange={(e) => set("publishedAt", e.target.value)} className={input} />
            </Field>
            <Field label="Cover Image URL">
              <input value={form.coverImage} onChange={(e) => set("coverImage", e.target.value)} className={input} placeholder="https://..." />
            </Field>
          </div>
          <Field label="Excerpt">
            <textarea value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} rows={2} className={input + " resize-none"} placeholder="Short description..." />
          </Field>
          <Field label="Tags (comma separated)">
            <input
              value={form.tags.join(", ")}
              onChange={(e) => set("tags", e.target.value.split(",").map((t) => t.trim()).filter(Boolean))}
              className={input}
              placeholder="fintech, startup, mobile"
            />
          </Field>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.featured} onChange={(e) => set("featured", e.target.checked)}
              className="w-4 h-4 accent-brand-red" />
            <span className="text-sm text-gray-300">Mark as Featured</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-brand-red text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
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

const input = "w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors";
