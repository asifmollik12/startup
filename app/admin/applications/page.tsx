"use client";
import { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Eye, Trash2, X, ExternalLink } from "lucide-react";
import Toast from "@/components/admin/Toast";

type App = { _id: string; type: string; status: string; userName: string; userEmail: string; createdAt: string; data: any };

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  approved: "bg-green-500/20 text-green-400",
  rejected: "bg-red-500/20 text-red-400",
};

export default function AdminApplications() {
  const [apps, setApps] = useState<App[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<App | null>(null);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [processing, setProcessing] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [rejectTarget, setRejectTarget] = useState<App | null>(null);
  const [rejectSubject, setRejectSubject] = useState("");
  const [rejectBody, setRejectBody] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const toast = (msg: string) => { setToastMsg(msg); setShowToast(false); setTimeout(() => setShowToast(true), 10); };

  useEffect(() => {
    fetch("/api/applications").then(r => r.json()).then(data => { setApps(data); setLoading(false); });
  }, []);

  const openApp = (app: App) => {
    setSelected(app);
    // Default to approval template — admin can edit before clicking either button
    const isStartup = app.type === "startup";
    setEmailSubject(`🎉 Congratulations! Your ${isStartup ? "startup" : "founder profile"} is now live on Start-Up News`);
    setEmailBody(`Dear ${app.userName},\n\nCongratulations! We're thrilled to inform you that your ${isStartup ? `startup "${app.data?.name}"` : `founder profile for "${app.data?.fullName}"`} has been approved and is now live on Start-Up News.\n\nYou can view your listing at start-upnews.com/${isStartup ? "startups" : "founders"}.\n\nThank you for being part of Bangladesh's premier startup community!\n\nBest regards,\nThe Start-Up News Team`);
  };

  const getTemplate = (status: "approved" | "rejected", app: App) => {
    const isStartup = app.type === "startup";
    if (status === "approved") {
      return {
        subject: `🎉 Congratulations! Your ${isStartup ? "startup" : "founder profile"} is now live on Start-Up News`,
        body: `Dear ${app.userName},\n\nCongratulations! We're thrilled to inform you that your ${isStartup ? `startup "${app.data?.name}"` : `founder profile for "${app.data?.fullName}"`} has been approved and is now live on Start-Up News.\n\nYou can view your listing at start-upnews.com/${isStartup ? "startups" : "founders"}.\n\nThank you for being part of Bangladesh's premier startup community!\n\nBest regards,\nThe Start-Up News Team`,
      };
    }
    return {
      subject: `Update on your ${isStartup ? "startup" : "founder"} application`,
      body: `Dear ${app.userName},\n\nThank you for submitting your application to Start-Up News.\n\nAfter careful review, we were unable to approve your application at this time. We encourage you to reapply in the future.\n\nBest regards,\nThe Start-Up News Team`,
    };
  };

  const handleAction = async (status: "approved" | "rejected") => {
    if (!selected) return;
    setProcessing(true);
    const res = await fetch(`/api/applications/${selected._id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, emailSubject, emailBody }),
    });
    const updated = await res.json();
    setApps(prev => prev.map(a => a._id === selected._id ? { ...a, status } : a));
    toast(status === "approved" ? "✓ Approved & listed! Email sent." : "Application rejected. Email sent.");
    setSelected(null);
    setProcessing(false);
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/applications/${id}`, { method: "DELETE" });
    setApps(prev => prev.filter(a => a._id !== id));
    toast("Application deleted");
  };

  const openReject = (app: App) => {
    setRejectTarget(app);
    const t = getTemplate("rejected", app);
    setRejectSubject(t.subject);
    setRejectBody(t.body);
  };

  const handleReject = async () => {
    if (!rejectTarget) return;
    setRejecting(true);
    await fetch(`/api/applications/${rejectTarget._id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected", emailSubject: rejectSubject, emailBody: rejectBody }),
    });
    setApps(prev => prev.map(a => a._id === rejectTarget._id ? { ...a, status: "rejected" } : a));
    toast("Application rejected. Email sent.");
    setRejectTarget(null);
    setRejecting(false);
  };

  const filtered = filter === "all" ? apps : apps.filter(a => a.status === filter || a.type === filter);
  const counts = { all: apps.length, pending: apps.filter(a => a.status === "pending").length, approved: apps.filter(a => a.status === "approved").length, rejected: apps.filter(a => a.status === "rejected").length };

  return (
    <div className="space-y-5">
      <Toast message={toastMsg} show={showToast} />
      <div>
        <h1 className="text-2xl font-bold text-white">Applications</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review founder and startup applications</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-gray-800">
        {[
          { key: "all", label: `All (${counts.all})` },
          { key: "pending", label: `Pending (${counts.pending})` },
          { key: "approved", label: `Approved (${counts.approved})` },
          { key: "rejected", label: `Rejected (${counts.rejected})` },
          { key: "founder", label: "Founders" },
          { key: "startup", label: "Startups" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${filter === key ? "border-brand-red text-white" : "border-transparent text-gray-500 hover:text-gray-300"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-800 text-left">
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-5 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800">
            {loading && <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">Loading...</td></tr>}
            {!loading && filtered.length === 0 && <tr><td colSpan={6} className="px-5 py-12 text-center text-gray-500">No applications found.</td></tr>}
            {!loading && filtered.map(app => (
              <tr key={app._id} className="hover:bg-gray-800/40 transition-colors">
                <td className="px-5 py-4">
                  <p className="font-medium text-white">{app.userName}</p>
                  <p className="text-xs text-gray-500">{app.userEmail}</p>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${app.type === "startup" ? "bg-blue-500/20 text-blue-400" : "bg-purple-500/20 text-purple-400"}`}>
                    {app.type}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-300">{app.data?.name || app.data?.fullName}</td>
                <td className="px-5 py-4">
                  <span className={`flex items-center gap-1.5 w-fit text-[10px] font-bold uppercase px-2 py-1 rounded ${statusColors[app.status]}`}>
                    {app.status === "approved" ? <CheckCircle size={11} /> : app.status === "rejected" ? <XCircle size={11} /> : <Clock size={11} />}
                    {app.status}
                  </span>
                </td>
                <td className="px-5 py-4 text-gray-500 text-xs">{new Date(app.createdAt).toLocaleDateString()}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={() => openApp(app)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"><Eye size={14} /></button>
                    {app.status !== "rejected" && (
                      <button onClick={() => openReject(app)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Reject"><XCircle size={14} /></button>
                    )}
                    <button onClick={() => handleDelete(app._id)} className="p-1.5 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={14} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 sticky top-0 bg-gray-900 z-10">
              <div>
                <h2 className="text-lg font-bold text-white capitalize">{selected.type} Application</h2>
                <p className="text-xs text-gray-500">{selected.userName} · {selected.userEmail}</p>
              </div>
              <button onClick={() => setSelected(null)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"><X size={18} /></button>
            </div>
            <div className="p-6 space-y-5">
              {/* Application data */}
              <div className="bg-gray-800 rounded-lg p-4 space-y-2">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">Application Details</p>
                {Object.entries(selected.data || {}).filter(([k]) => !["pitchDeck","socialLinks"].includes(k)).map(([k, v]) => (
                  v ? <div key={k} className="flex gap-3 text-sm">
                    <span className="text-gray-500 capitalize w-36 flex-shrink-0">{k.replace(/([A-Z])/g, " $1")}</span>
                    <span className="text-gray-200 flex-1">{String(v)}</span>
                  </div> : null
                ))}
                {selected.data?.pitchDeck && (
                  <a href={selected.data.pitchDeck} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 text-brand-red text-sm hover:underline mt-2">
                    <ExternalLink size={13} /> View Pitch Deck
                  </a>
                )}
              </div>

              {/* Email customization */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Notification Email</p>
                  <div className="flex gap-1">
                    <button type="button" onClick={() => { const t = getTemplate("approved", selected); setEmailSubject(t.subject); setEmailBody(t.body); }}
                      className="text-[10px] px-2 py-1 bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors font-semibold">Approval Template</button>
                    <button type="button" onClick={() => { const t = getTemplate("rejected", selected); setEmailSubject(t.subject); setEmailBody(t.body); }}
                      className="text-[10px] px-2 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-semibold">Rejection Template</button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Subject</label>
                  <input value={emailSubject} onChange={e => setEmailSubject(e.target.value)}
                    className="w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red" />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">Email Body</label>
                  <textarea value={emailBody} onChange={e => setEmailBody(e.target.value)} rows={8}
                    className="w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red resize-none" />
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button onClick={() => setSelected(null)} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors">Cancel</button>
                <button onClick={() => handleAction("rejected")} disabled={processing}
                  className="flex-1 px-4 py-2.5 bg-gray-700 text-red-400 rounded-lg text-sm font-semibold hover:bg-red-500/20 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  <XCircle size={14} /> Reject & Notify
                </button>
                <button onClick={() => handleAction("approved")} disabled={processing}
                  className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg text-sm font-semibold hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  <CheckCircle size={14} /> {processing ? "Processing..." : "Approve & List"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection popup */}
      {rejectTarget && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900 border border-red-500/30 rounded-xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <XCircle size={16} className="text-red-400" />
                <h2 className="text-base font-bold text-white">Reject Application</h2>
              </div>
              <button onClick={() => setRejectTarget(null)} className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg"><X size={16} /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-gray-800 rounded-lg px-4 py-3 text-sm">
                <span className="text-gray-400">Applicant: </span>
                <span className="text-white font-medium">{rejectTarget.userName}</span>
                <span className="text-gray-500 ml-2">({rejectTarget.userEmail})</span>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Email Subject</label>
                <input value={rejectSubject} onChange={e => setRejectSubject(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-400 mb-1.5">Rejection Message</label>
                <textarea value={rejectBody} onChange={e => setRejectBody(e.target.value)} rows={7}
                  className="w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-red-500 transition-colors resize-none" />
              </div>
              <div className="flex gap-3 pt-1">
                <button onClick={() => setRejectTarget(null)} className="flex-1 px-4 py-2.5 border border-gray-700 text-gray-300 rounded-lg text-sm hover:bg-gray-800 transition-colors">Cancel</button>
                <button onClick={handleReject} disabled={rejecting}
                  className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  <XCircle size={14} /> {rejecting ? "Sending..." : "Send & Reject"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
