"use client";
import { useState, useEffect } from "react";
import { Startup } from "@/lib/types";
import { Plus, Pencil, Trash2, Search, DollarSign } from "lucide-react";
import StartupModal from "@/components/admin/StartupModal";

const stageColors: Record<string, string> = {
  "Pre-seed": "bg-gray-500/20 text-gray-400",
  "Seed": "bg-green-500/20 text-green-400",
  "Series A": "bg-blue-500/20 text-blue-400",
  "Series B": "bg-purple-500/20 text-purple-400",
  "Series C": "bg-amber-500/20 text-amber-400",
};

export default function AdminStartups() {
  const [startups, setStartups] = useState<Startup[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Startup | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/startups")
      .then((r) => r.json())
      .then((data) => setStartups(data.map((s: any) => ({ ...s, id: s._id }))))
      .finally(() => setLoading(false));
  }, []);

  const filtered = startups.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.industry.toLowerCase().includes(search.toLowerCase()) ||
      s.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Startup) => {
    if (creating) {
      const res = await fetch("/api/startups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const created = await res.json();
      setStartups((prev) => [{ ...created, id: created._id }, ...prev]);
    } else {
      const res = await fetch(`/api/startups/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const updated = await res.json();
      setStartups((prev) => prev.map((s) => (s.id === data.id ? { ...updated, id: updated._id } : s)));
    }
    setEditing(null);
    setCreating(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/startups/${id}`, { method: "DELETE" });
    setStartups((prev) => prev.filter((s) => s.id !== id));
    setDeleteId(null);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Startups</h1>
          <p className="text-gray-500 text-sm mt-0.5">{startups.length} startups listed</p>
        </div>
        <button onClick={() => setCreating(true)} className="flex items-center gap-2 bg-brand-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
          <Plus size={16} /> Add Startup
        </button>
      </div>

      <div className="relative w-full max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
        <input type="search" placeholder="Search startups..." value={search} onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-gray-900 border border-gray-700 text-sm text-gray-300 placeholder-gray-500 pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors" />
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Startup</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Industry</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Location</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Stage</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Funding</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {loading && <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">Loading...</td></tr>}
              {!loading && filtered.map((startup) => (
                <tr key={startup.id} className="hover:bg-gray-800/40 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-white">{startup.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{startup.tagline}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-medium">{startup.industry}</span>
                  </td>
                  <td className="px-5 py-4 text-gray-400 hidden lg:table-cell">{startup.location}</td>
                  <td className="px-5 py-4 hidden sm:table-cell">
                    <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${stageColors[startup.stage] ?? "bg-gray-700 text-gray-400"}`}>{startup.stage}</span>
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    {startup.funding ? (
                      <span className="flex items-center gap-1 text-green-400 font-bold text-xs"><DollarSign size={11} />{startup.funding}</span>
                    ) : <span className="text-gray-600 text-xs">—</span>}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => setEditing(startup)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => setDeleteId(startup.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No startups found.</td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      {(editing || creating) && (
        <StartupModal startup={creating ? null : editing} onSave={handleSave} onClose={() => { setEditing(null); setCreating(false); }} />
      )}

      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Delete Startup?</h3>
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
