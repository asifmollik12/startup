import Link from "next/link";
import { ArrowRight, Users, Target, Globe, Award } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us — Start-Up News",
  description: "Bangladesh's premier startup and business news platform.",
};

const values = [
  { icon: Target, title: "Our Mission", desc: "To be the definitive voice of Bangladeshi entrepreneurship — telling the stories of founders, startups, and innovators shaping the nation's future." },
  { icon: Globe, title: "Our Reach", desc: "Serving 2M+ monthly readers across Bangladesh and the diaspora, covering 64 districts and every major industry vertical." },
  { icon: Users, title: "Our Community", desc: "A growing network of 500+ profiled founders, 1,200+ listed startups, and thousands of investors, operators, and ecosystem builders." },
  { icon: Award, title: "Our Standard", desc: "Rigorous, independent journalism. We don't take money for editorial coverage. Every ranking, profile, and story is earned on merit." },
];

const team = [
  { name: "Editorial Team", role: "News & Features", initial: "E" },
  { name: "Research Team", role: "Rankings & Data", initial: "R" },
  { name: "Product Team", role: "Platform & Tech", initial: "P" },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-brand-dark text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,16,46,0.15)_0%,_transparent_60%)] pointer-events-none" />
        <div className="container-wide relative">
          <span className="section-label mb-4 block">About Us</span>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight max-w-3xl mb-6">
            Bangladesh&apos;s Premier<br />
            <span className="text-brand-red">Startup Intelligence</span> Platform
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed mb-8">
            Start-Up News was founded with a single belief: the stories of Bangladeshi entrepreneurs deserve world-class coverage. We cover the founders, startups, ideas, and capital flows shaping South Asia&apos;s fastest-growing economy.
          </p>
          <Link href="/subscribe" className="btn-primary">
            Join Our Community <ArrowRight size={15} />
          </Link>
        </div>
      </div>

      {/* Values */}
      <div className="container-wide py-16 lg:py-20">
        <div className="text-center mb-12">
          <span className="section-label">What We Stand For</span>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-brand-dark mt-2">Our Values</h2>
          <div className="w-10 h-0.5 bg-brand-red mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {values.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="border border-brand-border p-8 hover:border-brand-red transition-colors group">
              <div className="w-12 h-12 bg-brand-red/10 flex items-center justify-center mb-5 group-hover:bg-brand-red transition-colors">
                <Icon size={20} className="text-brand-red group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-serif text-xl font-bold text-brand-dark mb-3">{title}</h3>
              <p className="text-gray-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="bg-brand-dark py-16">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-0 divide-x divide-white/10">
            {[["2M+","Monthly Readers"],["500+","Founders Profiled"],["1,200+","Startups Listed"],["2026","Est. Year"]].map(([v,l]) => (
              <div key={l} className="text-center px-6 py-4">
                <div className="font-serif text-4xl font-bold text-white mb-1">{v}</div>
                <div className="text-gray-500 text-xs uppercase tracking-widest">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team */}
      <div className="container-wide py-16 lg:py-20">
        <div className="text-center mb-12">
          <span className="section-label">The People</span>
          <h2 className="font-serif text-3xl font-bold text-brand-dark mt-2">Our Teams</h2>
          <div className="w-10 h-0.5 bg-brand-red mx-auto mt-3" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {team.map(({ name, role, initial }) => (
            <div key={name} className="border border-brand-border p-8 text-center hover:border-brand-red transition-colors">
              <div className="w-16 h-16 bg-brand-red flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-serif font-bold text-2xl">{initial}</span>
              </div>
              <h3 className="font-bold text-brand-dark mb-1">{name}</h3>
              <p className="text-sm text-gray-400">{role}</p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="bg-brand-gray border-t border-brand-border py-16">
        <div className="container-wide text-center max-w-xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-brand-dark mb-3">Want to work with us?</h2>
          <p className="text-gray-500 mb-6">We&apos;re always looking for journalists, researchers, and builders who care about Bangladesh&apos;s startup ecosystem.</p>
          <div className="flex gap-3 justify-center">
            <Link href="/careers" className="btn-primary">View Openings <ArrowRight size={14} /></Link>
            <Link href="/contact" className="btn-outline">Get in Touch</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
