import Link from "next/link";
import { ArrowRight, MapPin, Clock, Briefcase } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Careers — Start-Up News",
  description: "Join the team building Bangladesh's premier startup media platform.",
};

const openings = [
  {
    title: "Senior Reporter — Startups & Tech",
    type: "Full-time",
    location: "Dhaka, Bangladesh",
    dept: "Editorial",
    desc: "Cover Bangladesh's fast-growing startup ecosystem. Break news, write features, and build relationships with founders and investors.",
  },
  {
    title: "Frontend Developer",
    type: "Full-time",
    location: "Remote / Dhaka",
    dept: "Product",
    desc: "Build and improve our Next.js platform. Work on reader-facing features, performance, and the tools our editorial team uses daily.",
  },
  {
    title: "Social Media Manager",
    type: "Part-time",
    location: "Remote",
    dept: "Marketing",
    desc: "Grow our presence across Facebook, LinkedIn, and Instagram. Create content that resonates with Bangladesh's entrepreneurial community.",
  },
  {
    title: "Research Analyst",
    type: "Full-time",
    location: "Dhaka, Bangladesh",
    dept: "Research",
    desc: "Compile data for our annual rankings, startup database, and industry reports. Strong analytical skills and knowledge of BD business landscape required.",
  },
];

const perks = [
  "Flexible working hours",
  "Remote-friendly culture",
  "Access to Bangladesh's top founder network",
  "Competitive salary",
  "Learning & development budget",
  "Front-row seat to BD's startup boom",
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-brand-dark text-white py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(200,16,46,0.15)_0%,_transparent_60%)] pointer-events-none" />
        <div className="container-wide relative">
          <span className="section-label mb-4 block">Careers</span>
          <h1 className="font-serif text-4xl lg:text-6xl font-bold leading-tight max-w-3xl mb-6">
            Build the Future of<br />
            <span className="text-brand-red">BD Startup Media</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl leading-relaxed">
            We&apos;re a small, ambitious team on a mission to tell the stories of Bangladesh&apos;s entrepreneurs. If you care about great journalism, great products, and great companies — we want to hear from you.
          </p>
        </div>
      </div>

      {/* Perks */}
      <div className="border-b border-brand-border">
        <div className="container-wide py-12">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {perks.map((perk) => (
              <div key={perk} className="flex items-center gap-3 p-4 bg-brand-gray border border-brand-border">
                <span className="w-2 h-2 bg-brand-red flex-shrink-0" />
                <span className="text-sm text-gray-700 font-medium">{perk}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Openings */}
      <div className="container-wide py-16 lg:py-20">
        <div className="mb-10">
          <span className="section-label">Open Roles</span>
          <h2 className="font-serif text-3xl font-bold text-brand-dark mt-2">Current Openings</h2>
          <div className="w-10 h-0.5 bg-brand-red mt-3" />
        </div>
        <div className="space-y-4 max-w-3xl">
          {openings.map((job) => (
            <div key={job.title} className="border border-brand-border p-6 hover:border-brand-red transition-colors group">
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-red mb-1 block">{job.dept}</span>
                  <h3 className="font-serif text-lg font-bold text-brand-dark group-hover:text-brand-red transition-colors">{job.title}</h3>
                </div>
                <a href={`mailto:careers@start-upnews.com?subject=Application: ${job.title}`}
                  className="flex-shrink-0 flex items-center gap-1.5 bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-4 py-2 hover:bg-red-700 transition-colors">
                  Apply <ArrowRight size={12} />
                </a>
              </div>
              <p className="text-gray-500 text-sm mb-4 leading-relaxed">{job.desc}</p>
              <div className="flex flex-wrap gap-4 text-xs text-gray-400">
                <span className="flex items-center gap-1.5"><Briefcase size={12} /> {job.type}</span>
                <span className="flex items-center gap-1.5"><MapPin size={12} /> {job.location}</span>
                <span className="flex items-center gap-1.5"><Clock size={12} /> Open now</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* General CTA */}
      <div className="bg-brand-gray border-t border-brand-border py-16">
        <div className="container-wide text-center max-w-xl mx-auto">
          <h2 className="font-serif text-3xl font-bold text-brand-dark mb-3">Don&apos;t see your role?</h2>
          <p className="text-gray-500 mb-6">We&apos;re always open to hearing from talented people. Send us your CV and tell us how you&apos;d contribute.</p>
          <a href="mailto:careers@start-upnews.com" className="btn-primary">
            careers@start-upnews.com <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
