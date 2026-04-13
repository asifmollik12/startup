"use client";
import { useState, useEffect } from "react";
import { Founder } from "@/lib/types";
import { Plus, Pencil, Trash2, Search, Trophy, Users, Tag, X } from "lucide-react";
import FounderModal from "@/components/admin/FounderModal";
import Toast from "@/components/admin/Toast";

type Industry = { _id: string; name: string; slug: string; color: string; description: string };

export default function AdminFounders() {
  const [tab, setTab] = useState<"founders" | "industries">("founders");

  // Founders
  const [founders, setFounders] = useState<Founder[]>([]);
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<Founder | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Industries (reuse categories API)
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [indForm, setIndForm] = useState({ name: "", slug: "", color: "#8B5CF6", description: "" });
  const [editingInd, setEditingInd] = useState<Industry | null>(null);
  const [deleteIndId, setDeleteIndId] = useState<string | null>(null);

  // Toast
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const toast = (msg: string) => { setToastMsg(msg); setShowToast(false); setTimeout(() => setShowToast(true), 10); };

  useEffect(() => {
    fetch("/api/founders").then(r => r.json()).then(data => setFounders(data.map((f: any) => ({ ...f, id: f._id })))).finally(() => setLoading(false));
    fetch("/api/categories").then(r => r.json()).then(data => setIndustries(data));
  }, []);

  const filtered = founders.filter(f =>
    f.name.toLowerCase().includes(search.toLowerCase()) ||
    f.company.toLowerCase().includes(search.toLowerCase()) ||
    f.industry.toLowerCase().includes(search.toLowerCase())
  );

  const handleSave = async (data: Founder) => {
    if (creating) {
      const res = await fetch("/api/founders", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const created = await res.json();
      setFounders(prev => [{ ...created, id: created._id }, ...prev]);
      toast("Founder added");
    } else {
      const res = await fetch(`/api/founders/${data.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const updated = await res.json();
      setFounders(prev => prev.map(f => f.id === data.id ? { ...updated, id: updated._id } : f));
      toast("Founder updated");
    }
    setEditing(null); setCreating(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/founders/${id}`, { method: "DELETE" });
    setFounders(prev => prev.filter(f => f.id !== id));
    setDeleteId(null); toast("Founder deleted");
  };

  // Industry handlers
  const handleIndSave = async () => {
    if (!indForm.name) return;
    const slug = indForm.slug || indForm.name.toLowerCase().replace(/\s+/g, "-");
    if (editingInd) {
      const res = await fetch(`/api/categories/${editingInd._id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...indForm, slug }) });
      const updated = await res.json();
      setIndustries(prev => prev.map(i => i._id === editingInd._id ? updated : i));
      toast("Industry updated");
    } else {
      const res = await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...indForm, slug }) });
      const created = await res.json();
      setIndustries(prev => [...prev, created]);
      toast("Industry created");
    }
    setIndForm({ name: "", slug: "", color: "#8B5CF6", description: "" });
    setEditingInd(null);
  };

  const handleIndDelete = async (id: string) => {
    await fetch(`/api/categories/${id}`, { method: "DELETE" });
    setIndustries(prev => prev.filter(i => i._id !== id));
    setDeleteIndId(null); toast("Industry deleted");
  };

  return (
    <div className="space-y-5">
      <Toast message={toastMsg} show={showToast} />

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Founders Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage founder profiles and industries</p>
        </div>
        {tab === "founders" && (
          <button onClick={() => setCreating(true)} className="flex items-center gap-2 bg-brand-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
            <Plus size={16} /> Add Founder
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 border-b border-gray-800">
        <button onClick={() => setTab("founders")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === "founders" ? "border-brand-red text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
          <Users size={14} /> Founders ({founders.length})
        </button>
        <button onClick={() => setTab("industries")}
          className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${tab === "industries" ? "border-brand-red text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
          <Tag size={14} /> Industries ({industries.length})
        </button>
      </div>

      {tab === "founders" && (
        <>
          <div className="relative w-full max-w-sm">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="search" placeholder="Search founders..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 text-sm text-gray-300 placeholder-gray-500 pl-9 pr-4 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors" />
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
                  {loading && <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">Loading...</td></tr>}
                  {!loading && filtered.map(founder => (
                    <tr key={founder.id} className="hover:bg-gray-800/40 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {(founder as any).avatar && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={(founder as any).avatar} alt={founder.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-medium text-white">{founder.name}</p>
                            <p className="text-xs text-gray-500">{founder.title}</p>
                          </div>
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
                          <span className="flex items-center gap-1 text-xs text-amber-400 font-bold"><Trophy size={11} /> #{founder.rank}</span>
                        ) : <span className="text-gray-600 text-xs">—</span>}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => setEditing(founder)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => setDeleteId(founder.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No founders found.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {tab === "industries" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
              <h2 className="font-semibold text-white text-sm">{editingInd ? "Edit Industry" : "New Industry"}</h2>
              {editingInd && <button onClick={() => { setEditingInd(null); setIndForm({ name: "", slug: "", color: "#8B5CF6", description: "" }); }} className="text-gray-500 hover:text-white"><X size={15} /></button>}
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Industry Name</label>
                <input value={indForm.name} onChange={e => setIndForm({ ...indForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  className="w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors" placeholder="e.g. Fintech" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Slug</label>
                <input value={indForm.slug} onChange={e => setIndForm({ ...indForm, slug: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors font-mono" placeholder="fintech" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Description</label>
                <input value={indForm.description} onChange={e => setIndForm({ ...indForm, description: e.target.value })}
                  className="w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors" placeholder="Short description..." />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={indForm.color} onChange={e => setIndForm({ ...indForm, color: e.target.value })} className="w-10 h-10 rounded cursor-pointer bg-transparent border-0" />
                  <span className="text-sm text-gray-400 font-mono">{indForm.color}</span>
                  <span className="text-xs px-3 py-1 rounded-full font-medium text-white" style={{ backgroundColor: indForm.color }}>{indForm.name || "Preview"}</span>
                </div>
              </div>
              <button onClick={handleIndSave} className="w-full bg-brand-red text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
                {editingInd ? "Update Industry" : "Create Industry"}
              </button>
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-800">
              <h2 className="font-semibold text-white text-sm">All Industries ({industries.length})</h2>
            </div>
            <div className="divide-y divide-gray-800">
              {industries.length === 0 && <p className="px-5 py-8 text-center text-gray-500 text-sm">No industries yet.</p>}
              {industries.map(ind => (
                <div key={ind._id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-gray-800/40 transition-colors">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: ind.color }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white">{ind.name}</p>
                    <p className="text-xs text-gray-500 font-mono">{ind.slug}</p>
                  </div>
                  <span className="text-xs text-gray-500">{founders.filter(f => f.industry === ind.name).length} founders</span>
                  <div className="flex items-center gap-1.5">
                    <button onClick={() => { setEditingInd(ind); setIndForm({ name: ind.name, slug: ind.slug, color: ind.color, description: ind.description }); }}
                      className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"><Pencil size={13} /></button>
                    <button onClick={() => setDeleteIndId(ind._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={13} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(editing || creating) && (
        <FounderModal founder={creating ? null : editing} onSave={handleSave} onClose={() => { setEditing(null); setCreating(false); }} />
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

      {deleteIndId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Delete Industry?</h3>
            <p className="text-gray-400 text-sm mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteIndId(null)} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors">Cancel</button>
              <button onClick={() => handleIndDelete(deleteIndId)} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
