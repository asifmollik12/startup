"use client";
import { useState } from "react";
import { founders as initialFounders } from "@/lib/data";
import { Founder } from "@/lib/types";
import { Plus, Pencil, Trash2, Search, Trophy } from "lucide-react";
import FounderModal from "@/components/admin/FounderModal";

export default function AdminFounders() {
  const [founders, setFounders] = useState<Founder[]>(initialFounders);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Founder | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filtered = founders.filter(
    (f) =>
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.company.toLowerCase().includes(search.toLowerCase()) ||
      f.industry.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = (data: Founder) => {
    if (creating) {
      setFounders((prev) => [...prev, { ...data, id: String(Date.now()) }]);
    } else {
      setFounders((prev) => prev.map((f) => (f.id === data.id ? data : f)));
    }
    setEditing(null);
    setCreating(false);
  };

  const handleDelete = (id: string) => {
    setFounders((prev) => prev.filter((f) => f.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Founders</h1>
          <p className="text-gray-500 text-sm mt-0.5">{founders.length} founder profiles</p>
        </div>
        <button
          onClick={() => setCreating(true)}
          className="flex items-center gap-2 bg-brand-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors"
        >
          <Plus size={16} /> Add Founder
        </button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          type="search"
          placeholder="Search founders..."
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
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Founder</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Company</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Industry</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Net Worth</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Rank</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {filtered.map((founder) => (
                <tr key={founder.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <div>
                      <p className="font-medium text-white">{founder.name}</p>
                      <p className="text-xs text-gray-500">{founder.title}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400 hidden md:table-cell">{founder.company}</td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <span className="text-[10px] bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded font-medium">{founder.industry}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    {founder.netWorth && <span className="text-amber-400 font-bold text-xs">{founder.netWorth}</span>}
                  </td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    {founder.rank ? (
                      <span className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                        <Trophy size={11} /> #{founder.rank}
                      </span>
                    ) : (
                      <span className="text-gray-600 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditing(founder)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                        <Pencil size={14} />
                      </button>
                      <button onClick={() => setDeleteId(founder.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No founders found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || creating) && (
        <FounderModal
          founder={creating ? null : editing}
          onSave={handleSave}
          onClose={() => { setEditing(null); setCreating(false); }}
        />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Delete Founder?</h3>
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
