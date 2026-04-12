"use client";
import { useState } from "react";
import { ideas as initialIdeas } from "@/lib/data";
import { Idea } from "@/lib/types";
import { Plus, Pencil, Trash2, Search, Trophy, ThumbsUp } from "lucide-react";
import IdeaModal from "@/components/admin/IdeaModal";

export default function AdminIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>(initialIdeas);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Idea | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = ideas.filter(
    (i) =>
      i.title.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase()) ||
      i.submittedBy.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: Idea) => {
    if (creating) {
      setIdeas((prev) => [...prev, { ...data, id: String(Date.now()) }]);
    } else {
      setIdeas((prev) => prev.map((i) => (i.id === data.id ? data : i)));
    }
    setEditing(null);
    setCreating(false);
  };

  const handleDelete = (id: string) => {
    setIdeas((prev) => prev.filter((i) => i.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Best Ideas</h1>
          <p className="text-gray-500 text-sm mt-0.5">{ideas.length} ideas submitted</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-brand-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          <Plus size={16} /> Add Idea
        </button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="search"
          placeholder="Search ideas..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 text-sm text-gray-300 placeholder-gray-500 pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
        />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Idea</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Category</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Submitted By</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Month</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Votes</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((idea) => (
                <tr key={idea.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-white line-clamp-1">{idea.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1 mt-0.5">{idea.description}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-medium">{idea.category}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 hidden lg:table-cell">{idea.submittedBy}</td>
                  <td className="px-5 py-4 text-gray-400 hidden lg:table-cell">{idea.month}</td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className="flex items-center gap-1 text-white font-bold text-xs">
                      <ThumbsUp size={11} className="text-blue-400" />{idea.votes.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    {idea.winner ? (
                      <span className="flex items-center gap-1 text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold w-fit">
                        <Trophy size={9} /> Winner
                      </span>
                    ) : (
                      <span className="text-[10px] bg-gray-700 text-gray-400 px-2 py-0.5 rounded font-medium">Submitted</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditing(idea)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(idea.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-500">No ideas found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || creating) && (
        <IdeaModal
          idea={creating ? null : editing}
          onSave={handleSave}
          onClose={() => { setEditing(null); setCreating(false); }}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Delete Idea?</h3>
            <p className="text-gray-400 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteId(null)} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteId)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
