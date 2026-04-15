import Image from "next/image";
import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import { Startup as StartupModel } from "@/lib/models/Startup";
import { MapPin, Calendar, Users } from "lucide-react";

export const revalidate = 0;

const stageColors: Record<string, string> = {
  "Pre-seed": "bg-gray-100 text-gray-600",
  "Seed": "bg-green-100 text-green-700",
  "Series A": "bg-blue-100 text-blue-700",
  "Series B": "bg-purple-100 text-purple-700",
  "Series C": "bg-orange-100 text-orange-700",
  "Growth": "bg-brand-red/10 text-brand-red",
};

async function getStartups() {
  try {
    await connectDB();
    const data = await StartupModel.find().sort({ createdAt: -1 }).lean();
    return data.map((s: any) => ({ ...s, id: s._id.toString() }));
  } catch { return []; }
}

export default async function StartupsPage() {
  const startups = await getStartups();
  const industries = ["All", ...Array.from(new Set(startups.map((s: any) => s.industry).filter(Boolean)))];
  const stages = ["All Stages", "Pre-seed", "Seed", "Series A", "Series B", "Series C", "Growth"];
  return (
    <div className="section-pad">
      <div className="container-wide">
        <div className="border-b border-brand-border pb-5 mb-6">
          <span className="section-label">Directory</span>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-brand-dark mt-2 mb-4">Startup Directory</h1>
          <p className="text-gray-500 max-w-xl">Discover Bangladesh&apos;s most innovative startups across every industry and stage.</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {industries.map((ind) => (
              <button key={ind} className={`px-3 py-1.5 text-xs font-semibold uppercase tracking-wider border transition-colors ${
                ind === "All" ? "bg-brand-red text-white border-brand-red" : "border-brand-border text-gray-600 hover:border-brand-red hover:text-brand-red"
              }`}>{ind}</button>
            ))}
          </div>
          <select className="bg-white border border-brand-border text-gray-600 px-3 py-1.5 text-xs focus:outline-none focus:border-brand-red sm:ml-auto">
            {stages.map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {startups.map((startup) => (
            <Link key={startup.id} href={`/startups/${startup.slug}`}
              className="group bg-white border border-brand-border card-hover block overflow-hidden">
              <div className="relative h-40 overflow-hidden bg-gray-100">
                {startup.logo ? (
                  <Image src={startup.logo} alt={startup.name} fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <span className="font-serif font-bold text-4xl text-gray-400">{startup.name?.charAt(0)}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute top-3 right-3">
                  <span className={`badge text-[9px] ${stageColors[startup.stage] || ""}`}>{startup.stage}</span>
                </div>
                {startup.funding && (
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-green-600 text-white text-xs font-bold px-2 py-0.5">{startup.funding} raised</span>
                  </div>
                )}
              </div>
              <div className="p-5">
                <span className="section-label text-[9px]">{startup.industry}</span>
                <h2 className="font-serif font-bold text-lg text-brand-dark mt-0.5 mb-1 group-hover:text-brand-red transition-colors">{startup.name}</h2>
                <p className="text-gray-500 text-sm mb-4">{startup.tagline}</p>
                <div className="flex flex-wrap gap-3 text-xs text-gray-400 border-t border-brand-border pt-3">
                  <span className="flex items-center gap-1"><MapPin size={10} />{startup.location}</span>
                  <span className="flex items-center gap-1"><Calendar size={10} />Est. {startup.founded}</span>
                  <span className="flex items-center gap-1"><Users size={10} />{startup.founders[0]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-10 mb-6">
          <p className="text-[9px] uppercase tracking-[0.2em] text-gray-400 mb-2 text-center">Advertisement</p>
          <a href="/advertise"
            className="group relative flex items-center justify-between overflow-hidden bg-brand-dark border border-white/10 px-6 py-4 hover:border-brand-red transition-colors cursor-pointer">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(200,16,46,0.12)_0%,_transparent_60%)] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.04] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
            <div className="relative flex items-center gap-4">
              <div className="w-9 h-9 bg-brand-red flex items-center justify-center flex-shrink-0">
                <span className="text-white font-serif font-bold text-sm">SUN</span>
              </div>
              <div>
                <p className="text-white font-semibold text-sm">Feature your startup on Start-Up News</p>
                <p className="text-gray-500 text-xs mt-0.5">Get discovered by investors, partners & customers</p>
              </div>
            </div>
            <span className="relative hidden sm:block bg-brand-red text-white text-xs font-bold uppercase tracking-wider px-5 py-2 group-hover:bg-red-700 transition-colors whitespace-nowrap">
              Advertise →
            </span>
          </a>
        </div>

        <div className="bg-brand-dark text-white p-10 text-center">
          <h3 className="font-serif text-2xl font-bold mb-2">Is your startup missing?</h3>
          <p className="text-gray-400 mb-6">Submit your startup to be featured in Bangladesh&apos;s most comprehensive startup directory.</p>
          <Link href="/startups/submit" className="btn-primary">Submit Your Startup</Link>
        </div>
      </div>
    </div>
  );
}
