"use client";
import { useState } from "react";
import { Idea } from "@/lib/types";
import { X } from "lucide-react";

interface Props {
  idea: Idea | null;
  onSave: (data: Idea) => void;
  onClose: () => void;
}

const empty: Omit<Idea, "id"> = {
  title: "", description: "", submittedBy: "",
  votes: 0, month: "", winner: false, category: "",
};

export default function IdeaModal({ idea, onSave, onClose }: Props) {
  const [form, setForm] = useState<Omit<Idea, "id">>(idea ? { ...idea } : empty);

  const set = (key: keyof typeof form, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: idea?.id ?? "" } as Idea);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-white">{idea ? "Edit Idea" : "Add Idea"}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <Field label="Title" required>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} required className={inp} placeholder="Idea title..." />
          </Field>
          <Field label="Description">
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={inp + " resize-none"} placeholder="Describe the idea..." />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Category">
              <input value={form.category} onChange={(e) => set("category", e.target.value)} className={inp} placeholder="Fintech" />
            </Field>
            <Field label="Submitted By">
              <input value={form.submittedBy} onChange={(e) => set("submittedBy", e.target.value)} className={inp} placeholder="Name" />
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Month">
              <input value={form.month} onChange={(e) => set("month", e.target.value)} className={inp} placeholder="April 2026" />
            </Field>
            <Field label="Votes">
              <input type="number" value={form.votes} onChange={(e) => set("votes", Number(e.target.value))} className={inp} min={0} />
            </Field>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.winner} onChange={(e) => set("winner", e.target.checked)} className="w-4 h-4 accent-brand-red" />
            <span className="text-sm text-gray-300">Mark as Winner</span>
          </label>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-brand-red text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
              {idea ? "Save Changes" : "Add Idea"}
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
