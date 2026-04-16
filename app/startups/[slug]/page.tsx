import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { connectDB } from "@/lib/mongodb";
import { Startup } from "@/lib/models/Startup";
import { ArrowLeft, MapPin, Calendar, Users, TrendingUp, Globe, Building2, ArrowUpRight } from "lucide-react";

export const revalidate = 60;

async function getStartup(slug: string) {
  try {
    await connectDB();
    const s = await Startup.findOne({ slug }).lean() as any;
    if (!s) return null;
    return { ...s, id: s._id.toString() };
  } catch { return null; }
}

async function getRelated(industry: string, id: string) {
  try {
    await connectDB();
    const data = await Startup.find({ industry, _id: { $ne: id } }).limit(4).lean() as any[];
    return data.map((s: any) => ({ ...s, id: s._id.toString() }));
  } catch { return []; }
}

export default async function StartupPage({ params }: { params: { slug: string } }) {
  const startup = await getStartup(params.slug);
  if (!startup) notFound();
  const related = await getRelated(startup.industry, startup.id);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero banner */}
      <div className="bg-brand-dark border-b border-white/10">
        <div className="container-wide py-10 lg:py-14">
          <Link href="/startups" className="inline-flex items-center gap-2 text-xs text-gray-500 hover:text-white transition-colors mb-8 uppercase tracking-wider">
            <ArrowLeft size={13} /> All Startups
          </Link>
          <div className="flex flex-col lg:flex-row lg:items-center gap-6">
            {/* Logo */}
            <div className="flex-shrink-0">
              {startup.logo ? (
                <div className="relative w-20 h-20 bg-white border border-white/10 overflow-hidden">
                  <Image src={startup.logo} alt={startup.name} fill className="object-contain p-2" />
                </div>
              ) : (
                <div className="w-20 h-20 bg-brand-red flex items-center justify-center">
                  <span className="text-white font-serif font-bold text-3xl">{startup.name?.charAt(0)}</span>
                </div>
              )}
            </div>
            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                {startup.stage && <span className="badge-red text-[10px]">{startup.stage}</span>}
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{startup.industry}</span>
              </div>
              <h1 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-2">{startup.name}</h1>
              <p className="text-gray-400 text-base lg:text-lg max-w-2xl">{startup.tagline}</p>
            </div>
            {/* CTA */}
            {startup.website && startup.website !== "#" && (
              <a href={startup.website} target="_blank" rel="noopener noreferrer"
                className="flex-shrink-0 flex items-center gap-2 bg-brand-red text-white px-6 py-3 text-sm font-bold uppercase tracking-wider hover:bg-red-700 transition-colors">
                Visit Website <ArrowUpRight size={14} />
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="border-b border-brand-border bg-brand-gray">
        <div className="container-wide">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-brand-border">
            {[
              { icon: Building2, label: "Industry", value: startup.industry },
              { icon: Calendar, label: "Founded", value: startup.founded },
              { icon: MapPin, label: "Location", value: startup.location },
              { icon: TrendingUp, label: "Funding", value: startup.funding },
            ].filter(i => i.value).map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-3 px-6 py-5">
                <Icon size={16} className="text-brand-red flex-shrink-0" />
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400">{label}</p>
                  <p className="font-bold text-sm text-brand-dark mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container-wide py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left — main */}
          <div className="lg:col-span-2 space-y-6">

            {/* About */}
            <div className="bg-white border border-brand-border p-8">
              <div className="flex items-center gap-2 mb-5">
                <div className="w-1 h-5 bg-brand-red" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">About</span>
              </div>
              <p className="text-gray-700 leading-relaxed text-base">{startup.description}</p>
            </div>

            {/* Funding highlight */}
            {startup.funding && (
              <div className="relative overflow-hidden bg-brand-dark p-8 flex items-center justify-between">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_left,_rgba(200,16,46,0.15)_0%,_transparent_60%)]" />
                <div className="relative">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 mb-2">Total Funding Raised</p>
                  <p className="font-serif text-4xl lg:text-5xl font-bold text-brand-gold">{startup.funding}</p>
                  <p className="text-gray-500 text-xs mt-2">{startup.stage} Stage · {startup.industry}</p>
                </div>
                <TrendingUp size={64} className="relative text-brand-gold/10 flex-shrink-0" />
              </div>
            )}

            {/* Founders */}
            {startup.founders?.length > 0 && (
              <div className="bg-white border border-brand-border p-8">
                <div className="flex items-center gap-2 mb-5">
                  <div className="w-1 h-5 bg-brand-red" />
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Founding Team</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {startup.founders.map((f: string) => (
                    <div key={f} className="flex items-center gap-2 border border-brand-border px-4 py-2.5 bg-brand-gray">
                      <div className="w-7 h-7 bg-brand-red flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{f.charAt(0)}</span>
                      </div>
                      <span className="text-sm font-medium text-brand-dark">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">

            {/* Quick facts */}
            <div className="bg-white border border-brand-border p-6">
              <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">Quick Facts</h3>
              <div className="space-y-4">
                {[
                  { label: "Company", value: startup.name },
                  { label: "Industry", value: startup.industry },
                  { label: "Stage", value: startup.stage },
                  { label: "Founded", value: startup.founded },
                  { label: "Location", value: startup.location },
                  { label: "Funding", value: startup.funding },
                ].filter(i => i.value).map(({ label, value }) => (
                  <div key={label} className="flex justify-between items-start gap-2 py-2 border-b border-brand-border last:border-0">
                    <span className="text-xs text-gray-400 flex-shrink-0">{label}</span>
                    <span className="text-xs font-semibold text-brand-dark text-right">{value}</span>
                  </div>
                ))}
              </div>
              {startup.website && startup.website !== "#" && (
                <a href={startup.website} target="_blank" rel="noopener noreferrer"
                  className="mt-5 flex items-center justify-center gap-2 w-full py-2.5 bg-brand-dark text-white text-xs font-bold uppercase tracking-wider hover:bg-gray-900 transition-colors">
                  <Globe size={13} /> Visit Website
                </a>
              )}
            </div>

            {/* Related */}
            {related.length > 0 && (
              <div className="bg-white border border-brand-border p-6">
                <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400 mb-4">More in {startup.industry}</h3>
                <div className="space-y-3">
                  {related.map((s: any) => (
                    <Link key={s.id} href={`/startups/${s.slug}`}
                      className="flex items-center gap-3 group py-2 border-b border-brand-border last:border-0">
                      {s.logo ? (
                        <div className="relative w-9 h-9 flex-shrink-0 border border-brand-border bg-gray-50 overflow-hidden">
                          <Image src={s.logo} alt={s.name} fill className="object-contain p-1" />
                        </div>
                      ) : (
                        <div className="w-9 h-9 bg-brand-red flex items-center justify-center flex-shrink-0">
                          <span className="text-white font-bold text-xs">{s.name?.charAt(0)}</span>
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-semibold text-brand-dark group-hover:text-brand-red transition-colors truncate">{s.name}</p>
                        <p className="text-[10px] text-gray-400 truncate">{s.tagline}</p>
                      </div>
                      <ArrowUpRight size={13} className="text-gray-300 group-hover:text-brand-red transition-colors flex-shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
