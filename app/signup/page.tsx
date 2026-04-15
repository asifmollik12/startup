"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteLogo from "@/components/SiteLogo";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    localStorage.setItem("user", JSON.stringify(data));
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-brand-gray flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <Link href="/"><SiteLogo /></Link>
        </div>

        <div className="bg-white border border-brand-border p-8">
          <h1 className="font-serif text-2xl font-bold text-brand-dark mb-1">Create account</h1>
          <p className="text-gray-400 text-sm mb-6">Join Bangladesh's premier startup community</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Full Name</label>
              <div className="relative">
                <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" required placeholder="Your full name"
                  value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-brand-border pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
              <div className="relative">
                <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="email" required placeholder="your@email.com"
                  value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full border border-brand-border pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
              <div className="relative">
                <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type={show ? "text" : "password"} required placeholder="Min. 8 characters"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-brand-border pl-9 pr-10 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {show ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-brand-red text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? "Creating account..." : <><span>Create Account</span><ArrowRight size={14} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-brand-red font-semibold hover:underline">Sign in</Link>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By creating an account you agree to our{" "}
          <span className="text-brand-red cursor-pointer hover:underline">Terms of Service</span>
        </p>
      </div>
    </div>
  );
}
