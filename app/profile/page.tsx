"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Edit2, Save, X, Lightbulb, BookOpen, LogOut, Upload, Trophy, Calendar, Users, Rocket, CheckCircle, Clock, XCircle } from "lucide-react";

type UserData = { id: string; name: string; email: string; avatar: string; bio: string; ideas: any[] };
type Application = { _id: string; type: string; status: string; createdAt: string; data: any };

const inp = "w-full border border-brand-border px-4 py-2.5 text-sm focus:outline-none focus:border-brand-red transition-colors bg-white";
const statusIcon = (s: string) => s === "approved" ? <CheckCircle size={13} className="text-green-500" /> : s === "rejected" ? <XCircle size={13} className="text-red-500" /> : <Clock size={13} className="text-amber-500" />;
const statusLabel = (s: string) => s === "approved" ? "text-green-600" : s === "rejected" ? "text-red-500" : "text-amber-600";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [tab, setTab] = useState<"overview" | "ideas" | "reading" | "founder" | "startup">("overview");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [appSubmitting, setAppSubmitting] = useState(false);
  const [appSuccess, setAppSuccess] = useState("");

  // Founder form
  const [founderForm, setFounderForm] = useState({ fullName: "", title: "", company: "", industry: "", founded: "", location: "", bio: "", netWorth: "", linkedin: "", website: "" });
  // Startup form
  const [startupForm, setStartupForm] = useState({ name: "", tagline: "", description: "", industry: "", stage: "Seed", founded: "", location: "", funding: "", website: "", founders: "" });

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/login"); return; }
    const local = JSON.parse(stored);
    fetch(`/api/user/${local.id}`).then(r => r.json()).then(data => {
      setUser(data);
      setForm({ name: data.name, bio: data.bio || "" });
    });
    fetch(`/api/applications?userId=${local.id}`).then(r => r.json()).then(setApplications).catch(() => {});
  }, [router]);

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const res = await fetch(`/api/user/${user.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, bio: form.bio, avatar: user.avatar }),
    });
    const updated = await res.json();
    setUser({ ...user, ...updated });
    localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user")!), name: updated.name, avatar: updated.avatar }));
    setSaving(false);
    setEditing(false);
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;
    setAvatarUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (data.url) {
      await fetch(`/api/user/${user.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: user.name, bio: user.bio, avatar: data.url }) });
      setUser({ ...user, avatar: data.url });
      localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user")!), avatar: data.url }));
    }
    setAvatarUploading(false);
  };

  const submitApplication = async (type: "founder" | "startup") => {
    if (!user) return;
    setAppSubmitting(true);
    const data = type === "founder" ? founderForm : startupForm;
    const res = await fetch("/api/applications", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type, userId: user.id, userName: user.name, userEmail: user.email, data }),
    });
    const app = await res.json();
    setApplications(prev => [app, ...prev]);
    setAppSuccess(type === "founder" ? "Founder application submitted!" : "Startup application submitted!");
    setTimeout(() => setAppSuccess(""), 4000);
    setAppSubmitting(false);
  };

  const logout = () => { localStorage.removeItem("user"); router.push("/"); router.refresh(); };

  if (!user) return (
    <div className="min-h-screen bg-brand-gray flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-brand-gray">
      {/* Profile header */}
      <div className="bg-brand-dark border-b border-white/10">
        <div className="container-wide py-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-20 h-20 bg-brand-red flex items-center justify-center overflow-hidden">
                {user.avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-white font-serif font-bold text-3xl">{user.name.charAt(0).toUpperCase()}</span>
                )}
              </div>
              <button onClick={() => avatarRef.current?.click()}
                className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-brand-border flex items-center justify-center hover:bg-brand-red hover:text-white transition-colors">
                {avatarUploading ? <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" /> : <Upload size={11} />}
              </button>
              <input ref={avatarRef} type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
            </div>

            {/* Info */}
            <div className="flex-1">
              {editing ? (
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="bg-white/10 border border-white/20 text-white px-3 py-1.5 text-lg font-bold focus:outline-none focus:border-brand-red mb-1 w-full max-w-xs" />
              ) : (
                <h1 className="text-2xl font-bold text-white">{user.name}</h1>
              )}
              <p className="text-gray-400 text-sm flex items-center gap-1.5 mt-0.5"><Mail size={12} />{user.email}</p>
              {editing ? (
                <input value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })}
                  placeholder="Short bio..."
                  className="bg-white/10 border border-white/20 text-gray-300 px-3 py-1.5 text-sm focus:outline-none focus:border-brand-red mt-2 w-full max-w-sm" />
              ) : (
                user.bio && <p className="text-gray-400 text-sm mt-1">{user.bio}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {editing ? (
                <>
                  <button onClick={handleSave} disabled={saving}
                    className="flex items-center gap-1.5 px-4 py-2 bg-brand-red text-white text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-60">
                    <Save size={13} /> {saving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => setEditing(false)} className="p-2 text-gray-400 hover:text-white transition-colors"><X size={16} /></button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditing(true)}
                    className="flex items-center gap-1.5 px-4 py-2 border border-white/20 text-gray-300 text-xs font-semibold hover:border-white hover:text-white transition-colors">
                    <Edit2 size={13} /> Edit Profile
                  </button>
                  <button onClick={logout} className="flex items-center gap-1.5 px-4 py-2 border border-white/10 text-gray-500 text-xs hover:text-red-400 hover:border-red-400/30 transition-colors">
                    <LogOut size={13} /> Sign Out
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-6 pt-6 border-t border-white/10">
            <div className="text-center">
              <p className="text-xl font-bold text-white">{user.ideas?.length ?? 0}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Ideas Submitted</p>
            </div>
            <div className="w-px bg-white/10" />
            <div className="text-center">
              <p className="text-xl font-bold text-white">{user.ideas?.reduce((a: number, i: any) => a + (i.votes || 0), 0)}</p>
              <p className="text-[10px] uppercase tracking-wider text-gray-500">Total Votes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-brand-border">
        <div className="container-wide">
          <div className="flex gap-0 overflow-x-auto">
            {[
              { key: "overview", label: "Overview", icon: User },
              { key: "ideas", label: `My Ideas (${user.ideas?.length ?? 0})`, icon: Lightbulb },
              { key: "reading", label: "Reading List", icon: BookOpen },
              { key: "founder", label: "Apply as Founder", icon: Users },
              { key: "startup", label: "List Your Startup", icon: Rocket },
            ].map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key as any)}
                className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors whitespace-nowrap ${
                  tab === key ? "border-brand-red text-brand-red" : "border-transparent text-gray-500 hover:text-brand-dark"
                }`}>
                <Icon size={13} />{label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container-wide py-8">

        {tab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white border border-brand-border p-6">
                <h3 className="font-bold text-sm uppercase tracking-wider text-gray-400 mb-4">Account Details</h3>
                <div className="space-y-3">
                  {[
                    { label: "Full Name", value: user.name },
                    { label: "Email", value: user.email },
                    { label: "Member Since", value: new Date().getFullYear().toString() },
                  ].map(({ label, value }) => (
                    <div key={label} className="flex justify-between py-2 border-b border-brand-border last:border-0">
                      <span className="text-xs text-gray-400">{label}</span>
                      <span className="text-sm font-medium text-brand-dark">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="bg-white border border-brand-border p-6">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/ideas" className="flex items-center gap-3 p-3 hover:bg-brand-gray transition-colors group">
                    <Lightbulb size={14} className="text-brand-red" />
                    <span className="text-sm text-gray-700 group-hover:text-brand-red transition-colors">Submit an Idea</span>
                  </Link>
                  <Link href="/articles" className="flex items-center gap-3 p-3 hover:bg-brand-gray transition-colors group">
                    <BookOpen size={14} className="text-brand-red" />
                    <span className="text-sm text-gray-700 group-hover:text-brand-red transition-colors">Browse Features</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "ideas" && (
          <div className="space-y-4">
            {user.ideas?.length === 0 ? (
              <div className="bg-white border border-brand-border p-12 text-center">
                <Lightbulb size={32} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">You haven&apos;t submitted any ideas yet.</p>
                <Link href="/ideas" className="btn-primary text-xs">Submit Your First Idea</Link>
              </div>
            ) : (
              user.ideas.map((idea: any) => (
                <div key={idea._id} className="bg-white border border-brand-border p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="badge-red text-[9px]">{idea.category}</span>
                        {idea.winner && <span className="flex items-center gap-1 text-[9px] font-bold text-brand-gold uppercase"><Trophy size={10} /> Winner</span>}
                      </div>
                      <h3 className="font-serif font-bold text-lg text-brand-dark mb-1">{idea.title}</h3>
                      <p className="text-gray-500 text-sm line-clamp-2">{idea.description}</p>
                      <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1"><Calendar size={10} />{new Date(idea.createdAt).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Trophy size={10} />{idea.votes} votes</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {tab === "reading" && (
          <div className="bg-white border border-brand-border p-12 text-center">
            <BookOpen size={32} className="text-gray-300 mx-auto mb-3" />
            <p className="text-gray-400 mb-4">Your reading list is empty.</p>
            <Link href="/articles" className="btn-primary text-xs">Browse Features</Link>
          </div>
        )}

        {(tab === "founder" || tab === "startup") && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              {appSuccess && (
                <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 px-4 py-3 mb-5 text-sm">
                  <CheckCircle size={15} /> {appSuccess}
                </div>
              )}

              {tab === "founder" && (
                <div className="bg-white border border-brand-border p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 bg-brand-red" />
                    <h2 className="font-serif text-xl font-bold text-brand-dark">Apply as a Founder</h2>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">Get featured on Start-Up News as a verified Bangladeshi founder.</p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Full Name *</label>
                        <input value={founderForm.fullName} onChange={e => setFounderForm({...founderForm, fullName: e.target.value})} className={inp} placeholder="Your full name" /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Title *</label>
                        <input value={founderForm.title} onChange={e => setFounderForm({...founderForm, title: e.target.value})} className={inp} placeholder="CEO & Co-Founder" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Company *</label>
                        <input value={founderForm.company} onChange={e => setFounderForm({...founderForm, company: e.target.value})} className={inp} placeholder="Company name" /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Industry *</label>
                        <input value={founderForm.industry} onChange={e => setFounderForm({...founderForm, industry: e.target.value})} className={inp} placeholder="e.g. Fintech, Edtech" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Founded Year</label>
                        <input value={founderForm.founded} onChange={e => setFounderForm({...founderForm, founded: e.target.value})} className={inp} placeholder="2020" /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Location</label>
                        <input value={founderForm.location} onChange={e => setFounderForm({...founderForm, location: e.target.value})} className={inp} placeholder="Dhaka" /></div>
                    </div>
                    <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Bio *</label>
                      <textarea value={founderForm.bio} onChange={e => setFounderForm({...founderForm, bio: e.target.value})} rows={3} className={inp + " resize-none"} placeholder="Brief bio about yourself and your journey..." /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">LinkedIn</label>
                        <input value={founderForm.linkedin} onChange={e => setFounderForm({...founderForm, linkedin: e.target.value})} className={inp} placeholder="https://linkedin.com/in/..." /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Website</label>
                        <input value={founderForm.website} onChange={e => setFounderForm({...founderForm, website: e.target.value})} className={inp} placeholder="https://..." /></div>
                    </div>
                    <button onClick={() => submitApplication("founder")} disabled={appSubmitting || !founderForm.fullName || !founderForm.company}
                      className="w-full bg-brand-red text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-50">
                      {appSubmitting ? "Submitting..." : "Submit Founder Application"}
                    </button>
                  </div>
                </div>
              )}

              {tab === "startup" && (
                <div className="bg-white border border-brand-border p-6 lg:p-8">
                  <div className="flex items-center gap-2 mb-5">
                    <div className="w-1 h-5 bg-brand-red" />
                    <h2 className="font-serif text-xl font-bold text-brand-dark">List Your Startup</h2>
                  </div>
                  <p className="text-gray-400 text-sm mb-6">Get your startup featured in Bangladesh's most comprehensive startup directory.</p>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Startup Name *</label>
                        <input value={startupForm.name} onChange={e => setStartupForm({...startupForm, name: e.target.value})} className={inp} placeholder="Your startup name" /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Industry *</label>
                        <input value={startupForm.industry} onChange={e => setStartupForm({...startupForm, industry: e.target.value})} className={inp} placeholder="e.g. Fintech, Agritech" /></div>
                    </div>
                    <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Tagline *</label>
                      <input value={startupForm.tagline} onChange={e => setStartupForm({...startupForm, tagline: e.target.value})} className={inp} placeholder="One-line description" /></div>
                    <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Description *</label>
                      <textarea value={startupForm.description} onChange={e => setStartupForm({...startupForm, description: e.target.value})} rows={3} className={inp + " resize-none"} placeholder="What does your startup do?" /></div>
                    <div className="grid grid-cols-3 gap-4">
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Stage</label>
                        <select value={startupForm.stage} onChange={e => setStartupForm({...startupForm, stage: e.target.value})} className={inp}>
                          {["Pre-seed","Seed","Series A","Series B","Growth"].map(s => <option key={s}>{s}</option>)}
                        </select></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Founded</label>
                        <input value={startupForm.founded} onChange={e => setStartupForm({...startupForm, founded: e.target.value})} className={inp} placeholder="2022" /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Location</label>
                        <input value={startupForm.location} onChange={e => setStartupForm({...startupForm, location: e.target.value})} className={inp} placeholder="Dhaka" /></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Funding Raised</label>
                        <input value={startupForm.funding} onChange={e => setStartupForm({...startupForm, funding: e.target.value})} className={inp} placeholder="$500K" /></div>
                      <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Website</label>
                        <input value={startupForm.website} onChange={e => setStartupForm({...startupForm, website: e.target.value})} className={inp} placeholder="https://..." /></div>
                    </div>
                    <div><label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Founders (comma separated)</label>
                      <input value={startupForm.founders} onChange={e => setStartupForm({...startupForm, founders: e.target.value})} className={inp} placeholder="Arif Hossain, Priya Das" /></div>
                    <button onClick={() => submitApplication("startup")} disabled={appSubmitting || !startupForm.name || !startupForm.description}
                      className="w-full bg-brand-red text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-50">
                      {appSubmitting ? "Submitting..." : "Submit Startup Application"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Applications sidebar */}
            <div className="space-y-4">
              <div className="bg-white border border-brand-border p-5">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">My Applications</h3>
                {applications.length === 0 ? (
                  <p className="text-xs text-gray-400">No applications yet.</p>
                ) : (
                  <div className="space-y-3">
                    {applications.map(app => (
                      <div key={app._id} className="border border-brand-border p-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold uppercase text-brand-dark">{app.type === "founder" ? "Founder" : "Startup"}</span>
                          <div className={`flex items-center gap-1 text-xs font-semibold capitalize ${statusLabel(app.status)}`}>
                            {statusIcon(app.status)} {app.status}
                          </div>
                        </div>
                        <p className="text-xs text-gray-500">{app.data?.fullName || app.data?.name}</p>
                        <p className="text-[10px] text-gray-400 mt-0.5">{new Date(app.createdAt).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="bg-brand-dark text-white p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Review Process</p>
                <p className="text-xs text-gray-400 leading-relaxed">Applications are reviewed by our editorial team within 3-5 business days. You&apos;ll be notified by email.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
