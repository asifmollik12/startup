"use client";
import { useState, useEffect } from "react";
import { Mail, Trash2, Loader2, RefreshCw, Send, Users, Download } from "lucide-react";

type Sub = { _id: string; email: string; createdAt: string };

export default function AdminSubscribersPage() {
  const [subs, setSubs] = useState<Sub[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [sendResult, setSendResult] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [tab, setTab] = useState<"list" | "send">("list");

  const load = () => {
    setLoading(true);
    fetch("/api/subscribers").then(r => r.json()).then(setSubs).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    await fetch("/api/subscribers", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setSubs(s => s.filter(x => x._id !== id));
  };

  const sendNewsletter = async () => {
    if (!subject.trim() || !body.trim()) return;
    setSending(true); setSendResult("");
    const res = await fetch("/api/subscribers/send", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body }),
    });
    const data = await res.json();
    setSendResult(res.ok ? `✓ Sent to ${data.sent} subscribers` : `✗ ${data.error}`);
    setSending(false);
  };

  const exportCSV = () => {
    const csv = "Email,Subscribed\n" + subs.map(s => `${s.email},${new Date(s.createdAt).toLocaleDateString()}`).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "subscribers.csv"; a.click();
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <Users size={18} className="text-brand-red" /> Newsletter Subscribers
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{subs.length} total subscribers</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={exportCSV} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-2 rounded-lg transition-colors">
            <Download size={12} /> Export CSV
          </button>
          <button onClick={load} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 px-3 py-2 rounded-lg transition-colors">
            <RefreshCw size={12} /> Refresh
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-900 border border-gray-800 rounded-xl p-1 w-fit">
        {(["list", "send"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${tab === t ? "bg-brand-red text-white" : "text-gray-400 hover:text-white"}`}>
            {t === "list" ? `Subscribers (${subs.length})` : "Send Newsletter"}
          </button>
        ))}
      </div>

      {tab === "list" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-48"><Loader2 size={22} className="animate-spin text-gray-500" /></div>
          ) : subs.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-500">
              <Mail size={36} className="mb-3 text-gray-700" />
              <p className="text-sm">No subscribers yet</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-gray-800 bg-gray-800/50">
                <tr>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">#</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-bold uppercase tracking-wider text-gray-400">Subscribed</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {subs.map((s, i) => (
                  <tr key={s._id} className="hover:bg-gray-800/50 transition-colors">
                    <td className="px-5 py-3 text-gray-600 text-xs">{i + 1}</td>
                    <td className="px-5 py-3">
                      <a href={`mailto:${s.email}`} className="text-gray-200 hover:text-brand-red transition-colors">{s.email}</a>
                    </td>
                    <td className="px-5 py-3 text-gray-500 text-xs">
                      {new Date(s.createdAt).toLocaleDateString("en-BD", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button onClick={() => remove(s._id)} className="p-1.5 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {tab === "send" && (
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-5 max-w-2xl">
          <div>
            <p className="text-gray-400 text-sm mb-4">
              This will send an email to all <span className="text-white font-semibold">{subs.length} subscribers</span>.
            </p>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Subject</label>
            <input value={subject} onChange={e => setSubject(e.target.value)}
              placeholder="e.g. Weekly Startup Digest — April 2026"
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-2.5 rounded-lg text-sm focus:outline-none focus:border-brand-red transition-colors" />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">Email Body (HTML supported)</label>
            <textarea value={body} onChange={e => setBody(e.target.value)} rows={12}
              placeholder="<h2>This week in startups...</h2><p>Your content here...</p>"
              className="w-full bg-gray-800 border border-gray-700 text-white px-4 py-3 rounded-lg text-sm focus:outline-none focus:border-brand-red transition-colors resize-none font-mono" />
          </div>
          {sendResult && (
            <p className={`text-sm font-semibold ${sendResult.startsWith("✓") ? "text-green-400" : "text-red-400"}`}>{sendResult}</p>
          )}
          <button onClick={sendNewsletter} disabled={sending || !subject.trim() || !body.trim() || subs.length === 0}
            className="flex items-center gap-2 bg-brand-red text-white px-6 py-3 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors disabled:opacity-50">
            {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {sending ? "Sending..." : `Send to ${subs.length} Subscribers`}
          </button>
        </div>
      )}
    </div>
  );
}
