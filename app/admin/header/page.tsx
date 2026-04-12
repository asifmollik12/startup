"use client";
import { useState } from "react";
import { headerConfig, HeaderConfig } from "@/lib/headerConfig";
import { Save, Plus, Trash2, GripVertical, Eye, EyeOff, PanelTop } from "lucide-react";

type NavLink = { label: string; href: string };
type Stat = { value: string; label: string };

export default function AdminHeader() {
  const [config, setConfig] = useState<HeaderConfig>(JSON.parse(JSON.stringify(headerConfig)));
  const [saved, setSaved] = useState(false);
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<number | null>(null);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  // Nav link helpers
  const updateNav = (i: number, key: keyof NavLink, val: string) => {
    const links = [...config.navLinks];
    links[i] = { ...links[i], [key]: val };
    setConfig({ ...config, navLinks: links });
  };
  const addNav = () => setConfig({ ...config, navLinks: [...config.navLinks, { label: "", href: "/" }] });
  const removeNav = (i: number) => setConfig({ ...config, navLinks: config.navLinks.filter((_, idx) => idx !== i) });

  const handleDragStart = (i: number) => setDragging(i);
  const handleDragOver = (e: React.DragEvent, i: number) => { e.preventDefault(); setDragOver(i); };
  const handleDrop = (toIdx: number) => {
    if (dragging === null || dragging === toIdx) { setDragging(null); setDragOver(null); return; }
    const links = [...config.navLinks];
    const [moved] = links.splice(dragging, 1);
    links.splice(toIdx, 0, moved);
    setConfig({ ...config, navLinks: links });
    setDragging(null); setDragOver(null);
  };

  // Banner stat helpers
  const updateStat = (i: number, key: keyof Stat, val: string) => {
    const stats = [...config.topBanner.stats];
    stats[i] = { ...stats[i], [key]: val };
    setConfig({ ...config, topBanner: { ...config.topBanner, stats } });
  };
  const addStat = () => setConfig({ ...config, topBanner: { ...config.topBanner, stats: [...config.topBanner.stats, { value: "", label: "" }] } });
  const removeStat = (i: number) => setConfig({ ...config, topBanner: { ...config.topBanner, stats: config.topBanner.stats.filter((_, idx) => idx !== i) } });

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Header</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage navbar, top bar, and ad banner</p>
        </div>
        <button
          onClick={save}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${saved ? "bg-green-600 text-white" : "bg-brand-red text-white hover:bg-red-700"}`}
        >
          <Save size={15} /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Top Bar */}
      <Section title="Top Bar" icon={<PanelTop size={14} className="text-brand-red" />}>
        <Field label="Tagline Text">
          <input
            value={config.topBar.tagline}
            onChange={(e) => setConfig({ ...config, topBar: { ...config.topBar, tagline: e.target.value } })}
            className={inp}
            placeholder="Bangladesh's Premier Startup & Business News"
          />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          {config.topBar.links.map((link, i) => (
            <div key={i} className="space-y-2">
              <Field label={`Link ${i + 1} Label`}>
                <input value={link.label} onChange={(e) => {
                  const links = [...config.topBar.links];
                  links[i] = { ...links[i], label: e.target.value };
                  setConfig({ ...config, topBar: { ...config.topBar, links } });
                }} className={inp} />
              </Field>
              <Field label={`Link ${i + 1} URL`}>
                <input value={link.href} onChange={(e) => {
                  const links = [...config.topBar.links];
                  links[i] = { ...links[i], href: e.target.value };
                  setConfig({ ...config, topBar: { ...config.topBar, links } });
                }} className={inp} />
              </Field>
            </div>
          ))}
        </div>
      </Section>

      {/* Logo */}
      <Section title="Logo & Branding">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Badge Text">
            <input value={config.logo.badge} onChange={(e) => setConfig({ ...config, logo: { ...config.logo, badge: e.target.value } })} className={inp} placeholder="SUN" />
          </Field>
          <Field label="Site Name">
            <input value={config.logo.name} onChange={(e) => setConfig({ ...config, logo: { ...config.logo, name: e.target.value } })} className={inp} placeholder="START-UP NEWS" />
          </Field>
          <Field label="Subtitle">
            <input value={config.logo.subtitle} onChange={(e) => setConfig({ ...config, logo: { ...config.logo, subtitle: e.target.value } })} className={inp} placeholder="Bangladesh Business" />
          </Field>
        </div>

        {/* Live preview */}
        <div className="mt-3 p-4 bg-gray-800 rounded-lg">
          <p className="text-xs text-gray-500 mb-3 uppercase tracking-wider">Preview</p>
          <div className="flex items-center gap-3">
            <div className="bg-brand-red text-white font-serif font-bold text-lg px-2.5 py-1 leading-tight tracking-wider">
              {config.logo.badge || "SUN"}
            </div>
            <div className="leading-tight">
              <div className="font-serif font-bold text-lg text-white tracking-tight">{config.logo.name || "START-UP NEWS"}</div>
              <div className="text-[8px] tracking-[0.35em] uppercase text-gray-400">{config.logo.subtitle || "Bangladesh Business"}</div>
            </div>
          </div>
        </div>
      </Section>

      {/* Nav Links */}
      <Section title="Navigation Links">
        <p className="text-xs text-gray-500 mb-3">Drag to reorder</p>
        <div className="space-y-2">
          {config.navLinks.map((link, i) => (
            <div
              key={i}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragOver={(e) => handleDragOver(e, i)}
              onDrop={() => handleDrop(i)}
              onDragEnd={() => { setDragging(null); setDragOver(null); }}
              className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
                dragging === i ? "opacity-40 border-gray-700 bg-gray-800" :
                dragOver === i ? "border-brand-red bg-brand-red/10" :
                "border-gray-700 bg-gray-800 hover:border-gray-600"
              }`}
            >
              <GripVertical size={15} className="text-gray-600 flex-shrink-0" />
              <input
                value={link.label}
                onChange={(e) => updateNav(i, "label", e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-200 focus:outline-none placeholder-gray-600"
                placeholder="Label"
              />
              <input
                value={link.href}
                onChange={(e) => updateNav(i, "href", e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-400 focus:outline-none placeholder-gray-600"
                placeholder="/path"
              />
              <button onClick={() => removeNav(i)} className="p-1 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                <Trash2 size={13} />
              </button>
            </div>
          ))}
        </div>
        <button onClick={addNav} className="mt-3 flex items-center gap-2 text-xs text-brand-red hover:text-red-400 transition-colors font-medium">
          <Plus size={13} /> Add Nav Link
        </button>
      </Section>

      {/* Top Banner Ad */}
      <Section title="Advertisement Banner">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-gray-400">970×90 Leaderboard Banner</p>
          <button
            onClick={() => setConfig({ ...config, topBanner: { ...config.topBanner, visible: !config.topBanner.visible } })}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              config.topBanner.visible ? "bg-green-500/20 text-green-400 hover:bg-green-500/30" : "bg-gray-700 text-gray-400 hover:bg-gray-600"
            }`}
          >
            {config.topBanner.visible ? <><Eye size={12} /> Visible</> : <><EyeOff size={12} /> Hidden</>}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Title">
            <input value={config.topBanner.title} onChange={(e) => setConfig({ ...config, topBanner: { ...config.topBanner, title: e.target.value } })} className={inp} />
          </Field>
          <Field label="Subtitle">
            <input value={config.topBanner.subtitle} onChange={(e) => setConfig({ ...config, topBanner: { ...config.topBanner, subtitle: e.target.value } })} className={inp} />
          </Field>
          <Field label="Link URL">
            <input value={config.topBanner.href} onChange={(e) => setConfig({ ...config, topBanner: { ...config.topBanner, href: e.target.value } })} className={inp} />
          </Field>
          <Field label="CTA Button Text">
            <input value={config.topBanner.ctaText} onChange={(e) => setConfig({ ...config, topBanner: { ...config.topBanner, ctaText: e.target.value } })} className={inp} />
          </Field>
          <Field label="Placement Label">
            <input value={config.topBanner.placementLabel} onChange={(e) => setConfig({ ...config, topBanner: { ...config.topBanner, placementLabel: e.target.value } })} className={inp} />
          </Field>
          <Field label="Placement Size">
            <input value={config.topBanner.placementSize} onChange={(e) => setConfig({ ...config, topBanner: { ...config.topBanner, placementSize: e.target.value } })} className={inp} />
          </Field>
        </div>

        {/* Stats */}
        <div className="mt-4">
          <p className="text-xs font-medium text-gray-400 mb-2">Banner Stats</p>
          <div className="space-y-2">
            {config.topBanner.stats.map((stat, i) => (
              <div key={i} className="flex items-center gap-3">
                <input
                  value={stat.value}
                  onChange={(e) => updateStat(i, "value", e.target.value)}
                  className={inp + " flex-1"}
                  placeholder="2M+"
                />
                <input
                  value={stat.label}
                  onChange={(e) => updateStat(i, "label", e.target.value)}
                  className={inp + " flex-1"}
                  placeholder="Monthly Readers"
                />
                <button onClick={() => removeStat(i)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
          <button onClick={addStat} className="mt-3 flex items-center gap-2 text-xs text-brand-red hover:text-red-400 transition-colors font-medium">
            <Plus size={13} /> Add Stat
          </button>
        </div>

        {/* Banner preview */}
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">Preview</p>
          <div className={`relative flex items-center justify-between bg-gray-950 border border-gray-700 px-6 py-4 rounded-lg overflow-hidden ${!config.topBanner.visible ? "opacity-40" : ""}`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-brand-red flex items-center justify-center flex-shrink-0">
                <span className="text-white font-serif font-bold text-xs">{config.logo.badge}</span>
              </div>
              <div>
                <p className="text-white font-bold text-sm">{config.topBanner.title}</p>
                <p className="text-gray-500 text-xs">{config.topBanner.subtitle}</p>
              </div>
            </div>
            <div className="hidden lg:flex items-center gap-5">
              {config.topBanner.stats.map((s, i) => (
                <div key={i} className="text-center">
                  <p className="text-white font-bold text-xs">{s.value}</p>
                  <p className="text-gray-600 text-[9px] uppercase">{s.label}</p>
                </div>
              ))}
            </div>
            <span className="bg-brand-red text-white text-xs font-bold px-4 py-2">{config.topBanner.ctaText}</span>
          </div>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-800">
        {icon}
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
