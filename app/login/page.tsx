"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import SiteLogo from "@/components/SiteLogo";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    localStorage.setItem("user", JSON.stringify(data));
    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-[#f0ede8] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-8">
          <Link href="/"><SiteLogo /></Link>
        </div>

        <div className="bg-white border border-brand-border p-8 shadow-sm">
          <h1 className="font-serif text-2xl font-bold text-brand-dark mb-6">Sign in</h1>

          {error && (
            <p className="text-red-500 text-xs bg-red-50 border border-red-200 px-3 py-2 mb-4">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
              <input type="email" required autoFocus placeholder="your@email.com"
                value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full border border-brand-border text-sm text-gray-900 placeholder-gray-400 px-3 py-3 focus:outline-none focus:border-brand-red transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
              <div className="relative">
                <input type={show ? "text" : "password"} required placeholder="••••••••"
                  value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full border border-brand-border text-sm text-gray-900 placeholder-gray-400 px-3 py-3 pr-10 focus:outline-none focus:border-brand-red transition-colors" />
                <button type="button" onClick={() => setShow(!show)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {show ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-red text-white py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-60 mt-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn size={15} /> Sign In</>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="text-brand-red hover:underline font-semibold">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
