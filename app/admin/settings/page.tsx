"use client";
import { useState, useRef } from "react";
import { Save, Globe, Mail, Bell, Shield, ImageIcon, Upload, X } from "lucide-react";
import { useSiteLogo } from "@/lib/SiteLogoContext";

export default function AdminSettings() {
  const [saved, setSaved] = useState(false);
  const { logoUrl, setLogoUrl } = useSiteLogo();
  const [logoName, setLogoName] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoName(file.name);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    if (!res.ok) { alert("Upload failed. Check Cloudinary env vars."); return; }
    const data = await res.json();
    if (data.url) setLogoUrl(data.url);
  };

  const removeLogo = () => {
    setLogoUrl(null);
    setLogoName(null);
    if (logoRef.current) logoRef.current.value = "";
  };
  const [favicon, setFavicon] = useState<string | null>(null);
  const [faviconName, setFaviconName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["image/x-icon", "image/png", "image/svg+xml", "image/jpeg"];
    if (!allowed.includes(file.type)) return;
    setFaviconName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setFavicon(ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const removeFavicon = () => {
    setFavicon(null);
    setFaviconName(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const [site, setSite] = useState({
    name: "Start-Up News",
    tagline: "Bangladesh's Premier Business Magazine",
    email: "admin@startupnews.bd",
    twitter: "@startupnewsbd",
    linkedin: "startupnewsbd",
  });
  const [notifs, setNotifs] = useState({ newArticle: true, newFounder: false, newIdea: true });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage site configuration</p>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Site Info */}
        <Section icon={Globe} title="Site Information">
          <Field label="Site Name">
            <input value={site.name} onChange={(e) => setSite({ ...site, name: e.target.value })} className={inp} />
          </Field>
          <Field label="Tagline">
            <input value={site.tagline} onChange={(e) => setSite({ ...site, tagline: e.target.value })} className={inp} />
          </Field>
        </Section>

        {/* Site Logo */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-800">
            <ImageIcon size={15} className="text-brand-red" />
            <h2 className="font-semibold text-white text-sm">Site Logo</h2>
            <span className="ml-auto text-[10px] text-gray-500 bg-gray-800 px-2 py-0.5 rounded">Applied everywhere</span>
          </div>
          <div className="p-5">
            <div className="flex items-start gap-5">
              {/* Preview */}
              <div className="flex-shrink-0 w-24 h-24 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center overflow-hidden p-2">
                {logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={logoUrl} alt="Logo preview" className="w-full h-full object-contain" />
                ) : (
                  <ImageIcon size={28} className="text-gray-600" />
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm text-gray-300 font-medium">{logoName ?? (logoUrl ? "Custom logo active" : "No logo uploaded")}</p>
                  <p className="text-xs text-gray-500 mt-0.5">PNG, SVG, or WebP · Transparent background recommended</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => logoRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium rounded-lg hover:border-brand-red hover:text-white transition-colors"
                  >
                    <Upload size={13} /> Upload Logo
                  </button>
                  {logoUrl && (
                    <button
                      type="button"
                      onClick={removeLogo}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X size={13} /> Remove
                    </button>
                  )}
                </div>

                <input
                  ref={logoRef}
                  type="file"
                  accept=".png,.svg,.webp,.jpg,.jpeg"
                  onChange={handleLogoChange}
                  className="hidden"
                />

                {/* Where it applies */}
                <div className="flex flex-wrap gap-1.5">
                  {["Navbar", "Footer", "Admin Sidebar", "Login Page"].map((place) => (
                    <span key={place} className={`text-[10px] px-2 py-0.5 rounded font-medium ${logoUrl ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-500"}`}>
                      {logoUrl ? "✓" : "○"} {place}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Favicon */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-800">
            <ImageIcon size={15} className="text-brand-red" />
            <h2 className="font-semibold text-white text-sm">Favicon</h2>
          </div>
          <div className="p-5">
            <div className="flex items-start gap-5">
              {/* Preview box */}
              <div className="flex-shrink-0 w-20 h-20 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center overflow-hidden">
                {favicon ? (
                  <img src={favicon} alt="Favicon preview" className="w-12 h-12 object-contain" />
                ) : (
                  <ImageIcon size={24} className="text-gray-600" />
                )}
              </div>

              <div className="flex-1 space-y-3">
                <div>
                  <p className="text-sm text-gray-300 font-medium">
                    {faviconName ?? "No favicon uploaded"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Recommended: 32×32 or 64×64 px · ICO, PNG, or SVG
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 text-xs font-medium rounded-lg hover:border-brand-red hover:text-white transition-colors"
                  >
                    <Upload size={13} /> Upload Favicon
                  </button>
                  {favicon && (
                    <button
                      type="button"
                      onClick={removeFavicon}
                      className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X size={13} /> Remove
                    </button>
                  )}
                </div>

                <input
                  ref={fileRef}
                  type="file"
                  accept=".ico,.png,.svg,.jpg,.jpeg"
                  onChange={handleFaviconChange}
                  className="hidden"
                />

                {/* Browser tab preview */}
                {favicon && (
                  <div className="flex items-center gap-2 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 w-fit">
                    <img src={favicon} alt="" className="w-4 h-4 object-contain" />
                    <span className="text-xs text-gray-400">Start-Up News</span>
                    <span className="text-[10px] text-gray-600 ml-1">— browser tab preview</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <Section icon={Mail} title="Contact & Social">
          <Field label="Admin Email">
            <input type="email" value={site.email} onChange={(e) => setSite({ ...site, email: e.target.value })} className={inp} />
          </Field>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Twitter Handle">
              <input value={site.twitter} onChange={(e) => setSite({ ...site, twitter: e.target.value })} className={inp} />
            </Field>
            <Field label="LinkedIn">
              <input value={site.linkedin} onChange={(e) => setSite({ ...site, linkedin: e.target.value })} className={inp} />
            </Field>
          </div>
        </Section>

        {/* Notifications */}
        <Section icon={Bell} title="Notifications">
          {[
            { key: "newArticle" as const, label: "New article published" },
            { key: "newFounder" as const, label: "New founder added" },
            { key: "newIdea" as const, label: "New idea submitted" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center justify-between py-2 cursor-pointer">
              <span className="text-sm text-gray-300">{label}</span>
              <div
                onClick={() => setNotifs((n) => ({ ...n, [key]: !n[key] }))}
                className={`w-10 h-5 rounded-full transition-colors relative cursor-pointer ${notifs[key] ? "bg-brand-red" : "bg-gray-700"}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${notifs[key] ? "translate-x-5" : "translate-x-0.5"}`} />
              </div>
            </label>
          ))}
        </Section>

        {/* Security */}
        <Section icon={Shield} title="Security">
          <Field label="Current Password">
            <input type="password" placeholder="••••••••" className={inp} />
          </Field>
          <Field label="New Password">
            <input type="password" placeholder="••••••••" className={inp} />
          </Field>
        </Section>

        <button
          type="submit"
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            saved ? "bg-green-600 text-white" : "bg-brand-red text-white hover:bg-red-700"
          }`}
        >
          <Save size={15} /> {saved ? "Saved!" : "Save Settings"}
        </button>
      </form>
    </div>
  );
}

function Section({ icon: Icon, title, children }: { icon: React.ElementType; title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-800">
        <Icon size={15} className="text-brand-red" />
        <h2 className="font-semibold text-white text-sm">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-400 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full bg-gray-800 border border-gray-700 text-sm text-gray-200 placeholder-gray-500 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors";
