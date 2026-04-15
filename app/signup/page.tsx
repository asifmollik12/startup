"use client";
import { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import SiteLogo from "@/components/SiteLogo";
import { Eye, EyeOff, User, Mail, Lock, ArrowRight, CheckCircle } from "lucide-react";

type Step = "email" | "otp" | "details";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [form, setForm] = useState({ name: "", password: "" });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 1: Send OTP
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/send-otp", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    setStep("otp");
    setLoading(false);
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const code = otp.join("");
    const res = await fetch("/api/auth/send-otp", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp: code }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    setStep("details");
    setLoading(false);
  };

  // Step 3: Create account
  const handleDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await fetch("/api/auth/signup", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: form.name, email, password: form.password }),
    });
    const data = await res.json();
    if (!res.ok) { setError(data.error); setLoading(false); return; }
    localStorage.setItem("user", JSON.stringify(data));
    router.push("/");
    router.refresh();
  };

  const handleOtpChange = (i: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const next = [...otp];
    next[i] = val.slice(-1);
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKey = (i: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  return (
    <div className="min-h-screen bg-[#f0ede8] flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-8">
          <Link href="/"><SiteLogo /></Link>
        </div>

        <div className="bg-white border border-brand-border p-8 shadow-sm">

          {/* Step 1: Email */}
          {step === "email" && (
            <>
              <h1 className="font-serif text-3xl font-bold text-brand-dark mb-1">Create account</h1>
              <p className="text-gray-400 text-sm mb-7">Join Bangladesh&apos;s premier startup community</p>
              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-5">{error}</div>}
              <form onSubmit={handleEmailSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" required autoFocus placeholder="your@email.com"
                      value={email} onChange={e => setEmail(e.target.value)}
                      className="w-full border border-brand-border pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-brand-red text-white py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? "Sending code..." : <><span>Continue</span><ArrowRight size={14} /></>}
                </button>
              </form>
              <p className="text-center text-sm text-gray-400 mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-brand-red font-semibold hover:underline">Sign in</Link>
              </p>
            </>
          )}

          {/* Step 2: OTP */}
          {step === "otp" && (
            <>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-green-100 flex items-center justify-center rounded-full">
                  <Mail size={18} className="text-green-600" />
                </div>
                <div>
                  <h1 className="font-serif text-xl font-bold text-brand-dark">Check your email</h1>
                  <p className="text-gray-400 text-xs">We sent a 6-digit code to <span className="font-semibold text-brand-dark">{email}</span></p>
                </div>
              </div>
              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-5">{error}</div>}
              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">Verification Code</label>
                  <div className="flex gap-2 justify-between">
                    {otp.map((digit, i) => (
                      <input key={i}
                        ref={el => { otpRefs.current[i] = el; }}
                        type="text" inputMode="numeric" maxLength={1}
                        value={digit} onChange={e => handleOtpChange(i, e.target.value)}
                        onKeyDown={e => handleOtpKey(i, e)}
                        className="w-12 h-14 text-center text-xl font-bold border-2 border-brand-border focus:border-brand-red focus:outline-none transition-colors"
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-2">This code is active for 10 minutes.</p>
                </div>
                <button type="submit" disabled={loading || otp.join("").length < 6}
                  className="w-full bg-brand-red text-white py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? "Verifying..." : <><span>Verify Email</span><ArrowRight size={14} /></>}
                </button>
              </form>
              <button onClick={() => { setStep("email"); setOtp(["","","","","",""]); setError(""); }}
                className="w-full text-center text-xs text-gray-400 hover:text-brand-red mt-4 transition-colors">
                ← Use a different email
              </button>
            </>
          )}

          {/* Step 3: Details */}
          {step === "details" && (
            <>
              <div className="flex items-center gap-2 mb-5">
                <CheckCircle size={18} className="text-green-500" />
                <p className="text-sm text-green-600 font-semibold">Email verified</p>
              </div>
              <h1 className="font-serif text-2xl font-bold text-brand-dark mb-1">Complete your profile</h1>
              <p className="text-gray-400 text-sm mb-6">Almost there — just a few more details</p>
              {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 mb-5">{error}</div>}
              <form onSubmit={handleDetailsSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Full Name</label>
                  <div className="relative">
                    <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="text" required autoFocus placeholder="Your full name"
                      value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full border border-brand-border pl-9 pr-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type="email" value={email} disabled
                      className="w-full border border-brand-border pl-9 pr-4 py-3 text-sm bg-gray-50 text-gray-500 cursor-not-allowed" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">Password</label>
                  <div className="relative">
                    <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input type={show ? "text" : "password"} required placeholder="Min. 8 characters" minLength={8}
                      value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                      className="w-full border border-brand-border pl-9 pr-10 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
                    <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      {show ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-brand-red text-white py-3.5 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading ? "Creating account..." : <><span>Create Account</span><ArrowRight size={14} /></>}
                </button>
              </form>
            </>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-4">
          By creating an account you agree to our{" "}
          <span className="text-brand-red cursor-pointer hover:underline">Terms of Service</span>
        </p>
      </div>
    </div>
  );
}
