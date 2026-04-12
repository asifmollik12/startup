"use client";
import { useState, useRef } from "react";
import {
  Save, Plus, Trash2, GripVertical, PanelBottom,
  Twitter, Linkedin, Facebook, Instagram, Youtube, Globe,
  ImageIcon, Upload, X,
} from "lucide-react";
import { useFooterLogo } from "@/lib/FooterLogoContext";

type NavLink = { label: string; href: string };
type LinkGroup = { title: string; links: NavLink[] };
type Social = { platform: string; href: string };

const socialIcons: Record<string, React.ElementType> = {
  Twitter, LinkedIn: Linkedin, Facebook, Instagram, YouTube: Youtube, Website: Globe,
};

const defaultGroups: LinkGroup[] = [
  {
    title: "Explore",
    links: [
      { label: "Articles", href: "/articles" },
      { label: "Founders", href: "/founders" },
      { label: "Startups", href: "/startups" },
      { label: "Rankings", href: "/rankings" },
      { label: "Best Ideas", href: "/ideas" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Advertise", href: "/advertise" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Use", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
];

const defaultSocials: Social[] = [
  { platform: "Twitter", href: "#" },
  { platform: "LinkedIn", href: "#" },
  { platform: "Facebook", href: "#" },
  { platform: "Instagram", href: "#" },
  { platform: "YouTube", href: "#" },
];

export default function AdminFooter() {
  const [saved, setSaved] = useState(false);
  const { footerLogoUrl, setFooterLogoUrl } = useFooterLogo();
  const [logoName, setLogoName] = useState<string | null>(null);
  const logoRef = useRef<HTMLInputElement>(null);

  const handleLogoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoName(file.name);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const { url } = await res.json();
    setFooterLogoUrl(url);
  };

  const removeLogo = () => {
    setFooterLogoUrl(null);
    setLogoName(null);
    if (logoRef.current) logoRef.current.value = "";
  };

  // Newsletter
  const [newsletter, setNewsletter] = useState({
    label: "Newsletter",
    heading: "Stay Ahead of the Curve",
    subtext: "Weekly insights on Bangladesh's top entrepreneurs and startups.",
    buttonText: "Subscribe",
  });

  // Branding
  const [branding, setBranding] = useState({
    badge: "SUN",
    name: "START-UP NEWS",
    subtitle: "Bangladesh Business",
    description: "The definitive voice of Bangladeshi entrepreneurship, innovation, and startup news.",
  });

  // Link groups
  const [groups, setGroups] = useState<LinkGroup[]>(defaultGroups);

  // Socials
  const [socials, setSocials] = useState<Social[]>(defaultSocials);

  // Bottom bar
  const [bottomBar, setBottomBar] = useState({
    copyright: "© 2026 Start-Up News. All rights reserved.",
    tagline: "Made with ❤️ for Bangladesh",
  });

  // Drag state for link groups
  const [dragging, setDragging] = useState<{ g: number; i: number } | null>(null);
  const [dragOver, setDragOver] = useState<{ g: number; i: number } | null>(null);

  const save = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  // Group helpers
  const updateGroupTitle = (g: number, val: string) => {
    const next = [...groups];
    next[g] = { ...next[g], title: val };
    setGroups(next);
  };
  const updateLink = (g: number, i: number, key: keyof NavLink, val: string) => {
    const next = [...groups];
    next[g].links[i] = { ...next[g].links[i], [key]: val };
    setGroups(next);
  };
  const addLink = (g: number) => {
    const next = [...groups];
    next[g].links.push({ label: "", href: "/" });
    setGroups(next);
  };
  const removeLink = (g: number, i: number) => {
    const next = [...groups];
    next[g].links = next[g].links.filter((_, idx) => idx !== i);
    setGroups(next);
  };
  const addGroup = () => setGroups([...groups, { title: "New Section", links: [] }]);
  const removeGroup = (g: number) => setGroups(groups.filter((_, idx) => idx !== g));

  // Drag reorder within a group
  const handleDrop = (toG: number, toI: number) => {
    if (!dragging || (dragging.g === toG && dragging.i === toI)) { setDragging(null); setDragOver(null); return; }
    if (dragging.g !== toG) { setDragging(null); setDragOver(null); return; }
    const next = [...groups];
    const links = [...next[toG].links];
    const [moved] = links.splice(dragging.i, 1);
    links.splice(toI, 0, moved);
    next[toG] = { ...next[toG], links };
    setGroups(next);
    setDragging(null); setDragOver(null);
  };

  // Social helpers
  const updateSocial = (i: number, key: keyof Social, val: string) => {
    const next = [...socials];
    next[i] = { ...next[i], [key]: val };
    setSocials(next);
  };
  const removeSocial = (i: number) => setSocials(socials.filter((_, idx) => idx !== i));
  const addSocial = () => setSocials([...socials, { platform: "Website", href: "#" }]);

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Footer</h1>
          <p className="text-gray-500 text-sm mt-0.5">Manage newsletter, links, socials, and bottom bar</p>
        </div>
        <button
          onClick={save}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${saved ? "bg-green-600 text-white" : "bg-brand-red text-white hover:bg-red-700"}`}
        >
          <Save size={15} /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      {/* Footer Logo */}
      <Section icon={<ImageIcon size={14} className="text-brand-red" />} title="Footer Logo">
        <div className="flex items-start gap-5">
          <div className="flex-shrink-0 w-24 h-24 bg-gray-800 border border-gray-700 rounded-xl flex items-center justify-center overflow-hidden p-2">
            {footerLogoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={footerLogoUrl} alt="Footer logo" className="w-full h-full object-contain" />
            ) : (
              <ImageIcon size={28} className="text-gray-600" />
            )}
          </div>
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm text-gray-300 font-medium">
                {logoName ?? (footerLogoUrl ? "Custom footer logo active" : "No logo uploaded")}
              </p>
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
              {footerLogoUrl && (
                <button
                  type="button"
                  onClick={removeLogo}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <X size={13} /> Remove
                </button>
              )}
            </div>
            <input ref={logoRef} type="file" accept=".png,.svg,.webp,.jpg,.jpeg" onChange={handleLogoChange} className="hidden" />
            {footerLogoUrl && (
              <div className="flex items-center gap-3 bg-gray-950 border border-gray-700 rounded-lg px-4 py-3 w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={footerLogoUrl} alt="" className="h-6 w-auto object-contain" />
                <span className="text-[10px] text-gray-500">Footer preview</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Newsletter */}
      <Section icon={<PanelBottom size={14} className="text-brand-red" />} title="Newsletter Strip">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Section Label">
            <input value={newsletter.label} onChange={(e) => setNewsletter({ ...newsletter, label: e.target.value })} className={inp} placeholder="Newsletter" />
          </Field>
          <Field label="Button Text">
            <input value={newsletter.buttonText} onChange={(e) => setNewsletter({ ...newsletter, buttonText: e.target.value })} className={inp} placeholder="Subscribe" />
          </Field>
        </div>
        <Field label="Heading">
          <input value={newsletter.heading} onChange={(e) => setNewsletter({ ...newsletter, heading: e.target.value })} className={inp} placeholder="Stay Ahead of the Curve" />
        </Field>
        <Field label="Subtext">
          <input value={newsletter.subtext} onChange={(e) => setNewsletter({ ...newsletter, subtext: e.target.value })} className={inp} />
        </Field>

        {/* Preview */}
        <div className="mt-1 bg-gray-950 border border-gray-700 rounded-lg px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-brand-red mb-1">{newsletter.label}</p>
            <p className="text-white font-bold text-base">{newsletter.heading}</p>
            <p className="text-gray-500 text-xs mt-0.5">{newsletter.subtext}</p>
          </div>
          <div className="flex gap-0 flex-shrink-0">
            <div className="bg-white/10 border border-white/20 text-gray-400 px-4 py-2 text-xs w-44">Enter your email</div>
            <div className="bg-brand-red text-white px-4 py-2 text-xs font-semibold">{newsletter.buttonText}</div>
          </div>
        </div>
      </Section>

      {/* Branding */}
      <Section title="Footer Branding">
        <div className="grid grid-cols-3 gap-4">
          <Field label="Badge">
            <input value={branding.badge} onChange={(e) => setBranding({ ...branding, badge: e.target.value })} className={inp} placeholder="SUN" />
          </Field>
          <Field label="Site Name">
            <input value={branding.name} onChange={(e) => setBranding({ ...branding, name: e.target.value })} className={inp} />
          </Field>
          <Field label="Subtitle">
            <input value={branding.subtitle} onChange={(e) => setBranding({ ...branding, subtitle: e.target.value })} className={inp} />
          </Field>
        </div>
        <Field label="Description">
          <textarea value={branding.description} onChange={(e) => setBranding({ ...branding, description: e.target.value })} rows={2} className={inp + " resize-none"} />
        </Field>
      </Section>

      {/* Link Groups */}
      <Section title="Footer Link Columns">
        <p className="text-xs text-gray-500">Drag links within a column to reorder</p>
        <div className="space-y-5">
          {groups.map((group, g) => (
            <div key={g} className="bg-gray-800 border border-gray-700 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <input
                  value={group.title}
                  onChange={(e) => updateGroupTitle(g, e.target.value)}
                  className="flex-1 bg-gray-900 border border-gray-600 text-sm font-semibold text-white px-3 py-2 rounded-lg focus:outline-none focus:border-brand-red transition-colors"
                  placeholder="Column Title"
                />
                <button onClick={() => removeGroup(g)} className="p-1.5 text-gray-500 hover:text-red-400 transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
              <div className="space-y-1.5">
                {group.links.map((link, i) => (
                  <div
                    key={i}
                    draggable
                    onDragStart={() => setDragging({ g, i })}
                    onDragOver={(e) => { e.preventDefault(); setDragOver({ g, i }); }}
                    onDrop={() => handleDrop(g, i)}
                    onDragEnd={() => { setDragging(null); setDragOver(null); }}
                    className={`flex items-center gap-2 p-2 rounded-lg border transition-all cursor-grab active:cursor-grabbing ${
                      dragging?.g === g && dragging?.i === i ? "opacity-40 border-gray-600" :
                      dragOver?.g === g && dragOver?.i === i ? "border-brand-red bg-brand-red/10" :
                      "border-transparent hover:border-gray-600"
                    }`}
                  >
                    <GripVertical size={13} className="text-gray-600 flex-shrink-0" />
                    <input
                      value={link.label}
                      onChange={(e) => updateLink(g, i, "label", e.target.value)}
                      className="flex-1 bg-gray-900 border border-gray-700 text-sm text-gray-200 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors placeholder-gray-600"
                      placeholder="Label"
                    />
                    <input
                      value={link.href}
                      onChange={(e) => updateLink(g, i, "href", e.target.value)}
                      className="flex-1 bg-gray-900 border border-gray-700 text-sm text-gray-400 px-2.5 py-1.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors placeholder-gray-600"
                      placeholder="/path"
                    />
                    <button onClick={() => removeLink(g, i)} className="p-1 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
              <button onClick={() => addLink(g)} className="flex items-center gap-1.5 text-xs text-brand-red hover:text-red-400 transition-colors font-medium">
                <Plus size={12} /> Add Link
              </button>
            </div>
          ))}
        </div>
        <button onClick={addGroup} className="flex items-center gap-2 text-xs text-brand-red hover:text-red-400 transition-colors font-medium mt-1">
          <Plus size={13} /> Add Column
        </button>
      </Section>

      {/* Social Links */}
      <Section title="Social Media Links">
        <div className="space-y-2">
          {socials.map((social, i) => {
            const Icon = socialIcons[social.platform] ?? Globe;
            return (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gray-800 border border-gray-700 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-gray-400" />
                </div>
                <select
                  value={social.platform}
                  onChange={(e) => updateSocial(i, "platform", e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-sm text-gray-200 px-3 py-2.5 rounded-lg focus:outline-none focus:border-brand-red transition-colors w-36"
                >
                  {Object.keys(socialIcons).map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
                <input
                  value={social.href}
                  onChange={(e) => updateSocial(i, "href", e.target.value)}
                  className={inp + " flex-1"}
                  placeholder="https://..."
                />
                <button onClick={() => removeSocial(i)} className="p-1.5 text-gray-600 hover:text-red-400 transition-colors flex-shrink-0">
                  <Trash2 size={13} />
                </button>
              </div>
            );
          })}
        </div>
        <button onClick={addSocial} className="flex items-center gap-2 text-xs text-brand-red hover:text-red-400 transition-colors font-medium mt-1">
          <Plus size={13} /> Add Social
        </button>
      </Section>

      {/* Bottom Bar */}
      <Section title="Bottom Bar">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Copyright Text">
            <input value={bottomBar.copyright} onChange={(e) => setBottomBar({ ...bottomBar, copyright: e.target.value })} className={inp} />
          </Field>
          <Field label="Right Tagline">
            <input value={bottomBar.tagline} onChange={(e) => setBottomBar({ ...bottomBar, tagline: e.target.value })} className={inp} />
          </Field>
        </div>
        {/* Preview */}
        <div className="bg-gray-950 border border-gray-700 rounded-lg px-5 py-3 flex justify-between items-center">
          <span className="text-xs text-gray-500">{bottomBar.copyright}</span>
          <span className="text-xs text-gray-500">{bottomBar.tagline}</span>
        </div>
      </Section>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-gray-800">
        {icon ?? <PanelBottom size={14} className="text-brand-red" />}
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
