"use client";
import { useState, useEffect } from "react";
import { Save, Plus, Trash2, Eye, EyeOff, BarChart2, DollarSign, Monitor, LayoutTemplate, Upload, X, Loader2 } from "lucide-react";
import Toast from "@/components/admin/Toast";

type AdSlot = {
  id: string;
  name: string;
  placement: string;
  size: string;
  type: "image" | "code";
  imageUrl?: string;
  code?: string;
  linkUrl: string;
  active: boolean;
  impressions: number;
  clicks: number;
};

const defaultSlots: AdSlot[] = [
  {
    id: "1", name: "Top Leaderboard", placement: "Above Header", size: "970×90",
    type: "image", imageUrl: "", linkUrl: "#", active: true, impressions: 24500, clicks: 312,
  },
  {
    id: "2", name: "Homepage Banner", placement: "Homepage Hero", size: "728×90",
    type: "image", imageUrl: "", linkUrl: "#", active: true, impressions: 18200, clicks: 245,
  },
  {
    id: "3", name: "Sidebar Rectangle", placement: "Article Sidebar", size: "300×250",
    type: "image", imageUrl: "", linkUrl: "#", active: false, impressions: 9800, clicks: 98,
  },
  {
    id: "4", name: "In-Article Banner", placement: "Between Article Paragraphs", size: "728×90",
    type: "code", code: "", linkUrl: "#", active: true, impressions: 15600, clicks: 187,
  },
];

const placements = [
  "Above Header", "Homepage Hero", "Article Sidebar", "Between Article Paragraphs",
  "Footer Banner", "Below Navigation", "Rankings Page", "Founders Page",
];

const sizes = ["970×90", "728×90", "300×250", "300×600", "320×50", "160×600"];

export default function AdminAdvertising() {
  const [slots, setSlots] = useState<AdSlot[]>(defaultSlots);
  const [editing, setEditing] = useState<AdSlot | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const toast = (msg: string) => { setToastMsg(msg); setShowToast(false); setTimeout(() => setShowToast(true), 10); };

  useEffect(() => {
    fetch("/api/ads").then(r => r.json()).then(v => { if (Array.isArray(v) && v.length) setSlots(v); }).finally(() => setLoading(false));
  }, []);

  const saveAll = async (updated: AdSlot[]) => {
    setSaving(true);
    await fetch("/api/ads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(updated) });
    setSaving(false);
    toast("Ad slots saved");
  };

  const totalImpressions = slots.reduce((a, s) => a + s.impressions, 0);
  const totalClicks = slots.reduce((a, s) => a + s.clicks, 0);
  const ctr = totalImpressions > 0 ? ((totalClicks / totalImpressions) * 100).toFixed(2) : "0.00";
  const activeCount = slots.filter((s) => s.active).length;

  const toggleActive = (id: string) => {
    const updated = slots.map(s => s.id === id ? { ...s, active: !s.active } : s);
    setSlots(updated);
    saveAll(updated);
  };

  const handleSave = (data: AdSlot) => {
    let updated: AdSlot[];
    if (creating) {
      updated = [...slots, { ...data, id: String(Date.now()), impressions: 0, clicks: 0 }];
    } else {
      updated = slots.map(s => s.id === data.id ? data : s);
    }
    setSlots(updated);
    saveAll(updated);
    setEditing(null);
    setCreating(false);
  };

  const handleDelete = (id: string) => {
    const updated = slots.filter(s => s.id !== id);
    setSlots(updated);
    saveAll(updated);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      <Toast message={toastMsg} show={showToast} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Advertising</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage ad placements, banners, and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => saveAll(slots)} disabled={saving}
            className="flex items-center gap-2 bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-gray-700 transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} Save
          </button>
          <button onClick={() => setCreating(true)}
            className="flex items-center gap-2 bg-brand-red text-white px-4 py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
            <Plus size={16} /> New Ad Slot
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Impressions", value: totalImpressions.toLocaleString(), icon: Monitor, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Total Clicks", value: totalClicks.toLocaleString(), icon: BarChart2, color: "text-green-400", bg: "bg-green-500/10" },
          { label: "Avg. CTR", value: `${ctr}%`, icon: DollarSign, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Active Slots", value: `${activeCount}/${slots.length}`, icon: LayoutTemplate, color: "text-purple-400", bg: "bg-purple-500/10" },
        ].map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-center gap-4">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-xs text-gray-500">{label}</p>
              <p className="text-xl font-bold text-white">{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Ad Slots Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
          <LayoutTemplate size={15} className="text-brand-red" />
          <h2 className="font-semibold text-white text-sm">Ad Slots</h2>
          <span className="ml-auto text-xs text-gray-500">{slots.length} placements</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-800 text-left">
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Ad Slot</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden md:table-cell">Placement</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Size</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Impressions</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden lg:table-cell">Clicks</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">CTR</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800">
              {slots.map((slot) => {
                const slotCtr = slot.impressions > 0 ? ((slot.clicks / slot.impressions) * 100).toFixed(2) : "0.00";
                return (
                  <tr key={slot.id} className="hover:bg-gray-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {slot.imageUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={slot.imageUrl} alt={slot.name} className="w-16 h-9 object-cover rounded border border-gray-700 flex-shrink-0" />
                        ) : (
                          <div className="w-16 h-9 bg-gray-800 border border-gray-700 rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-[9px] text-gray-600 uppercase tracking-wider">{slot.type === "code" ? "Code" : "No img"}</span>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-white">{slot.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">{slot.type === "image" ? "Image Ad" : "Code/Script"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 hidden md:table-cell text-xs">{slot.placement}</td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="text-[10px] bg-gray-700 text-gray-300 px-2 py-0.5 rounded font-mono">{slot.size}</span>
                    </td>
                    <td className="px-5 py-4 text-gray-300 hidden lg:table-cell font-medium">{slot.impressions.toLocaleString()}</td>
                    <td className="px-5 py-4 text-gray-300 hidden lg:table-cell font-medium">{slot.clicks.toLocaleString()}</td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className={`text-xs font-bold ${parseFloat(slotCtr) > 1.5 ? "text-green-400" : "text-gray-400"}`}>{slotCtr}%</span>
                    </td>
                    <td className="px-5 py-4">
                      <button onClick={() => toggleActive(slot.id)}
                        className="flex items-center gap-2 group"
                        title={slot.active ? "Click to pause" : "Click to activate"}>
                        {/* Toggle switch */}
                        <div className={`relative w-10 h-5 rounded-full transition-colors ${slot.active ? "bg-green-500" : "bg-gray-600"}`}>
                          <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${slot.active ? "translate-x-5" : "translate-x-0.5"}`} />
                        </div>
                        <span className={`text-xs font-semibold ${slot.active ? "text-green-400" : "text-gray-500"}`}>
                          {slot.active ? "Live" : "Off"}
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setEditing(slot)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors">
                          <LayoutTemplate size={14} />
                        </button>
                        <button onClick={() => setDeleteId(slot.id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {slots.length === 0 && (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-gray-500">No ad slots yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Placement Guide */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-800 flex items-center gap-2">
          <Monitor size={15} className="text-brand-red" />
          <h2 className="font-semibold text-white text-sm">Placement Guide</h2>
        </div>
        <div className="p-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            { name: "Leaderboard", size: "970×90", device: "Desktop", cpm: "$8–12", desc: "Top of page, highest visibility" },
            { name: "Banner", size: "728×90", device: "Desktop", cpm: "$5–8", desc: "Below navigation or in-article" },
            { name: "Medium Rectangle", size: "300×250", device: "All", cpm: "$6–10", desc: "Sidebar or in-content placement" },
            { name: "Half Page", size: "300×600", device: "Desktop", cpm: "$10–15", desc: "High impact sidebar unit" },
            { name: "Mobile Banner", size: "320×50", device: "Mobile", cpm: "$3–5", desc: "Mobile top or bottom sticky" },
            { name: "Wide Skyscraper", size: "160×600", device: "Desktop", cpm: "$4–7", desc: "Sidebar vertical placement" },
          ].map((p) => (
            <div key={p.name} className="bg-gray-800 border border-gray-700 rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <p className="font-semibold text-white text-sm">{p.name}</p>
                <span className={`text-[10px] px-2 py-0.5 rounded font-medium ${p.device === "Mobile" ? "bg-blue-500/20 text-blue-400" : p.device === "All" ? "bg-purple-500/20 text-purple-400" : "bg-gray-600 text-gray-300"}`}>
                  {p.device}
                </span>
              </div>
              <p className="text-xs font-mono text-gray-400">{p.size}</p>
              <p className="text-xs text-gray-500">{p.desc}</p>
              <p className="text-xs text-green-400 font-semibold">CPM: {p.cpm}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Ad Slot Modal */}
      {(editing || creating) && (
        <AdModal
          slot={creating ? null : editing}
          onSave={handleSave}
          onClose={() => { setEditing(null); setCreating(false); }}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Delete Ad Slot?</h3>
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

const empty: Omit<AdSlot, "id" | "impressions" | "clicks"> = {
  name: "", placement: "Homepage Hero", size: "728×90", type: "image",
  imageUrl: "", code: "", linkUrl: "", active: true,
};

function AdModal({ slot, onSave, onClose }: { slot: AdSlot | null; onSave: (d: AdSlot) => void; onClose: () => void }) {
  const [form, setForm] = useState<Omit<AdSlot, "id" | "impressions" | "clicks">>(slot ? { ...slot } : empty);
  const [uploading, setUploading] = useState(false);
  const fileRef = useState<HTMLInputElement | null>(null);
  const inp = "w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors";

  const set = (key: keyof typeof form, val: unknown) => setForm((p) => ({ ...p, [key]: val }));

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) set("imageUrl", data.url);
    setUploading(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...form, id: slot?.id ?? "", impressions: slot?.impressions ?? 0, clicks: slot?.clicks ?? 0 });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
          <h2 className="text-lg font-bold text-white">{slot ? "Edit Ad Slot" : "New Ad Slot"}</h2>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"><X size={18} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Ad Name</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} required className={inp} placeholder="Top Leaderboard" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Placement</label>
              <select value={form.placement} onChange={(e) => set("placement", e.target.value)} className={inp}>
                {placements.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Size</label>
              <select value={form.size} onChange={(e) => set("size", e.target.value)} className={inp}>
                {sizes.map((s) => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value as "image" | "code")} className={inp}>
                <option value="image">Image Ad (upload banner)</option>
                <option value="code">Google AdSense / HTML Code</option>
              </select>
            </div>
          </div>

          {form.type === "image" ? (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Ad Image <span className="text-gray-600">(upload your own banner)</span></label>
              {form.imageUrl ? (
                <div className="flex items-center gap-3 bg-gray-800 border border-gray-700 rounded-lg p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={form.imageUrl} alt="Ad preview" className="h-12 object-contain rounded" />
                  <div className="flex-1 text-xs text-gray-400 truncate">{form.imageUrl}</div>
                  <button type="button" onClick={() => set("imageUrl", "")} className="text-red-400 hover:text-red-300"><X size={14} /></button>
                </div>
              ) : (
                <label className="flex items-center gap-3 px-4 py-3 bg-gray-800 border border-dashed border-gray-600 rounded-lg cursor-pointer hover:border-brand-red transition-colors">
                  <Upload size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-400">{uploading ? "Uploading..." : "Click to upload ad image"}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                HTML / Script Code
                <span className="ml-2 text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded font-semibold">Google AdSense supported</span>
              </label>
              <p className="text-[11px] text-gray-500 mb-2">Paste your Google AdSense code or any HTML ad code here. Scripts will execute automatically.</p>
              <textarea value={form.code} onChange={(e) => set("code", e.target.value)} rows={5}
                className={inp + " resize-none font-mono text-xs"} placeholder={`<!-- Google AdSense example -->\n<ins class="adsbygoogle"\n  style="display:block"\n  data-ad-client="ca-pub-XXXXXXXX"\n  data-ad-slot="XXXXXXXX"\n  data-ad-format="auto">\n</ins>\n<script>(adsbygoogle = window.adsbygoogle || []).push({});</script>`} />
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1.5">Click URL</label>
            <input value={form.linkUrl} onChange={(e) => set("linkUrl", e.target.value)} className={inp} placeholder="https://advertiser.com" />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="w-4 h-4 accent-brand-red" />
            <span className="text-sm text-gray-300">Active (show on site)</span>
          </label>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors">Cancel</button>
            <button type="submit" className="flex-1 px-4 py-2.5 bg-brand-red text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors">
              {slot ? "Save Changes" : "Create Ad Slot"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
