"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ideas } from "@/lib/data";
import { Lightbulb, ThumbsUp, Trophy, Send, Sparkles, Upload, FileText, X } from "lucide-react";

export default function IdeasPage() {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [voted, setVoted] = useState<Set<string>>(new Set());
  const [showForm, setShowForm] = useState(false);
  const [pitchDeck, setPitchDeck] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const handleVote = (id: string, baseVotes: number) => {
    if (voted.has(id)) return;
    setVotes((prev) => ({ ...prev, [id]: (prev[id] ?? baseVotes) + 1 }));
    setVoted((prev) => new Set(prev).add(id));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setPitchDeck(file);
  };

  const handleIdeaSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const stored = localStorage.getItem("user");
    if (!stored) { router.push("/login"); return; }
    const user = JSON.parse(stored);
    const fd = new FormData(e.currentTarget);
    const body: any = {
      title: fd.get("title"), description: fd.get("description"),
      category: fd.get("category"), targetMarket: fd.get("targetMarket"),
      problem: fd.get("problem"), uvp: fd.get("uvp"),
      stage: fd.get("stage"), marketSize: fd.get("marketSize"),
      prototypeUrl: fd.get("prototypeUrl"), role: fd.get("role"),
      location: fd.get("location"), linkedin: fd.get("linkedin"),
      submittedBy: user.name, userId: user.id, userEmail: user.email,
      month: new Date().toLocaleString("default", { month: "long", year: "numeric" }),
    };
    if (pitchDeck) {
      setUploading(true);
      const uploadFd = new FormData();
      uploadFd.append("file", pitchDeck);
      const res = await fetch("/api/upload", { method: "POST", body: uploadFd });
      const data = await res.json();
      if (data.url) body.pitchDeck = data.url;
      setUploading(false);
    }
    await fetch("/api/ideas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    setShowForm(false);
    setPitchDeck(null);
    alert("Idea submitted successfully!");
  };

  const winner = ideas.find((i) => i.winner);
  const runners = ideas.filter((i) => !i.winner);

  return (
    <div className="section-pad">
      <div className="container-wide">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Sparkles size={16} className="text-brand-gold" />
            <span className="section-label">Community Driven</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold text-brand-dark mb-4">Best Idea of the Month</h1>
          <div className="w-12 h-0.5 bg-brand-red mx-auto mb-4" />
          <p className="text-gray-500 max-w-xl mx-auto">Submit your startup idea, vote for your favorites, and help shape Bangladesh&apos;s next big innovation.</p>
          <button onClick={() => {
            const stored = localStorage.getItem("user");
            if (!stored) { router.push("/login"); return; }
            setShowForm(!showForm);
          }} className="btn-primary mt-6">
            <Lightbulb size={15} /> Submit Your Idea
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-brand-border p-8 mb-12 max-w-2xl mx-auto">
            <h3 className="font-serif text-2xl font-bold text-brand-dark mb-1">Submit Your Idea</h3>
            <p className="text-gray-400 text-sm mb-6">Fill in the details below. The more you share, the better your chances of winning.</p>
            <form onSubmit={handleIdeaSubmit} className="space-y-5">

              {/* Idea basics */}
              <div className="border-b border-brand-border pb-5 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red">The Idea</p>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Idea Title *</label>
                  <input type="text" name="title" placeholder="Give your idea a compelling title"
                    className="w-full bg-white border border-brand-border text-gray-900 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Description *</label>
                  <textarea rows={4} name="description" placeholder="Describe your idea — the problem it solves, how it works, and why Bangladesh needs it."
                    className="w-full bg-white border border-brand-border text-gray-900 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Category *</label>
                    <select className="w-full bg-white border border-brand-border text-gray-900 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors">
                      {["Fintech","Agritech","Healthtech","Edtech","ClimaTech","Logistics","E-commerce","Future of Work","AI / Tech","Other"].map(c => <option key={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Target Market</label>
                    <input type="text" placeholder="e.g. Rural farmers, SMEs"
                      className="w-full bg-white border border-brand-border text-gray-900 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Problem Being Solved *</label>
                  <textarea rows={2} placeholder="What specific problem does this idea address?"
                    className="w-full bg-white border border-brand-border text-gray-900 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors resize-none" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Unique Value Proposition</label>
                  <input type="text" placeholder="What makes this idea different from existing solutions?"
                    className="w-full bg-white border border-brand-border text-gray-900 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Stage</label>
                    <select className="w-full bg-white border border-brand-border text-gray-900 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors">
                      {["Just an idea","Concept validated","Prototype built","Early revenue","Scaling"].map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Estimated Market Size</label>
                    <input type="text" placeholder="e.g. $50M, 2M users"
                      className="w-full bg-white border border-brand-border text-gray-900 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Prototype / Website Link <span className="text-gray-400 normal-case font-normal">(if available)</span></label>
                  <input type="text" placeholder="https://yourprototype.com or demo link"
                    className="w-full bg-white border border-brand-border text-gray-900 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                </div>
              </div>

              {/* Founder info */}
              <div className="border-b border-brand-border pb-5 space-y-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red">About You</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Your Name *</label>
                    <input type="text" placeholder="Full name"
                      className="w-full bg-white border border-brand-border text-gray-900 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Email *</label>
                    <input type="email" placeholder="your@email.com"
                      className="w-full bg-white border border-brand-border text-gray-900 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Role / Title</label>
                    <input type="text" placeholder="e.g. Founder, Student, Engineer"
                      className="w-full bg-white border border-brand-border text-gray-900 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Location</label>
                    <input type="text" placeholder="e.g. Dhaka, Chittagong"
                      className="w-full bg-white border border-brand-border text-gray-900 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Personal LinkedIn / Website</label>
                  <input type="text" placeholder="https://linkedin.com/in/yourname"
                    className="w-full bg-white border border-brand-border text-gray-900 placeholder-gray-400 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                </div>
              </div>

              {/* Pitch deck */}
              <div className="space-y-3">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red">Supporting Material</p>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Pitch Deck <span className="text-gray-400 normal-case font-normal">(PDF or PPT, optional)</span></label>
                  {pitchDeck ? (
                    <div className="flex items-center gap-3 border border-brand-border px-4 py-3 bg-brand-gray">
                      <FileText size={16} className="text-brand-red flex-shrink-0" />
                      <span className="text-sm text-gray-700 flex-1 truncate">{pitchDeck.name}</span>
                      <span className="text-xs text-gray-400">{(pitchDeck.size / 1024 / 1024).toFixed(1)} MB</span>
                      <button type="button" onClick={() => { setPitchDeck(null); if (fileRef.current) fileRef.current.value = ""; }}
                        className="text-gray-400 hover:text-red-500 transition-colors"><X size={14} /></button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center gap-2 h-24 border-2 border-dashed border-brand-border cursor-pointer hover:border-brand-red transition-colors bg-brand-gray">
                      <Upload size={18} className="text-gray-400" />
                      <span className="text-xs text-gray-500">Click to upload PDF or PPT (max 10MB)</span>
                      <input ref={fileRef} type="file" accept=".pdf,.ppt,.pptx" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              <button type="submit" disabled={uploading} className="btn-primary w-full justify-center text-sm"><Send size={14} /> {uploading ? "Uploading..." : "Submit Idea"}</button>
            </form>
          </div>
        )}

        {winner && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-5">
              <Trophy size={18} className="text-brand-gold" />
              <h2 className="font-serif text-2xl font-bold text-brand-dark">This Month&apos;s Winner</h2>
            </div>
            <div className="bg-brand-dark text-white p-8 lg:p-12 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-72 h-72 bg-brand-red/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
              <div className="relative max-w-2xl">
                <div className="flex items-center gap-3 mb-4">
                  <span className="badge bg-brand-gold/20 text-brand-gold border border-brand-gold/30 text-[9px]">{winner.category}</span>
                  <span className="text-gray-400 text-xs">{winner.month}</span>
                </div>
                <h3 className="font-serif text-3xl font-bold mb-4">{winner.title}</h3>
                <p className="text-gray-300 text-lg leading-relaxed mb-8">{winner.description}</p>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <p className="text-gray-400 text-xs uppercase tracking-wider">Submitted by</p>
                    <p className="font-bold text-lg">{winner.submittedBy}</p>
                  </div>
                  <div className="flex items-center gap-3 bg-white/10 px-6 py-3">
                    <ThumbsUp size={18} className="text-brand-gold" />
                    <div>
                      <p className="font-bold text-2xl text-brand-gold">{(votes[winner.id] ?? winner.votes).toLocaleString()}</p>
                      <p className="text-gray-400 text-xs">community votes</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 className="font-serif text-2xl font-bold text-brand-dark mb-5">Other Top Ideas</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {runners.map((idea) => (
              <div key={idea.id} className="bg-white border border-brand-border p-6 hover:border-brand-red transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <span className="badge-gray text-[9px]">{idea.category}</span>
                  <button onClick={() => handleVote(idea.id, idea.votes)}
                    className={`flex items-center gap-2 px-3 py-1.5 text-xs font-semibold border transition-colors ${
                      voted.has(idea.id) ? "bg-brand-red text-white border-brand-red" : "border-brand-border text-gray-600 hover:border-brand-red hover:text-brand-red"
                    }`}>
                    <ThumbsUp size={12} />{(votes[idea.id] ?? idea.votes).toLocaleString()}
                  </button>
                </div>
                <h3 className="font-serif font-bold text-xl text-brand-dark mb-2">{idea.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed mb-3">{idea.description}</p>
                <p className="text-xs text-gray-400">by {idea.submittedBy}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
