"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User, Mail, Edit2, Save, X, Lightbulb, BookOpen, LogOut, Upload, Trophy, Calendar } from "lucide-react";

type UserData = { id: string; name: string; email: string; avatar: string; bio: string; ideas: any[] };

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [tab, setTab] = useState<"overview" | "ideas" | "reading">("overview");
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", bio: "" });
  const [saving, setSaving] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const avatarRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/login"); return; }
    const local = JSON.parse(stored);
    fetch(`/api/user/${local.id}`).then(r => r.json()).then(data => {
      setUser(data);
      setForm({ name: data.name, bio: data.bio || "" });
    });
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
      const updated = await fetch(`/api/user/${user.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: user.name, bio: user.bio, avatar: data.url }),
      }).then(r => r.json());
      setUser({ ...user, avatar: data.url });
      localStorage.setItem("user", JSON.stringify({ ...JSON.parse(localStorage.getItem("user")!), avatar: data.url }));
    }
    setAvatarUploading(false);
  };

  const logout = () => {
    localStorage.removeItem("user");
    router.push("/");
    router.refresh();
  };

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
          <div className="flex gap-0">
            {[
              { key: "overview", label: "Overview", icon: User },
              { key: "ideas", label: `My Ideas (${user.ideas?.length ?? 0})`, icon: Lightbulb },
              { key: "reading", label: "Reading List", icon: BookOpen },
            ].map(({ key, label, icon: Icon }) => (
              <button key={key} onClick={() => setTab(key as any)}
                className={`flex items-center gap-2 px-5 py-4 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${
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
      </div>
    </div>
  );
}
