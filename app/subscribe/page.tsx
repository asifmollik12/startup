"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check, Lock, Zap, BarChart2, Users, FileText, Trophy, Star, CheckCircle, XCircle } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "৳0",
    period: "forever",
    desc: "Get started with the basics",
    features: [
      "Access to all public articles",
      "Founder profiles",
      "Startup directory",
      "Weekly newsletter",
    ],
    cta: "Get Started",
    href: "/signup",
    highlight: false,
  },
  {
    name: "Pro",
    price: "৳499",
    period: "per month",
    desc: "For serious entrepreneurs & investors",
    badge: "Most Popular",
    features: [
      "Everything in Free",
      "Exclusive in-depth reports",
      "Early access to startup materials & resources",
      "Access Business Materials",
      "Founder interviews & podcasts",
      "Investment deal flow alerts",
      "Priority support",
    ],
    cta: "Coming Soon",
    href: "#",
    highlight: true,
    comingSoon: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "per year",
    desc: "For teams, VCs & corporates",
    features: [
      "Everything in Pro",
      "Team accounts (up to 20)",
      "Custom research reports",
      "Advertising & sponsorship",
      "API access",
      "Dedicated account manager",
    ],
    cta: "Contact Us",
    href: "mailto:admin@startupnews.bd",
    highlight: false,
    comingSoon: true,
  },
];

const perks = [
  { icon: FileText, label: "Exclusive Reports", desc: "In-depth industry analysis not available to free readers" },
  { icon: Trophy, label: "Startup Materials", desc: "Templates, pitch decks, legal docs and resources for founders" },
  { icon: BarChart2, label: "Deal Flow Alerts", desc: "Investment opportunities and funding news first" },
  { icon: Users, label: "Founder Network", desc: "Connect with Bangladesh's top entrepreneurs" },
  { icon: Zap, label: "Weekly Briefing", desc: "Curated startup ecosystem news every Monday" },
  { icon: Star, label: "Premium Content", desc: "Podcasts, interviews and behind-the-scenes stories" },
];

export default function SubscribePage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string } | null>(null);
  const searchParams = useSearchParams();
  const status = searchParams.get("status");
  const plan = searchParams.get("plan");

  useEffect(() => {
    const s = localStorage.getItem("user");
    if (s) setUser(JSON.parse(s));
  }, []);

  const handleNotify = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handlePay = async (planName: string) => {
    if (!user) { window.location.href = "/login"; return; }
    setPayLoading(true);
    try {
      const res = await fetch("/api/payment/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, plan: planName }),
      });
      const data = await res.json();
      if (data.payment_url) window.location.href = data.payment_url;
      else alert(data.error || "Payment initiation failed");
    } catch {
      alert("Something went wrong. Please try again.");
    }
    setPayLoading(false);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* Payment status banner */}
      {status === "success" && (
        <div className="bg-green-50 border-b border-green-200 py-3">
          <div className="container-wide flex items-center justify-center gap-2 text-green-700 text-sm font-semibold">
            <CheckCircle size={16} /> Payment successful! Your {plan} plan is now active.
          </div>
        </div>
      )}
      {status === "failed" && (
        <div className="bg-red-50 border-b border-red-200 py-3">
          <div className="container-wide flex items-center justify-center gap-2 text-red-600 text-sm font-semibold">
            <XCircle size={16} /> Payment failed or was cancelled. Please try again.
          </div>
        </div>
      )}

      {/* Hero */}
      <div className="bg-brand-dark text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,16,46,0.15)_0%,_transparent_60%)] pointer-events-none" />
        <div className="container-wide text-center relative">
          <div className="inline-flex items-center gap-2 bg-brand-red/20 border border-brand-red/30 px-4 py-1.5 mb-6">
            <Lock size={11} className="text-brand-red" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-red">Premium Membership</span>
          </div>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold mb-5 leading-tight">
            Bangladesh&apos;s Most Trusted<br />
            <span className="text-brand-red">Startup Intelligence</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            Join 50,000+ founders, investors and business leaders who rely on Start-Up News for exclusive insights.
          </p>
          <div className="flex items-center justify-center gap-6 text-sm text-gray-500">
            {["No spam", "Cancel anytime", "Trusted by 500+ founders"].map((t, i) => (
              <span key={i} className="flex items-center gap-1.5"><Check size={13} className="text-green-400" />{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Pricing */}
      <div className="container-wide py-16 lg:py-20">
        <div className="text-center mb-12">
          <span className="section-label">Pricing</span>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-brand-dark mt-2">Choose Your Plan</h2>
          <div className="w-10 h-0.5 bg-brand-red mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div key={plan.name} className={`relative border flex flex-col ${plan.highlight ? "border-brand-red shadow-xl shadow-brand-red/10" : "border-brand-border"}`}>
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-brand-red text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1">{plan.badge}</span>
                </div>
              )}
              <div className={`p-6 ${plan.highlight ? "bg-brand-dark text-white" : "bg-white"}`}>
                <p className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.highlight ? "text-brand-red" : "text-gray-400"}`}>{plan.name}</p>
                <div className="flex items-end gap-1 mb-1">
                  <span className={`font-serif text-4xl font-bold ${plan.highlight ? "text-white" : "text-brand-dark"}`}>{plan.price}</span>
                  <span className={`text-sm mb-1 ${plan.highlight ? "text-gray-400" : "text-gray-400"}`}>/{plan.period}</span>
                </div>
                <p className={`text-sm ${plan.highlight ? "text-gray-400" : "text-gray-500"}`}>{plan.desc}</p>
              </div>
              <div className={`p-6 flex-1 flex flex-col ${plan.highlight ? "bg-gray-900" : "bg-brand-gray"}`}>
                <ul className="space-y-3 flex-1 mb-6">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <Check size={14} className={`flex-shrink-0 mt-0.5 ${plan.highlight ? "text-green-400" : "text-brand-red"}`} />
                      <span className={plan.highlight ? "text-gray-300" : "text-gray-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                {plan.comingSoon && plan.name === "Pro" ? (
                  <div className="space-y-2">
                    <button
                      onClick={() => handlePay("pro")}
                      disabled={payLoading}
                      className="w-full flex items-center justify-center gap-2 bg-brand-red text-white py-3 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors disabled:opacity-60">
                      {payLoading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><span>Subscribe Now — ৳499/mo</span><ArrowRight size={13} /></>}
                    </button>
                    <p className="text-[10px] text-center text-gray-400">bKash · Nagad · Rocket · Card</p>
                  </div>
                ) : plan.comingSoon ? (
                  <div className="space-y-2">
                    <div className={`w-full text-center py-3 text-sm font-bold uppercase tracking-wider border ${plan.highlight ? "border-white/20 text-gray-400" : "border-brand-border text-gray-400"}`}>
                      Coming Soon
                    </div>
                    {!submitted ? (
                      <form onSubmit={handleNotify} className="flex gap-2">
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                          placeholder="Get notified"
                          className={`flex-1 text-xs px-3 py-2 border focus:outline-none focus:border-brand-red ${plan.highlight ? "bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-500" : "bg-white border-brand-border text-gray-700"}`} />
                        <button type="submit" className="bg-brand-red text-white px-3 py-2 text-xs font-bold hover:bg-red-700 transition-colors">
                          <ArrowRight size={13} />
                        </button>
                      </form>
                    ) : (
                      <p className="text-xs text-green-500 text-center py-1">✓ We&apos;ll notify you!</p>
                    )}
                  </div>
                ) : (
                  <Link href={plan.href}
                    className={`w-full text-center py-3 text-sm font-bold uppercase tracking-wider transition-colors ${plan.highlight ? "bg-brand-red text-white hover:bg-red-700" : "bg-brand-dark text-white hover:bg-gray-800"}`}>
                    {plan.cta}
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Premium perks */}
      <div className="bg-brand-gray border-t border-brand-border py-16">
        <div className="container-wide">
          <div className="text-center mb-10">
            <span className="section-label">What You Get</span>
            <h2 className="font-serif text-3xl font-bold text-brand-dark mt-2">Premium Benefits</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {perks.map(({ icon: Icon, label, desc }) => (
              <div key={label} className="bg-white border border-brand-border p-5 hover:border-brand-red transition-colors group">
                <div className="w-10 h-10 bg-brand-red/10 flex items-center justify-center mb-3 group-hover:bg-brand-red transition-colors">
                  <Icon size={18} className="text-brand-red group-hover:text-white transition-colors" />
                </div>
                <h3 className="font-bold text-sm text-brand-dark mb-1">{label}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Newsletter CTA */}
      <div className="bg-brand-dark py-16">
        <div className="container-wide text-center max-w-xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-white mb-3">Start with our free newsletter</h2>
          <p className="text-gray-400 text-sm mb-6">Weekly startup news, founder stories and ecosystem updates — free forever.</p>
          <form className="flex gap-2 max-w-sm mx-auto">
            <input type="email" placeholder="your@email.com"
              className="flex-1 bg-white/10 border border-white/20 text-white placeholder-gray-500 px-4 py-3 text-sm focus:outline-none focus:border-brand-red transition-colors" />
            <button type="submit" className="bg-brand-red text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
          <p className="text-gray-600 text-xs mt-3">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </div>
  );
}
