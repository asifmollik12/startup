"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useSiteLogo } from "@/lib/SiteLogoContext";

export default function AdminLogin() {
  const router = useRouter();
  const { logoUrl } = useSiteLogo();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    setTimeout(() => {
      if (email === "admin@gmail.com" && password === "password") {
        localStorage.setItem("admin_auth", "true");
        router.push("/admin");
      } else {
        setError("Invalid email or password.");
        setLoading(false);
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 justify-center mb-8">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt="Site Logo" className="h-12 w-auto object-contain" />
          ) : (
            <>
              <div className="bg-brand-red text-white font-serif font-bold text-lg px-2.5 py-1 leading-tight">SUN</div>
              <div>
                <div className="text-white font-bold text-base tracking-tight">START-UP NEWS</div>
                <div className="text-[9px] tracking-widest uppercase text-gray-500">Admin Panel</div>
              </div>
            </>
          )}
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h1 className="text-xl font-bold text-white mb-1">Sign in</h1>
          <p className="text-gray-500 text-sm mb-6">Access the admin dashboard</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@gmail.com"
                className="w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 px-3 py-2.5 pr-10 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs bg-red-500/10 border border-red-500/20 px-3 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-brand-red text-white py-2.5 rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><LogIn size={15} /> Sign In</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
